var ship;
var thrust;

function setup() {
    createCanvas(windowWidth,windowHeight);
    
    ship = new Spaceship();
}

function draw() {
    background(255);
    
    ship.update();
    ship.display();
    ship.checkEdges();
}

function keyPressed() {
    if(keyIsPressed && keyCode == 90) {
        thrust = p5.Vector.fromAngle(ship.theta-HALF_PI);
        ship.applyForce(thrust);
        ship.boost = true;
    } else {
        ship.boost = false;
    }
}