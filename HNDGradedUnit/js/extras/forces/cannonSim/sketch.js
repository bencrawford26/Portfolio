var ammo;

function setup() {
    createCanvas(windowWidth,400);
    ammo = new Munitions();
}

function draw() {
    background(255);
    
    var gravity = createVector(0, ammo.mass*0.2);
    
    if(ammo.loc.x >= 150) {
        ammo.applyForce(gravity);
    }
    
    var launch = createVector(random(2,3),-1);
    
    if(mouseIsPressed) {
        ammo.loc.x = 90;
        ammo.loc.y = height-80;
        ammo.applyForce(launch);
    }
    
    ammo.checkEdges();
    ammo.update();
    
    drawCannon();
    
    ammo.display();
}

function drawCannon() {
    fill(255);
    rectMode(CORNER);
    push();
    translate(10, height-60);
    rotate(radians(340));
    rect(60,0,100,20);
    pop();
  
    push();
    translate(10, height-60);
    ellipse(60,0,60,60);
    rect(0,0,120,40);
    ellipse(32,40,32,32);
    ellipse(88,40,32,32);
    pop();
}