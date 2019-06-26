function setup() {
    createCanvas(windowWidth, 400);
    background(0);
    pixelDensity(1);
    loadPixels();
}

function draw() {
  if(mouseIsPressed) {
    for(var x = 0; x < width; x++) {

        for(var y = 0; y < height; y++) {

        var d = dist(x, y, mouseX, mouseY);

        var index = (x+y*y) * 4;

        pixels[index + 0] = d/2;
        pixels[index + 1] = d;
        pixels[index + 2] = d*2;
        pixels[index + 3] = d/2;
        }
    }

    updatePixels();
  }
}