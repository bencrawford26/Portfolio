var loc;

var rot;

function setup() {
    createCanvas(400,250);
    loc = createVector(width/2, height/2);
    rot = 0;
}

function draw() {
    background(255);
    strokeWeight(3);
    stroke(0);
    fill(200);
    
    push();
    
    translate(loc.x, loc.y);
    rotate(radians(rot));
    line(-50,0,50,0);
    ellipse(-50, 0, 20, 20);
    ellipse(50,0,20,20);
    
    pop();
    
    rot+=3;
}