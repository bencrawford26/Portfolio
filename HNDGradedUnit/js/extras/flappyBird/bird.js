function Bird() {
  this.y = height/2;
  this.x = 100;
  
  this.gravity = 0.8;
  this.lift = -13;
  this.velocity = 0;
  
  this.show = function() {
    fill(50,100,255);
    ellipse(this.x, this.y, 32, 32);
  }
  
  this.up = function() {
    this.velocity += this.lift;
  }
  
  this.update = function() {
    this.velocity += this.gravity;
    this.velocity *= 0.9;
    this.y += this.velocity;
    
    if(this.y > height) {
      this.y = height;
      this.velocity = 0;
    }
    
    if(this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  }
}