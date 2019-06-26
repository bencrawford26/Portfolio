var bln;
var clouds = [];
var time;

var wind;

function setup() {
    createCanvas(windowWidth,500);
    
    for(var i = 0; i < 17; i++){
        clouds[i] = new Cloud();
    }
    
    bln = new Balloon();
    
    time = 0;
}

function draw() {
    background(180, 180, 255);
    
    
    wind = createVector(map(noise(time),0,1,-0.5,0.5),-0.0001);
    
    bln.applyForce(wind);
    bln.update();
    bln.display();
    bln.checkEdges();
    
    wind.mult(0.1);
    
    for(var i = 0; i < clouds.length; i++) {
        clouds[i].display();
        clouds[i].update();
        clouds[i].checkEdges();
        clouds[i].applyForce(wind);
    }
    
    time+=0.1;
}