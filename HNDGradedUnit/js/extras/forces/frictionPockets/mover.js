function Mover(m) {
    //initialising the location, acceleration and velocity vectors
    this.loc = createVector(10,10);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    
    this.mass = m;
    
    //Newton's second law.
    this.applyForce = function(force) {
        //REcieve a force, divide by mass, and add to acceleration.
        this.f = p5.Vector.div(force, this.mass);
        this.acc.add(this.f);
    }
    
    this.update = function() {
        //motion 101 - assigning velocity to acceleration, limiting velocity then changing location based on velocity
        this.vel.add(this.acc);
        this.vel.limit(this.topspeed);
        this.loc.add(this.vel);
        this.acc.mult(0);
    }
    
    
    this.display = function() {
        stroke(0);
        fill(200);
        //drawing the mover
        ellipse(this.loc.x, this.loc.y, this.mass*16, this.mass*16);
    }
    
    
    this.checkEdges = function() {
        //checks if mover has reached max/min width and if so setting location to opposite side
        if(this.loc.x > width) {
            this.loc.x = width;
            this.vel.x *= -1;
        } else if (this.loc.x < 0) {
            this.vel.x *= -1;
            this.loc.x = 0;
        }
        
        if(this.loc.y > height) {
            this.vel.y *= -1;
            this.loc.y = height;
        } else if (this.loc.y < 0) {
            this.loc.y = 0;
            this.vel.y *= -1;
        }
    }
}