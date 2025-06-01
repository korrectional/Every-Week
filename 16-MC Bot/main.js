const mf = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const collectBlock = require('mineflayer-collectblock').plugin



const bot = mf.createBot({
    host: 'bacabaca.aternos.me',
    port: 23864,
    username: 'Rigga'
});
bot.loadPlugin(pathfinder);
bot.loadPlugin(collectBlock)

const RANGE_GOAL = 1;

bot.on('spawn', () => {
    bot.chat("hi loosers")
});


let busy = false;

bot.once('spawn', () => {


    const defaultMove = new Movements(bot);

    bot.on('chat', async (usr, msg) => {
        if(usr==bot.username) return;

        const args = msg.split(' ');
        if(args[0] == "stop"){
            busy = true;
        }
        if(args[0] == "collect"){
            const blockType = bot.registry.blocksByName[args[1]];
            if (!blockType) {
                bot.chat("I don't know any blocks with that name.")
                return
            }
            bot.chat('Collecting the nearest ' + blockType.name)
            
            
            let range = 16;
            if(args[2]){
                range = args[2];
            }

            mineBlock(blockType, 16);
            
        }

        if(msg=="come"){
            const target = bot.players[usr]?.entity;
            if(!target){
                bot.chat("Sorry can't see you bro");
                return;
            }
            const {x:x, y:y, z:z} = target.position;
    
            bot.pathfinder.setMovements(defaultMove);
            bot.pathfinder.setGoal(new GoalNear(x, y, z));
        }

    })
    
    
    bot.on('time', async () => {
        if(bot.food < 15){
            try{
                bot.chat("Oh no hungry");
                await bot.consume();
            }
            catch(error){
                console.log(error);
            }
        }
    })

})



async function mineBlock(blockType, range){
    while(true){
        if(busy){busy = false; break;}
        const block = bot.findBlock({
            matching: blockType.id,
            maxDistance: range
        })
        if (!block) {
            bot.chat("I don't see that block nearby.")
            return
        }
        const targets = bot.collectBlock.findFromVein(block)
        try {
            await bot.collectBlock.collect(targets)
            bot.chat('Done with this vein')
        } catch (err) {
            bot.chat(err.message)
            console.log(err)
            if(err.message == "Took to long to decide path to goal!"){
                console.log("happened")
            }
        }
    }
}





