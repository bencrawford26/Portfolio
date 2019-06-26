var bubbles = [];

var total = 0;

function setup() {
  createCanvas(windowWidth, 400);
  
  for(var i = 0; i < 100; i++) {
  	bubbles[i] = new Bubble();
  }
}

function draw() {
  background(255);
  
  for( var i = 0; i < total; i++) {
  	bubbles[i].ascend();
  	bubbles[i].displayed();
  	bubbles[i].checkTop();
  }
  
}

function mousePressed() {
    if(total <= 99) {
	   total++;
    }
}

function keyPressed() {
    if(total >= 0){
	   total--;   
    }
}