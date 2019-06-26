function Mover() {
    //initialising the location, acceleration and velocity vectors
    this.loc = createVector(width/2,height/2);
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    
    //initialising top speed of mover
    this.topspeed = 5;
    //initialising time for Perlin noise
    this.time = createVector(0,10000);
    
    this.update = function() {
        //assigning acceleration according to Perlin noise
        this.acc.set(map(noise(this.time.x),0,1,-1,1),map(noise(this.time.y),0,1,-1,1));
        
        //motion 101 - assigning velocity to acceleration, limiting velocity then changing location based on velocity
        this.vel.add(this.acc);
        this.vel.limit(this.topspeed);
        this.loc.add(this.vel);
        
        //incrementing "time" for different Perlin noise values
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