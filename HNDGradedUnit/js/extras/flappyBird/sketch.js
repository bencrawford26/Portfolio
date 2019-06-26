var bird;
var pipes = [];
var score;
var freeze = false;
var y = 0;

function setup() {
  createCanvas(400,600);
  bird = new Bird();
  pipes.push(new Pipe());
  score = 0;
}

function draw() {
  
  background(150,200,255);
      
  for(var i = pipes.length-1; i >= 0; i--){
    pipes[i].show();
    pipes[i].update();
    
    if(pipes[i].hits(bird)) {
      freeze = true;
      pipes[i].stopped();
      fill(255,0,0);
      stroke(255);
      textSize(24);
      text("Game over!",width/2-100, height/2-100, 200, 200);
      fill(255);
      textSize(16);
      text("Press R to retry!", width/2-100, height/2,200,200);
    }
    
    if(pipes[i].passed(bird)) {
      score++;
    }
    
    if(pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }
  
  bird.show();
  bird.update();
  noStroke();
  fill(255);
  textSize(12);
  text("Score: "+score, 25, 50);
  if(frameCount % 50 === 0 && freeze === false) {
    pipes.push(new Pipe());
  }
}

function keyPressed() {
  if(key == ' ' && freeze === false) {
    bird.up();
    console.log("SPACE");
  }
  
  if(key == 'R' && freeze == true) {
    score = 0;
    for(var i = 0; i < pipes.length; i++) {
      pipes.splice(i);
    }
    bird.y = width/2;
    console.log("retry");
    freeze = false;
  }
}