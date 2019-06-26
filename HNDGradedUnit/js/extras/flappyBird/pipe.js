function Pipe() {
 this.top = random(250,height/2-20);
 this.bottom = random(250,height/2-20);
 this.x = width;
 this.w = 32;
 this.speed = 7;
 this.freeze = false;
 
 this.highlight = false;
 
 this.hits = function(bird) {
   if(bird.y < this.top || bird.y > height - this.bottom) {
     if(bird.x > this.x && bird.x < this.x + this.w) {
       this.highlight = true;
       return true;
     }
   }
   this.highlight = false;
   return false;
 }
 
 this.show = function() {
   stroke(0);
   fill(50,220,50);
   if(this.highlight == true) {
     fill(255,0,0);
   }
   rect(this.x, 0, this.w, this.top);
   rect(this.x, height-this.bottom, this.w, this.bottom);
   
 }
  
  this.update = function() {
    this.x -= this.speed;
  }
  
  this.passed = function(bird) {
    return this.x <= bird.x-28 && this.x >= bird.x-34;
  }
  
  this.offscreen = function() {
    return this.x < -this.w;
  }
  
  this.stopped = function() {
    this.speed = 0;
    this.freeze = true;
  }
}