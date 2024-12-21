var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
var target = "top";



var t = 1;

var scale = height/2 - height/20;
var offsetx = width/8;
var centerx = width/2;
var centery = height/2;
function calculate(){
    if(target == "center"){
        scale = scale + t;
        centerx = centerx + t*0.75;
        centery = centery;
    }
    else if(target == "top"){
        scale = scale + t;
        centerx = centerx + t*0.34653;
        centery = centery + t*-0.65659;
    }

    const myImageData = c.createImageData(width, height);
    const data = myImageData.data;
    for(let x = 0; x < width; x++){
        for(let y = 0; y < height; y++){
            var pix =  (x+y*width)*4;
            var color = Mandelbrot((x-centerx-offsetx)/scale,(y-centery)/scale);
            data[pix] = color;     // red
            data[pix + 1] = color; // green
            data[pix + 2] = color; // blue
            data[pix + 3] = 255; // alpha (opacity)
        }
    }
    c.putImageData(myImageData, 0, 0);
    t *= 1.1;
}




function Mandelbrot(x,y){

    var cx = x; var cy = y;
    var n = 0;
    while(n<100){
        var aa = x*x - y*y;
        var bb = 2*x*y;
        x = aa + cx;
        y = bb + cy;
        if(Math.abs(x + y) > 16){
            break;
        }
        n++;
    }
    return n/100 * 255;
}




function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    calculate();
}

animate();

