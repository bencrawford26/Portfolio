function setup() {
    createCanvas(windowWidth, 400);
    background(0);
    pixelDensity(1);
    loadPixels();
}

function draw() {
    if(mouseIsPressed){

        for(var x = 0; x < width; x++) {

            for(var y = 0; y < height; y++) {

                var y1, mx, my;
                y1 = y;
                mx = mouseX/2;
                my = mouseY;

                y1 = constrain(y, 0, 255);
                mx = constrain(mx, 0, 255);
                my = constrain(my, 0, 255);

                var index = (x+y*width)*4;

                pixels[index + 0] = y1;
                pixels[index + 1] = mx;
                pixels[index + 2] = my;
                pixels[index + 3] = 150;

             }
        }
        updatePixels();
    }
}