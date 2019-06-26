var m = [];

function setup() {
    createCanvas(windowWidth,250);
    for(var i = 0; i < 25; i++){
        m[i] = new Mover(random(1,1.5));
    }
}

function draw() {
    background(255);
    
    gravity = createVector(0,0.05);
    
    edge = createVector(width-100, height-100)
    axis = createVector(100,100)
    
    
    for(var i = 0; i < m.length; i++){
        wind = p5.Vector.sub(axis, m[i].loc);
        wind.normalize();
        wind.mult(1);
        m[i].applyForce(wind);

        counterWind = p5.Vector.sub(edge, m[i].loc);
        counterWind.normalize();
        counterWind.mult(0.5);
        m[i].applyForce(counterWind);

        m[i].applyForce(gravity);
        m[i].update();
        m[i].display();
    }
}