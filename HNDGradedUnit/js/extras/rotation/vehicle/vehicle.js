function Vehicle() {
    
    this.loc = createVector(width/2, height/2);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);

    this.brake;
    this.mass = 1;
    this.topspeed = 5;
    
    this.applyForce = function(force) {
        this.f = p5.Vector.div(force, this.mass);
        this.acc.add(this.f);
    }
    
    this.update = function() {
        
        this.keyPressed();
        
        this.vel.add(this.acc);
        this.vel.limit(this.topspeed);
        this.loc.add(this.vel);
        this.acc.mult(0);
    }
    
    this.keyPressed = function() {
        if(keyCode == 87) {
            this.acc.y += -0.1;
        } else if(keyCode == 83) {
            this.acc.y += 0.1;
        } else if(keyCode == 65) {
            this.acc.x += -0.1;
        } else if(keyCode == 68) {
            this.acc.x += 0.1;
        } else {
            this.brake = p5.Vector.mult(this.acc, 0.5);
            this.applyForce(this.brake);
            console.log("z");
        }
    }
    
    this.display = function() {
        var angle = this.vel.heading();
        
        stroke(0);
        fill(255);
        
        push();
        rectMode(CENTER);
        translate(this.loc.x, this.loc.y);
        rotate(angle);
        
        rect(-18, -15, 10, 5);
        rect(18, -15, 10, 5);
        rect(-18, 15, 10, 5);
        rect(18, 15, 10, 5);
        rect(0, 0, 50, 25);
        
        pop();
    }
    
    this.checkEdges = function() {
        
        if(this.loc.x >= width) {
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