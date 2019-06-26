function Bubble() {
	
	this.x = random(width);
	this.y = height;
	this.di = random(64);
	this.ySpeed = random(0.5, 2.5);
	
	this.ascend = function() {
		this.y -= this.ySpeed;
		this.x += random(-2,2);
	}
	
	this.displayed = function() {
		stroke(0);
		fill(240);
		ellipse(this.x, this.y, this.di, this.di);
	}
	
	this.checkTop = function() {
		if(this.y < height*-1) {
			this.y = height;
		}
	}
}