function Mover() {
    //initialising the location, acceleration and velocity vectors
    this.loc = createVector(width/2,height/2);
    this.vel = createVector(0,0);
    //this.acc = createVector(1,0);
    
    //initialising top speed of mover
    this.topspeed = 5;
    //initialising time for Perlin noise
    this.time = createVector(0,10000);
    
    
    this.update = function() {
        //create vector for mouse location
        this.mouse = createVector(mouseX, mouseY);
        //creating a vector to compute direction
        this.dir = p5.Vector.sub(this.mouse, this.loc);
        
        //Normalising direction vector
        this.dir.normalize();
        
        //scaling direction vector
        this.dir.mult(0.2);
        
        //accelerate according to direction
        this.acc = this.dir;
        
        //motion 101 - assigning velocity to acceleration, limiting velocity then changing location based on velocity
        this.vel.add(this.acc);
        this.vel.limit(this.topspeed);
        this.loc.add(this.vel);
        
        //incrementing time for different Perlin noise values
        this.time.add(0.01,0.01);
    }
    
    
    this.display = function() {
        stroke(0);
        fill(100);
        //drawing the mover
        ellipse(this.loc.x, this.loc.y, 16, 16);
    }
    
    
    this.checkEdges = function() {
        //checks if mover has reached max/min width and if so setting location to opposite side
        if(this.loc.x > width) {
            this.loc.x = 0;
        } else if (this.loc.x < 0) {
            this.loc.x = width;
        }
        
        if(this.loc.y > height) {
            this.loc.y = 0;
        } else if(this.loc.y < 0) {
            this.loc.y = height;
        }
    }
}