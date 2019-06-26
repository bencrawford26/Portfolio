function Munitions() {
    this.loc = createVector(100, height-82);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    
    this.mass = 1;
    this.terminal = 10;
    
    this.angle = 0;
    this.aVel = 0;
    this.aAcc = 0;
    
    this.applyForce = function(force) {
        this.f = p5.Vector.div(force, this.mass);
        this.acc.add(this.f);
    }
    
    this.update = function() {
        
        this.vel.add(this.acc);
        this.vel.limit(this.terminal);
        this.loc.add(this.vel);
        
        this.aAcc = this.acc.x / 10;
        this.aVel += this.aAcc;
        //use constrain() to ensure angular velocity doesn't spin out of control.
        this.aVel = constrain(this.aVel, -0.1, 0.1);
        this.angle += this.aVel;
        
        this.acc.mult(0);
    }
    
    this.display = function() {
        stroke(0);
        fill(50, 100);
        
        push();
        rectMode(CENTER);
        translate(this.loc.x, this.loc.y);
        if(this.vel.x > 1) {
            rotate(this.angle);
        }
        rect(0,0,this.mass*10, this.mass*10);
        pop();
    }
    
    this.checkEdges = function() {
        if(this.loc.y >= height-10) {
            this.loc.y = height -10;
            this.vel.y *= 0.5;
            this.vel.x *= 0.95;
        }
    }
}