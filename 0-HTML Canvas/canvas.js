
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth-10;
canvas.height = window.innerHeight-10;


var mouse = {
    x: undefined,
    y: undefined
}



const c = canvas.getContext("2d");


window.addEventListener('mousemove', 
    function(event){
        mouse.x = event.x;
        mouse.y = event.y;
}
)





function Circle(x, y, radius) {
    this.radius = radius;//Math.random() * 20;
    this.x = x;
    this.y = y;
    this.dx = Math.random() * 0.5-0.25;
    this.dy = Math.random() * 0.5-0.25;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        c.fill();
    }

    this.update = function() {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;

        var maxRadius = 40;
        var minRadius = 5;

        // interact
        if(mouse.x - this.x < 50 && mouse.y - this.y < 50 && mouse.x - this.x > -50 && mouse.y - this.y > -50){
            if(this.radius < maxRadius){
                this.radius += 1;
            }
        } else if(this.radius > minRadius){
            this.radius -= 1;
        }


        this.draw();
    }
}

var circleArray = [];
for(var i = 0; i < 1000; i++){
    var radius = 10;
    var circle = new Circle(Math.random() * (canvas.width-radius) + radius, Math.random() * (canvas.height-radius)+radius, radius);
    circleArray.push(circle);
}

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < circleArray.length; i++){
        circleArray[i].update();
    }
}

animate();
