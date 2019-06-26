//declaring global variables
var population, rocket, target;
var lifespan = 400;
var avgHits = 0;
var count = 0;
var hits = 0;
var attempts = 0;
var maxforce = 0.3;

//declaring variables for barriers and sliders
var rxa, rya, rwa, rha;
var rxaSlider, ryaSlider, rwaSlider, rhaSlider;

var rxb, ryb, rwb, rhb;
var rxbSlider, rybSlider, rwbSlider, rhcSlider;
    
var rxc, ryc, rwc, rhc;
var rxcSlider, rycSlider, rwcSlider, rhcSlider;

//runs before rest of program
function setup() {
    //defines window size
    createCanvas(windowWidth, 600);
    
    //creates rockets, population and canvas
    rocket = new Rocket();
    population = new Population();
    target = createVector(width/2, 50);
    
    //creates barriers and sliders
    initiializeBarriers();
    createSliders();
}

function draw() {
    //sets background to white
    background(255);
    population.run();
    
    //determining average hits to be displayed as text
    avgHits = hits/attempts;
    
    //drawing text for statistics
    push();
    fill(0);
    text("Life:"+count+"/400", 10, 30);
    text("Hits: "+hits, 10, 60);
    text("Attempts: "+attempts, 10, 90);
    text("Average hits per attempt: "+avgHits, 10, 120);
    pop();

    //displays text for sliders
    displayText();
    
    count++;
    if (count == lifespan) {
        population.evaluate();
        population.selection();
        //population = new Population();
        count = 0;
        attempts++;
    }

    //draws barriers
    leftBarrier();
    
    rightBarrier();

    topBarrier();
  
    //draws target
    push();
    strokeWeight(8);
    stroke(0, 0, 255);
    fill(255, 0, 0);
    ellipse(target.x, target.y, 32, 32);
    pop();
}

function initiializeBarriers() {
    //sets all barriers to base position
    rxa = width/2 -100;
    rya = height-150;
    rwa = 10;
    rha = 150;
    
    rxb = width/2 +100;
    ryb = height-150;
    rwb = 10;
    rhb = 150;
    
    rxc = width/2 -50;
    ryc = height/2 +50;
    rwc = 100;
    rhc = 10;
}


function leftBarrier() {
    //manipulates left barrier according to slider values
    rxa = map(rxaSlider.value(), 0, 1000, width/2 -150, 0);
    rya = map(ryaSlider.value(), 0, 1000, height-150, 0);
    rwa = map(rwaSlider.value(), 0, 1000, 10, 100);
    rha = map(rhaSlider.value(), 0, 1000, 150, 300);
    rect(rxa, rya, rwa, rha);
}

function rightBarrier() {
    //manipulates right barrier according to slider values
    rxb = map(rxbSlider.value(), 0, 1000, width/2 +150, width);
    ryb = map(rybSlider.value(), 0, 1000, height-150, 0);
    rwb = map(rwbSlider.value(), 0, 1000, 10, 100);
    rhb = map(rhbSlider.value(), 0, 1000, 150, 300);
    rect(rxb, ryb, rwb, rhb);
}

function topBarrier() {
    //manipulates top barrier according to slider values
    rxc = map(rxcSlider.value(), 0, 1000, 0, width-rwc);
    ryc = map(rycSlider.value(), 0, 1000, 100, height-150);
    rwc = map(rwcSlider.value(), 0, 1000, 20, 200);
    rhc = map(rhcSlider.value(), 0, 1000, 10, 100);
    rect(rxc, ryc, rwc, rhc);
}

function createSliders() {
    //create sliders to change x and y locations of top barrier
    rxcSlider = createSlider(0,1000,500);
    rxcSlider.position(width-rxcSlider.width-20,10);
    
    rycSlider = createSlider(0,1000,500);
    rycSlider.position(width-rycSlider.width-20,35);
    
    //sliders for top slider width and height
    rwcSlider = createSlider(0, 1000, 1);
    rwcSlider.position(width-rwcSlider.width-20, 60);
    
    rhcSlider = createSlider(0, 1000, 1);
    rhcSlider.position(width-rhcSlider.width-20, 85);
    
    
    //sliders for left barrier x and y
    rxaSlider = createSlider(0, 1000, 1);
    rxaSlider.position(10, height - 100);
    
    ryaSlider = createSlider(0, 1000, 1);
    ryaSlider.position(10, height-75);
    
    //sliders for left barrier width and height
    rwaSlider = createSlider(0, 1000, 1);
    rwaSlider.position(10, height-50);
    
    rhaSlider = createSlider(0, 1000, 1);
    rhaSlider.position(10, height-25);
    
    
    //sliders for right barrier x and y
    rxbSlider = createSlider(0, 1000, 1);
    rxbSlider.position(width-rxbSlider.width-20, height - 100);
    
    rybSlider = createSlider(0, 1000, 1);
    rybSlider.position(width-rybSlider.width-20, height-75);
    
    //sliders for right barrier width and height
    rwbSlider = createSlider(0, 1000, 1);
    rwbSlider.position(width-rwbSlider.width-20, height-50);
    
    rhbSlider = createSlider(0, 1000, 1);
    rhbSlider.position(width-rhbSlider.width-20, height-25);
}

function displayText() {
    //displays text for sliders
    textSize(16);
    text("Top bar controls", rxcSlider.x , 124);
    text("X position ", rxcSlider.x - rxcSlider.width/2 -8 , 26);
    text("Y position ", rycSlider.x - rycSlider.width/2 -8 , 51);
    text("Width", rwcSlider.x - rwcSlider.width/2 -8, 76);
    text("Height", rhcSlider.x - rhcSlider.width/2 -8, 101);
    
    text("Left bar controls", rxaSlider.x , height-116);
    
    text("Right bar controls", rxbSlider.x , height-116);
}