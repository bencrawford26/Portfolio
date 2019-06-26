function Spaceship() {
    
    this.loc = createVector(width/2, height/2);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    
    this.mass = 1;
    this.terminal = 10;
    
    this.r = 0;
    this.theta = 0;
    this.x = this.r*sin(this.theta);
    this.y = this.r*cos(this.theta);
    
    this.boost = false;
    
    this.applyForce = function(force) {
        this.f = p5.Vector.div(force, this.mass);
        this.acc.add(this.f);
    }
    
    this.update = function() {
        
        this.keyPressed();
        
        this.vel.add(this.acc);
        this.vel.limit(this.terminal);
        this.loc.add(this.vel);
        this.acc.mult(0);
    }
    
    this.keyPressed = function() {
        if(keyIsPressed && keyCode == LEFT_ARROW) {
            this.theta+=-0.1;
        } else if (keyIsPressed && keyCode == RIGHT_ARROW) {
            this.theta+=0.1;
        }
    }
    
    this.display = function() {
        fill(255);
        
        push();
        translate(this.loc.x, this.loc.y);
        rotate(this.theta);
        triangle(-20, 0, 0, -40, 20, 0);
        if(this.boost == true) {
            fill(255,0,0);
            rect(-15, 0, 10, 5);
            rect(5, 0, 10, 5);
        } else {
            fill(255);
            rect(-15, 0, 10, 5);
            rect(5, 0, 10, 5);
        }
        pop();
    }
    
    this.checkEdges = function() {
        if(this.loc.x >=width) {
            this.loc.x = 0;
        } else if(this.loc.x <= 0) {
            this.loc.x = width;
        }
        
        if(this.loc.y >= height) {
            this.loc.y = 0;
        } else if(this.loc.y <= 0) {
            this.loc.y = height;
        }
    }
}