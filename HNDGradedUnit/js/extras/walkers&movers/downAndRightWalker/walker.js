function Walker() {
    this.x = width/2;
    this.y = height/2;
    
    this.display = function() {
        stroke(0);
        point(this.x, this.y);
    }
    
    this.step = function() {
        this.choice = Math.random();
        
        if(this.choice < 0.3) {
            this.x++;
        } else if(this.choice < 0.6) {
            this.y++;
        } else if(this.choice < 0.8) {
            this.x--;
        } else {
            this.y--;
        }
    }
}