var ship;
var asteroids = [];
var lasers = [];
var score;
var gameOver;

function setup() {
  createCanvas(windowWidth, windowHeight);
    gameOver = false;
  ship = new Ship();
  
  for(var i = 0; i < 5; i++) {
    asteroids.push(new Asteroids());
  }
    score = 0;
}

function draw() {
    background(0);
    displayScore();

    if(frameCount % 180 == 0 && gameOver == false) {
        asteroids.push(new Asteroids());
    } else if (frameCount % 360 == 0 && gameOver == false) {
        asteroids.push(new Asteroids());
        asteroids.push(new Asteroids());
    }
    
  for(var i = 0; i < asteroids.length; i++) {
    if (ship.hits(asteroids[i])) {
        gameOver = true;
    }
    asteroids[i].render();
    asteroids[i].update();
    asteroids[i].edges();
  }
  
  for(var i = lasers.length-1; i >= 0; i--) {
    lasers[i].render();
    lasers[i].update();    
    if(lasers[i].offscreen()) {
      lasers.splice(i, 1);
    } else {
      for(var j = asteroids.length-1; j >= 0 ; j--) {
        if(lasers[i].hits(asteroids[j])) {
          if(asteroids[j].r > 10) {
            var newAsteroids = asteroids[j].breakup();
            asteroids = asteroids.concat(newAsteroids);
              score+= 5;
          }
          asteroids.splice(j,1);
          lasers.splice(i, 1);
          break;
        }
      }
    }
  }
  
  ship.render();
  ship.turn();
  ship.update();
  ship.edges();
  gameOverMenu();
}

function displayScore() {    
    if(gameOver == false) {
        push();
        fill(255);
        text(score, 10,10);
        pop();
    }
        
    if(frameCount % 30 == 0 && gameOver == false){
        score++;
    }
}

function gameOverMenu() {        
    if(gameOver == true) {
        push();
        fill(255);
        textSize(24);
        text("Game over!",width/2-100,height/2-300,200,200);
        textSize(20);
        text("Final score: "+score,width/2-100,height/2-200,200,200);
        textSize(16);
        text("Press R to retry!",width/2-100,height/2-100,200,200);
    }
}

function keyPressed() {
  if(keyCode == 222 && gameOver == false) {
    lasers.push(new Laser(ship.pos, ship.heading));
  } else if(keyCode == 68 && gameOver == false) {
    ship.setRotation(0.1);
  } else if (keyCode == 65 && gameOver == false) {
    ship.setRotation(-0.1);
  } else if (keyCode == 87 && gameOver == false) {
    ship.boosting(true);
  } else if (keyCode == 83 && !gameOver) {
      ship.vel.mult(0.2);
  }
    
    if(key == 'R' && gameOver) {
        score = 0;
        for(var i = 0; i < asteroids.length; i++) {
            asteroids.splice(i);
        }
        ship.pos.set(width/2,height/2);
        for(var i = 0; i < 5; i++) {
            asteroids.push(new Asteroids());
        }
        gameOver = false;
    }
}

function keyReleased() {
  ship.setRotation(0);
  ship.boosting(false);
}