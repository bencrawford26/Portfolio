function Walker() {
    this.x = width/2;
    this.y = height/2;
    this.stepx;
    this.stepy;
    
    this.tx = 0;
    this.ty = 100000;
    
    this.display = function() {
        stroke(0);
        point(this.x, this.y);
    }
    
    this.step = function() {
        this.stepx = map(noise(this.tx),0,1,0,10);
        this.stepy = map(noise(this.ty),0,1,0,10);
        
        this.x = map(this.stepx, 0, 10, 0, width);
        this.y = map(this.stepy, 0, 10, 0, height);
        
        this.tx+=0.001;
        this.ty+=0.001;
    }
}