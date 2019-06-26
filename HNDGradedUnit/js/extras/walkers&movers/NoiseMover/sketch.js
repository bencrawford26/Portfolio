var m;

function setup() {
    //define canvas size
    createCanvas(windowWidth,250);
    //create mover object
    m = new Mover();
}

function draw() {
    //set background color
    background(255);
    
    //call functions on mover object
    m.update();
    m.display();
    m.checkEdges();
}