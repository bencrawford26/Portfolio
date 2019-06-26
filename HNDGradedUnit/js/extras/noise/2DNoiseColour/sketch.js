var yOffs;
var xOffs;


var increment;

var incSlider;

function setup() {
    createCanvas(windowWidth,250);
    background(255);
    
    xOffs = createVector(0.0, 1000.0, 2000.0);
    
    incSlider = createSlider(0,1000,1);
    incSlider.position(10,height-25);
}

function draw() {
    
    if(mouseIsPressed) {
        loadPixels();

        noiseDetail(16, 0.75);

        increment = map(incSlider.value(), 0, 1000, 0.0001, 0.05);

        //for every x, y coordinate, calculate noise and produce a brightness value
        for(var x = 0; x < width; x++) {    

            yOffs = createVector(0.0, 1000.0, 2000.0);
            for(var y = 0; y < height; y++) {

                var index = (x+y*width)*4;

                var red = map(noise(xOffs.x, yOffs.x),0,1,0,255);
                var green = map(noise(xOffs.y, yOffs.y),0,1,0,255);
                var blue = map(noise(xOffs.z, yOffs.z),0,1,0,255);

                //set each pixel onscreen to a grayscale value
                pixels[index + 0] = red;
                pixels[index + 1] = green;
                pixels[index + 2] = blue;
                pixels[index + 3] = 255;

                yOffs.x += increment;  //increment yoff
                yOffs.y += increment;
                yOffs.z += increment;
            }
            xOffs.x += increment;    //increment xoff
            xOffs.y += increment;
            xOffs.z += increment;
        }

        updatePixels();

        push();
        fill(0);
        textSize(12);
        text("noise increments:", incSlider.x, height-35);
        pop();
    }
}