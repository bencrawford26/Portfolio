function Cloud() {
    this.loc = createVector(random(width), random(height));
    this.vel = createVector(0,0);
    this.acc = createVector(1,2);
    this.topspeed = 3;
    
    this.c1 = random(10,20);
    this.c2 = random(15,30);
    this.c3 = random(20,40);
    this.c4 = random(15,30);
    this.c5 = random(25,50);
    
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
        noStroke();
        fill(245,150);
        
        ellipse(this.loc.x, this.loc.y, this.c1, this.c2);
        ellipse(this.loc.x+5, this.loc.y+5, this.c2, this.c3);
        ellipse(this.loc.x-10, this.loc.y-10, this.c3, this.c4);
        ellipse(this.loc.x+13, this.loc.y+13, this.c4, this.c5);
        ellipse(this.loc.x-5, this.loc.y+5, this.c5, this.c1);
    }
    
    this.checkEdges = function() {
        if(this.loc.x > width) {
            this.loc.x = 0;
        } else if(this.loc.x < 0) {
            this.loc.x = width;
        }
        
        if(this.loc.y < 0) {
            this.loc.y = height;
        } else if(this.loc.y > height) {
            this.loc.y = 0;
        }
    }
}