var offs;
var increment;

var rSlider;
var gSlider;
var bSlider;
var incSlider;

function setup() {
    createCanvas(windowWidth,250);
    background(255);
    offs = createVector(0.0, 0.0);  //offsets along x and y axis
    
    rSlider = createSlider(0,1000,1);
    rSlider.position(10, height-75); 
    
    gSlider = createSlider(0,1000,1);
    gSlider.position(10, height-50);   
    
    bSlider = createSlider(0,1000,1);
    bSlider.position(10, height-25);
    
    incSlider = createSlider(0,1000,1);
    incSlider.position(width-incSlider.width-5,height-25);
}

function draw() {
    
    if(mouseIsPressed) {
        loadPixels();

        noiseDetail(16, 0.75);

        increment = map(incSlider.value(), 0, 1000, 0.0001, 0.1);

        //for every x, y coordinate, calculate noise and produce a brightness value
        for(var x = 0; x < width; x++) {    

            offs.y = 0;             //For every xoff, start yoff at 0

            for(var y = 0; y < height; y++) {

                var index = (x+y*width)*4;

                //Calculate noise and scale by 255
                var bright = map(noise(offs.x, offs.y),0,1,0,255);

                var red = map(rSlider.value(), 0, 1000, 255, 0);
                var green = map(gSlider.value(), 0, 1000, 255, 0);
                var blue = map(bSlider.value(), 0, 1000, 255, 0);

                //set each pixel onscreen to a grayscale value
                pixels[index + 0] = bright - red;
                pixels[index + 1] = bright - green;
                pixels[index + 2] = bright - blue;
                pixels[index + 3] = bright;

                offs.y += increment;  //increment yoff
            }
            offs.x += increment;    //increment xoff
        }

        updatePixels();

        push();
        fill(255);
        textSize(12);
        text("noise:", incSlider.x+20, height-35);
        text("R", rSlider.x * 2 + rSlider.width,height-60);
        text("G", gSlider.x * 2 + gSlider.width,height-35);
        text("B", bSlider.x * 2 + bSlider.width,height-10);
        pop();
    }
}