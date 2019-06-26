var r = 0;
var theta = 0;
var rSlider, tSlider;

//colour animation vectors
var xoffs;
var yoffs;
var increments;

function setup() {
    createCanvas(windowWidth, 350);
    background(255);
    
    //create vectors for colour and noise incerments
    xoffs = createVector(0.0, 1.0, 2.0);
    yoffs = createVector(0.0, 1.0, 2.0);
    increments = createVector(0.001, 0.001, 0.001);
    
    //create sliders to change theta and radius
    rSlider = createSlider(0,1000,1);
    rSlider.position(10,height-20);
    tSlider = createSlider(0,1000,1);
    tSlider.position(10,height-70);
}

function draw() {
    //Polar coordinates (r,theta) are converted to Cartesian (x,y) for use in the ellipse() function.
    var x = r * cos(theta);
    var y = r * sin(theta);
    
    noStroke();
    addColour();
    ellipse(x + width / 2, y + height / 2, 4, 4);
    
    push();
    fill(100,100);
    textSize(16);
    text(" - theta", tSlider.x * 2 + tSlider.width,height-55);
    text(" - radius", rSlider.x * 2 + rSlider.width,height-5);
    pop();
    
    theta += map(tSlider.value(),0,1000,0.01,0.3);
    r += map(rSlider.value(),0,1000,0.01,0.2);
}

function addColour() {
    //use xoff and yoff for noise
    var r = map(noise(xoffs.x, yoffs.x), 0, 1, 0, 255);
    var g = map(noise(xoffs.y, yoffs.y), 0, 1, 0, 255);
    var b = map(noise(xoffs.z, yoffs.z), 0, 1, 0, 255);
    
    fill(r, g, b, 100);
    
    xoffs.add(increments);
    yoffs.add(increments);
}

function keyPressed() {
    if(keyIsPressed && keyCode == 67) {
        background(255);
        r = 0;
        theta = 0;
    }
}