var peng;

function preload() {
    peng = loadImage("peng.jpg");
}

function setup() {
    createCanvas(windowWidth, 400);
    pixelDensity(1);
    peng.loadPixels();
    loadPixels();
}

function draw() {

    if(mouseIsPressed) {

        for(var x = 0; x < width; x++) {

            for(var y = 0; y < height; y++) {

                //calculate 1D location from 2D grid
                var loc = (x+y*peng.width)*4;

                //get grayscale values from image
                var g;
                g = peng.pixels[loc];

                //calculate an amount to change brightness based on proximity
                var maxdist = 100;
                var d = dist(x, y, mouseX, mouseY);
                var adjustbrightness = 255*(maxdist-d)/maxdist;
                g += adjustbrightness;

                //constrain grey to make sure values stay between 0 and 255
                g = constrain(g, 0, 255);

                //apply greyscale values to current pixels
                var pixloc = (y*width + x)*4;

                pixels[pixloc] = g;
                pixels[pixloc + 1] = g;
                pixels[pixloc + 2] = g;
                pixels[pixloc + 3] = g;
            }
        }
        updatePixels();
    }
}