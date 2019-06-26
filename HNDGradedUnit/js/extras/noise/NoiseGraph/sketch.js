var time;
var x;
var y;
var inc;

var incSlider;
var xSlider;

function setup() {
    createCanvas(windowWidth,400);
    
    x = 0;
    time = 0;
    
    background(255);
    
    //create sliders to change time increments and the speed of x axis traversal
    incSlider = createSlider(0,1000,1);
    incSlider.position(10,height-20);
    xSlider = createSlider(0,1000,1);
    xSlider.position(10,height-45);
}

function draw() {
    checkEdges();
    display();
}

function display() {
    inc = map(incSlider.value(), 0, 1000, 0.001, 0.1);
    
    y = map(noise(time),0,1,0,height);
    
    line(x, y, x, y);
    
    push();
    fill(0);
    textSize(12);
    text("Press c to clear", 15, 15);
    text(" - x speed", incSlider.x * 2 + incSlider.width,height-30);
    text(" - noise", xSlider.x * 2 + xSlider.width,height-5);
    pop();
    
    x += map(xSlider.value(), 0, 1000, 0.1, 1);
    time+=inc;
}

function checkEdges() {
    if (x > width) {
        x = 0;
    }
}

function keyPressed() {
    if(keyIsPressed && keyCode == 67) {
        background(255);
        x = 0;
    }
}