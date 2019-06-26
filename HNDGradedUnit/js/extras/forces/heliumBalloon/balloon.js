function Balloon() {
    this.loc = createVector(width/2, height/2);
    this.vel = createVector(0,0);
    this.acc = createVector(0, -0.1);
    this.mass = 10;
    
    this.topspeed = 3;
    
    this.applyForce = function(force) {
        this.f = p5.Vector.div(force, this.mass);
        this.acc.add(this.f);
    }
    
    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(this.topspeed);
        this.loc.add(this.vel);
        this.acc.mult(0);
    }
    
    this.display = function() {
        stroke(100,150);
        strokeWeight(2);
        fill(255,0,0);
        
        line(this.loc.x, this.loc.y, this.loc.x, this.loc.y+60);
        ellipse(this.loc.x, this.loc.y, 32, 40);
    }
    
    this.checkEdges = function() {
        if(this.loc.x > width) {
            this.loc.x = 0;
        } else if(this.loc.x < 0) {
            this.loc.x = width;
        }
        
        if(this.loc.y <= 60) {
            this.vel.y = 0;
        }
    }
}