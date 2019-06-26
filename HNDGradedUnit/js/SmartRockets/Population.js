function Population() {
  //initalising variables
  this.rockets = [];
  this.popsize = 25;
  this.matingpool = [];
  
  for (var i = 0; i < this.popsize; i++){
    //creates new rockets
    this.rockets[i] = new Rocket();
  }
  
  this.evaluate = function() {
    
    var maxfit = 0;
    for (var i = 0; i < this.popsize; i++) {
       //runs calcFitness on all rockets
       this.rockets[i].calcFitness();
       if (this.rockets[i].fitness > maxfit) {
         //sets new max fitness if one is found
         maxfit = this.rockets[i].fitness;
       }
    }
    
    //logs the array of rockets
    console.log(this.rockets);
    
    for (var i = 0; i < this.popsize; i++) {
       this.rockets[i].fitness /= maxfit;
    }
    
    this.matingpool = [];
    for (var i = 0; i < this.popsize; i++) {
      var n = this.rockets[i].fitness * 100;
      for (var j = 0; j < n; j++) {
        this.matingpool.push(this.rockets[i]);
      }
    }
    
  }
  
  this.selection = function() {
    //creates a new array of rockets based on the parents with higher fitness from prior generation
    var newRockets = [];
    for (var i = 0; i < this.rockets.length; i++) {
      var parentA = random(this.matingpool).dna;
      var parentB = random(this.matingpool).dna;
      var child = parentA.crossover(parentB);
      child.mutation();
      newRockets[i] = new Rocket(child);
    }
    this.rockets  = newRockets;
  }
  
  this.run = function() {
    for (var i = 0; i < this.popsize; i++) {
      //runs rockets
      this.rockets[i].update();
      this.rockets[i].show();
    }
  }
}