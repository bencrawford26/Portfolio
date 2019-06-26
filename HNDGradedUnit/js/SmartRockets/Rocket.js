function Rocket(dna) {
  //create vectors for rocket position, velocity and acceleration
  this.pos = createVector(width/2, height);
  this.vel = createVector();
  this.acc = createVector();
  
  this.completed = false;
  this.crashed = false;
  
  //checks if dna has been passed through, creates new if not
  if (dna) {
    this.dna = dna;
  } else {
    this.dna = new DNA();
  }
  this.fitness = 0;

  this.applyForce = function(force) {
    //adds the value of force to rockets acceleration
    this.acc.add(force);
  }
  
  this.calcFitness = function() {
    //find the distance between rocket and target
    var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    
    this.fitness = map(d, 0, width, width, 0);
    
    //high fitness multiplier if target hit
    if (this.completed) {
      this.fitness *= 10;
      hits++;
    }    
	
	//target hit within time - fitness multipliers
    if (this.completed && count < 375) {
      this.fitness *= 2;
    } else if (this.completed && count < 350) {
      this.fitness *= 3;
    } else if (this.completed && count < 325) {
      this.fitness *= 3;
    } else if (this.completed && count < 300) {
      this.fitness *= 4;
    } else if (this.completed && count < 250) {
      this.fitness *= 5;
    } else if (this.completed && count < 225) {
      this.fitness *= 10;
    } else if (this.completed && count < 200) {
      this.fitness *= 15;
    } else if (this.completed && count < 175) {
      this.fitness *= 20;
    } else if (this.completed && count < 150) {
      this.fitness *= 25;
    } else if (this.completed && count < 125) {
      this.fitness *= 30;
    } else if (this.completed && count < 100) {
      this.fitness *= 50;
    }
    
    //target almost hit - fitness multipliers
    if (d > 10 && d < 20) {
      this.fitness *= 4;
    } else if (d > 20 && d < 30) {
      this.fitness *= 3;
    } else if (d > 30 && d < 40) {
      this.fitness *= 2;
    }
    
    
    //crashes - fitness reductions
    if (this.crashed) {
      this.fitness /= 10;
    }
    if (this.crashed && count < 25) {
      this.fitness /= 20;
    } else if (this.crashed && count > 25 && count < 50) {
      this.fitness /= 15;
    } else if (this.crashed && count > 50 && count < 75) {
      this.fitness /= 10;
    } else if (this.crashed && count > 75 && count < 100) {
      this.fitness /= 5;
    } else if (this.crashed && count > 100 && count < 150) {
      this.fitness /= 4;
    } else if (this.crashed && count > 150 && count < 200) {
      this.fitness /= 3;
    } else if (this.crashed && count > 200 && count < 250 || this.crashed && d < 60) {
      this.fitness /= 2;
    }
  }
  
  
  this.update = function() {
    //find the distanc ebetween rocket and target
    var d = dist(this.pos.x, this.pos.y, target.x, target.y);
    if (d < 20) {
      this.completed = true;
      this.pos = target.copy();
    }
    
    //collision detection for barriers
    if(this.pos.x > rxa && this.pos.x < rxa + rwa && this.pos.y > rya && this.pos.y < rya + rha) {
      this.crashed = true;
    }
    
    if(this.pos.x > rxb && this.pos.x < rxb + rwb && this.pos.y > ryb && this.pos.y < ryb + rhb) {
      this.crashed = true;
    }
    
    if(this.pos.x > rxc && this.pos.x < rxc + rwc && this.pos.y > ryc && this.pos.y < ryc + rhc) {
      this.crashed = true;
    }
    
    //collision detection for screen borders
    if (this.pos.x > width || this.pos.x < 0) {
      this.crashed = true;
    }  
    
    if (this.pos.y > height || this.pos.y < 0) {
      this.crashed = true;
    }
    
    this.applyForce(this.dna.genes[count]);
	
	
    if (!this.completed && !this.crashed) { 
      //rocket moves along its set path
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
      this.vel.limit(4);
    }
  }
  
  this.show = function() {
    //displays the rocket
    push();
    noStroke();
    fill(100);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    rectMode(CENTER);
    rect(0, 0, 32, 8);
    triangle(16, -4, 24, 0, 16, 4); 
      
    fill(230, 75, 75);
    triangle(-16, 12, -4, 4, -16, 4);  
    triangle(-16, -12, -4, -4, -16, -4);
    pop();
  }
}