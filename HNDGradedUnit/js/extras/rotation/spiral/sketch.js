var r;
var theta;


function setup() {
    createCanvas(500,250);
    background(255);
    r = 0;
    theta = 0;
}

function draw() {
    
    //polar coordinates (r, theta) are converted to Cartesian (x,y) for use in the ellipse() function.
    var x = r * cos(theta);
    var y = r * sin(theta);
    
    noStroke();
    fill(0);
    ellipse(x+width/2, y+height/2, 16, 16);
    
    theta += 0.01;
    r += 0.05;
}