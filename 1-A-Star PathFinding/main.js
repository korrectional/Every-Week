var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth-30;
canvas.height = window.innerHeight-30;


var c = canvas.getContext('2d');




function Point(id ,x , y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.dx = Math.random()*5-2.5;
    this.dy = Math.random()*5-2.5;
    this.color = 'white';
    this.changeColor = function(color) {
        this.color = color;
    }
    this.update = function() {
        if(this.x+this.dx-10 < 0 || this.x+this.dx+10 > canvas.width) {
            this.dx = -this.dx;
        }
        if(this.y+this.dy-10 < 0 || this.y+this.dy+10 > canvas.height) {
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
    }
    this.draw = function() {
        c.beginPath();
        c.fillStyle = this.color; // Ensure text is visible by setting a contrasting color
        c.arc(this.x, this.y, 10, 0, Math.PI*2);
        c.fill();
    }
}

var points = [];
for(var i = 0; i < Math.floor(Math.random()*10)+5; i++) {
    var p = new Point(i, Math.random()*(canvas.width-20)+10, Math.random()*(canvas.height-20)+10);
    points.push(p);
}



var roads = {}; // create the network
for(var i = 0; i < points.length; i++) {
    roads[i] = [];
    for(var j = 1; j < Math.random()*3; j++) {
        var add = Math.floor(Math.random()*points.length);
        if(add == i || roads[i].includes(add)) {
            continue;
        }
        roads[i].push(add);
        if(!roads[add]) {
            roads[add] = [];
        }
        roads[add].push(i);
    }
    if(roads[i].length == 0) {// safety check so theres no lonely points
        roads[i].push(Math.floor(Math.random()*points.length));
    }
}
function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    algorithm();
    requestAnimationFrame(animate);
}
animate();

function algorithm() {


    c.fillStyle = 'black';
    for(var i = 0; i < points.length; i++) {
        points[i].changeColor('white');
        points[i].update();
        points[i].draw();
    }


    for(var key in roads){
        for(var j = 0; j < roads[key].length; j++){
            c.strokeStyle = 'white';
            c.beginPath();
            c.moveTo(points[key].x, points[key].y);
            c.lineTo(points[roads[key][j]].x, points[roads[key][j]].y);
            c.stroke();
        }
    }


    function getDistance(point1, point2) {
        let dx = point1.x - point2.x;
        let dy = point1.y - point2.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    // algorithm
    var len = points.length-1;
    var tower = [];
    var done = [];
    tower.push({
        id: points[0].id,
        pred: null,
        heur: 0,
        dy: 0
    });
    var finished = false;

    var broke = false;
    var itenerations = 0;
    while(finished == false) {
        itenerations++;
        for(i in roads[tower[0].id]) {
            if(roads[tower[0].id][i] == tower[0].pred) {
                continue;
            }
            else if(roads[tower[0].id][i] == len){
                console.log("done");
                var completePath = [];
                completePath.push(points[len].id);
                completePath.push(tower[0].id);
                var mostRecent = tower[0].pred;
                while(mostRecent != null){
                    completePath.push(mostRecent);
                    mostRecent = done.find(item => item.id === mostRecent).pred;
                }
                completePath.reverse();
                console.log("COMPLETE PATH: ", completePath);
                finished = true;
                break;
            }
            let currentPoint = points[tower[0].id];
            let neighborPoint = points[roads[tower[0].id][i]];
            let goalPoint = points[len];  
            let heur = getDistance(currentPoint, neighborPoint) + 
                    getDistance(neighborPoint, goalPoint);
            tower.push({
                id: roads[tower[0].id][i],
                pred: tower[0].id,
                heur: heur,
                dy: tower[0].dy + getDistance(points[0], neighborPoint)
            });
        }

        if(finished){
            break;
        }

        done.push(tower[0]);
        tower.splice(0, 1);
        if(tower.length == 0) {
            console.log("NO SOLUTION");
            broke = true;
            break;
        }
        tower.sort((a, b) => a.heur - b.heur);

        if(tower[0].id == points[len].id) {
            break;
        }
        if(itenerations > points.length*2) { // safety check
            console.log("NO SOLUTION");
            broke = true;
            break;
        }
    }

    if(!broke){
        completePath.forEach(function(point) {
            points[point].changeColor('green');
            points[point].draw();
        
            roads[point].forEach(function(road) {
                if(completePath.includes(road)) {
                    c.strokeStyle = 'green';
                    c.beginPath();
                    c.moveTo(points[point].x, points[point].y);
                    c.lineTo(points[road].x, points[road].y);
                    c.stroke();
                }
            });
        });
        c.strokeStyle = 'white';
    }

}

