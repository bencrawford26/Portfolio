var w;

function setup() {
    createCanvas(windowWidth,250);
    background(255);
    w = new Walker();
}

function draw() {
    w.step();
    w.display();
}
