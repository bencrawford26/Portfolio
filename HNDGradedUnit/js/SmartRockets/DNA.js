function DNA(genes) {
  //checks if genes have been passed through, creates new genes if not
  if (genes)  {
    this.genes = genes;
  } else {   
    this.genes = [];  
    for (var i = 0; i < lifespan; i++) {
      this.genes[i] = p5.Vector.random2D();
      this.genes[i].setMag(maxforce);
    }
  }
  
  this.crossover = function(partner) {
    //creates new genes based on two existing rockets to pass onto next generation
    var newgenes = [];
    var mid = floor(random(this.genes.length));
    for (var i = 0; i < this.genes.length; i++) {
      if (i > mid) {
        newgenes[i] = this.genes[i];
      } else {
        newgenes[i] = partner.genes[i];
      }
    }
      return new DNA(newgenes);
  }
  
  this.mutation = function() {  
    //keeps the chance of a new random path being generated after each generation
    for (var i = 0; i < this.genes.length; i++) {
      if (random(1) < 0.015) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxforce);
      }
    }
  }
}