var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth/5;
canvas.height = window.innerHeight/5;
const width = canvas.width
const height = canvas.height
var mouse = {
    x: undefined,
    y: undefined
}

const c = canvas.getContext("2d");

window.addEventListener('mousemove', 
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
})
window.addEventListener("mousedown", onPress, false);
window.addEventListener("mouseup", onUnPress, false);
// event functions
var mouseDown = false;
function onPress(){
    mouseDown = true;
}
function onUnPress(){
    mouseDown = false;
}

var sand = new Array(width*height).fill(0);
var oldSand = sand // we use this to check if things changed from last frame

// various sand functions
function swap(a, b){
    var temp = sand[a];
    sand[a] = sand[b];
    sand[b] = temp;
}
function below(a){
    return a+width;
}
function above(a){
    return a-width;
}
function isEmpty(a){
    return sand[a] == 0;
}
function isWater(a){
    return sand[a] == 100;
}
function rand(){
    return Math.random()*40-20; 
}

var tool = 0
document.getElementById('sand').addEventListener('click', function() {
    tool = 0;
});
document.getElementById('water').addEventListener('click', function() {
    tool = 1;
});
document.getElementById('void').addEventListener('click', function() {
    tool = 2;
});

function draw(){
    if(mouseDown){ // if mouse activated
        var mx = Math.floor(mouse.x/5.0)
        var my = Math.floor(mouse.y/5.0)
        var a = (mx) + (my) * width
        if(tool == 0){
            // draw in the 5 pixels around
            sand[a] = rand()
            sand[above(a)] = rand()
            sand[below(a)] = rand()
            sand[a+1] = rand() 
            sand[a-1] = rand()
        }
        else if(tool == 1){
            sand[a] = 100
            sand[above(a)] = 100
            sand[below(a)] = 100
            sand[a+1] = 100
            sand[a-1] = 100
        }
        else if(tool == 2){
            sand[a] = 0
            sand[above(a)] = 0
            sand[below(a)] = 0
            sand[a+1] = 0
            sand[a-1] = 0
        }
    }
    const myImageData = c.createImageData(width, height);
    const data = myImageData.data;
    for(let pix = data.length; pix >= 0; pix-=4){
        var pixel = (pix/4)
        
        
        // draw the pixel
        if(sand[pixel]!=0 && sand[pixel]!=100){
            
            data[pix] = sand[pixel]+245;     // red
            data[pix + 1] = sand[pixel]+200; // green
            data[pix + 2] = sand[pixel]+65; // blue
            data[pix + 3] = 255; // alpha (opacity)
            
        }
        else if(sand[pixel]==100){ // if water
            data[pix] = 0;     // red
            data[pix + 1] = 0; // green
            data[pix + 2] = 200; // blue
            data[pix + 3] = 255; // alpha (opacity)
        }
        else{
            data[pix] = sand[pixel];     // red
            data[pix + 1] = sand[pixel]; // green
            data[pix + 2] = sand[pixel]; // blue
            data[pix + 3] = 255; // alpha (opacity)
        }



        // update
        if(sand[pixel]==100){ // water
            if(isEmpty(below(pixel))){
                swap(pixel, below(pixel));
            }
            else{
                if(isEmpty(below(pixel+1))){
                    swap(pixel, below(pixel+1))
                }
                else if(isEmpty(below(pixel-1))){
                    swap(pixel, below(pixel-1))
                }
                if(isEmpty(below(pixel+2))){
                    swap(pixel, below(pixel+2))
                }
                else if(isEmpty(below(pixel-2))){
                    swap(pixel, below(pixel-2))
                }
                else{ // water tries to flatten
                    if(Math.round(Math.random())==1){
                        if(isEmpty(pixel+1)){ 
                            swap(pixel, pixel+1)
                        }
                        else if(isEmpty(pixel-1)){
                            swap(pixel, pixel-1)
                        }

                    }
                    else{
                        if(isEmpty(pixel-1)){ 
                            swap(pixel, pixel-1)
                        }
                        else if(isEmpty(pixel+1)){
                            swap(pixel, pixel+1)
                        }
                    }
                    
                    
                }
            }
        }
        else if(sand[pixel] != 0){ // sand
            if(isEmpty(below(pixel))){
                swap(pixel, below(pixel));
            }
            else if(isWater(below(pixel))){ // sand gets priority as it is heavier
                swap(pixel, below(pixel)); 
            }
            else{
                if(isEmpty(below(pixel+1))){
                    swap(pixel, below(pixel+1))
                }
                else if(isEmpty(below(pixel-1))){
                    swap(pixel, below(pixel-1))
                }

                if(isWater(below(pixel+1))){ // for water
                    swap(pixel, below(pixel+1))
                }
                else if(isWater(below(pixel-1))){
                    swap(pixel, below(pixel-1))
                }
            }

        }
    }
    c.putImageData(myImageData, 0, 0);
    oldSand = sand // before we do all the changes

}




function animate() {
    window.requestAnimationFrame(animate);
    draw()
}

animate();
