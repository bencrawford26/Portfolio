var car;

function setup() {
    createCanvas(windowWidth,400);
    
    car = new Vehicle();
}

function draw() {
    background(255);
    
    car.update();
    car.display();
    car.checkEdges();
}