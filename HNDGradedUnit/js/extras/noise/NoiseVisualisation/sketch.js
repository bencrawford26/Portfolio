var offs;
var increment;

function setup() {
    createCanvas(windowWidth,250);
    background(255);
    offs = createVector(0.0, 0.0);  //offsets along x and y axis
    increment = 1;
}

function draw() {
    
    if(mouseIsPressed) {
    
        loadPixels();

        var detail = map(mouseY, 0, height, 0.1, 0.9);
        noiseDetail(8, detail);

        //for every x, y coordinate, calculate noise and produce a brightness value
        for(var y = 0; y < height; y++) {

            for(var x = 0; x < width; x++) {    

            offs.y = 0;             //For every xoff, start yoff at 0

                var index = (x+y*width)*4;

                //Calculate noise and scale by 255
                var bright = map(noise(offs.x),0,1,0,255);

                //set each pixel onscreen to a grayscale value
                pixels[index + 0] = bright;
                pixels[index + 1] = bright;
                pixels[index + 2] = bright;
                pixels[index + 3] = bright;

                offs.y += increment;  //increment yoff
            }
            offs.x += increment;    //increment xoff
        }

        updatePixels();
    }
}