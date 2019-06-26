function setup() {
  createCanvas(windowWidth, 400);
}

function draw() {
  
  if(mouseIsPressed) {
    loadPixels();
    
    for(var x = 0; x < width; x++) {
      
      for(var y = 0; y < height; y++) {
      
        var d = dist(x, y, mouseX, mouseY);
        var index = (x+y*width) * 4;
        
        pixels[index + 0] = d/2;
        pixels[index + 1] = d;
        pixels[index + 2] = d*2;
        pixels[index + 3] = 200;
        
      }
    }
    updatePixels();
  }
}