var m = [];
var time = 0;

function setup() {
    createCanvas(windowWidth,500);
    
    for(var i = 0; i < 25; i++) {
        m[i] = new Mover(random(0.3,2));
        time+=0.1;
    }
}

function draw() {
    background(255);
    
    var wind = createVector(0.1,0);
    
    for(var i = 0; i < m.length; i++) {
        
        var mass1 = m[i].mass;
        var gravity = createVector(0,0.1*mass1);
        
        frictionPockets();
        
        m[i].applyForce(wind);
        m[i].applyForce(gravity);
        m[i].update();
        m[i].display();
        m[i].checkEdges();
    }
}

function frictionPockets() {
    for(var i = 0; i < m.length; i++) {
        
        var c = 0.01;
        var friction = m[i].vel.copy();
        friction.mult(-1);
        friction.normalize();
        friction.mult(c);
        
        if(m[i].loc.x >= 0 && m[i].loc.x <= 100) {
            
            m[i].applyForce(friction);
            
        } else if(m[i].loc.x >= 450 && m[i].loc.x <= 550) {
            var f = p5.Vector.mult(friction, -1);
            m[i].applyForce(f);
        }
    }
}