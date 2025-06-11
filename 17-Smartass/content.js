let qa = [];
let runloop = true;
function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function getQuestions(){
    await chrome.storage.local.get(['qa'], (result) => {
        qa = result.qa || [];
        //console.log("Retrieved array:", qa);
    })
    
    await delay(3000);
    const title = document.querySelector('.multiple-choice-component');
    const opcontainer = document.querySelectorAll('.choice-row');

    if(title){
        //console.log(title.textContent.split('Multiple')[0])
        
        const ttl = title.textContent.split('Multiple')[0];
        let known = false;
        let knownA;
        //console.log(qa.length);
        for(let i = (qa.length - 1); i >= 0; i--){
            if(ttl == qa[i].q){
                known = true;
                knownA = qa[i].a;
                console.log("Seen this before!");
                break;
            }
        }
        
        
        let chosen;
        if(!known){
            //console.log("IDK IDK!!!");
            const randomIndex = Math.floor(Math.random() * opcontainer.length);
            chosen = opcontainer[randomIndex];
        }
        else{
            for(let i = 0; i < opcontainer.length; i++){
                if(opcontainer[i].textContent == knownA){
                    chosen = opcontainer[i];
                    //console.log("Selected from memory:", opcontainer[i]);
                    break;
                }
            }
        }
        //console.log("Choice:", chosen.textContent);
        try{
            chosen.children[0].children[0].children[0].children[0].click();
        }
        catch(err){
            console.log(err)
        }
        
        
        await delay(1000);
        const confidence = document.querySelector('[aria-label="Medium Confidence"]');
        confidence.click();
        //console.log("Clicked confidence")

        await delay(2000);
        //console.log("scanning result")
        const text = document.body.textContent;
        if(text.split('Your Answer ')[1].startsWith('inc')){
            console.log("incorrect");

            let correct = "none";
            for(let i = 0; i < opcontainer.length; i++){
                const split = text.split(opcontainer[i].textContent);
                let happened = false;
                for(let j = 1; j < split.length; j++){
                    if(split[j].startsWith("Reason") || split[j].startsWith("incorrect")){
                        happened = true;
                        break;
                    }
                }
                if(!happened){
                    correct = opcontainer[i];
                    break;
                }
            }
            //console.log("Correct was: ")
            //console.log(correct.textContent);

            qa.push({q: title.textContent.split('Multiple')[0], a: correct.textContent}) // memorized question
            if(qa.length>20){
                qa = [];
                clearData();
            }
            //console.log("recorded", qa)
            chrome.storage.local.set({ qa });


            const readup = document.querySelector('[data-automation-id="lr-tray_reading-button"]');
            if(readup){
                readup.click();
                //console.log("reading on concept and waiting");
                await delay(1000);
                const gotoq = document.querySelector('[data-automation-id="reading-questions-button"]');
                gotoq.click();
                //console.log("Going to next pages");
                await delay(1000);
                const gotoq2 = document.querySelector('[class="btn btn-primary next-button"]');
                gotoq2.click();
                await delay(1000);
                //console.log("Finished cicle!")
            }
            else{
                //console.log("no readup button");
            }
        }
        else{
            //console.log("correct");
            try{
                const gotoq2 = document.querySelector('[class="btn btn-primary next-button"]');
                gotoq2.click();
                await delay(1000);
                //console.log("Finished cicle!")
            }
            catch(err){
                //console.log(err);
            }
        }
    }
    else{
        //console.log("Still havent found")
        if(document.body.textContent.includes("Multiple Select")){
            //console.log("Its a multiple selection sadly. That means time to go witness");
            
            const witness = document.querySelector('[type="checkbox"]');
            witness.click();
            //console.log("Witnessed");
            const confidence = document.querySelector('[aria-label="Medium Confidence"]');
            confidence.click();
            
            await delay(2000);
            const readup = document.querySelector('[data-automation-id="lr-tray_reading-button"]');
            if(readup){
                //console.log("reading up");
                readup.click();
                //console.log("reading on concept and waiting");
                await delay(1000);
                const gotoq = document.querySelector('[data-automation-id="reading-questions-button"]');
                gotoq.click();
                //console.log("Going to next pages");
                await delay(1000);
                const gotoq2 = document.querySelector('[class="btn btn-primary next-button"]');
                gotoq2.click();
                await delay(1000);
                //console.log("Finished cicle!")
            }
            else{
                //console.log("no readup button");
            }
        }
        else{
            runloop = false;
            return;
        }
    }
}

(async () => {
    while(runloop){
        await getQuestions();
    }
})();


function clearData(){
    const clearArray = [];
    chrome.storage.local.set({ clearArray });
}