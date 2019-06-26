function Walker() {
    this.x = width/2;
    this.y = height/2;
    
    this.choice;
    
    this.display = function() {
        stroke(0);
        point(this.x, this.y);
    }
    
    this.step = function() {
        this.choice = random(4);
    
        if(this.choice >= 0 && this.choice <= 1) {
            this.x++;
        } else if (this.choice >= 1 && this.choice <= 2) {
            this.x--;
        } else if (this.choice >= 2 && this.choice <= 3) {
            this.y++;
        } else {
            this.y--;
        }
    }
}