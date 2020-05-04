
function magneticfield(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Magnetic Field");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Click to fire a particle through. The length of the firing line determines the initial energy of the particle. You can also change the magnetic field strength and rate of energy loss in the magnetic field.");


  var sketch = function( p ) {

      let system;
      var canvasWidth = 800;
      var canvasHeight = 400;
      var max_velocity = 10;
      var particle_types = ['electron', 'alpha'];
      var B_strength = -2;
      var energy_loss = 0.99;

      var Bphi = 0.0;
      var Btheta = 0.0;

      p.setup = function() {

        $("#controls").empty();
        var canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("exhibit_canvas");
        system = new ParticleSystem();


        $("#controls").append("<span>MAGNETIC FIELD STRENGTH</span>");
        B_strength_slider = p.createSlider(-3,-1,-1.5,0);
        B_strength_slider.class('superposition_slider');
        B_strength_slider.parent('controls');

        $("#controls").append("<span>ENERGY LOSS</span>");
        energy_loss_slider = p.createSlider(-4,-1,-2,0);
        energy_loss_slider.class('superposition_slider');
        energy_loss_slider.parent('controls');

        // $("#controls").append("<span>B_x</span>");
        // Bphi_slider = p.createSlider(0,p.TWO_PI,0,0);
        // Bphi_slider.class('superposition_slider');
        // Bphi_slider.parent('controls');
        // Bphi_slider.input(function() {Bphi=Bphi_slider.value()});
        //
        // $("#controls").append("<span>B_y</span>");
        // Btheta_slider = p.createSlider(0,p.TWO_PI,0,0);
        // Btheta_slider.class('superposition_slider');
        // Btheta_slider.parent('controls');
        // Btheta_slider.input(function() {Btheta=Btheta_slider.value()});

      }

      p.draw = function() {
        p.background('#111');


        B_strength = B_strength_slider.value();
        energy_loss = energy_loss_slider.value();

        // draw line to mouse from origin

        p.noStroke();
        p.fill('#222');
        p.rect(canvasWidth/2,0,canvasWidth/2,canvasHeight);

        p.stroke(255, 50);
        p.line(0, canvasHeight/2, p.mouseX, p.mouseY);



        system.run();

        // p.push();
        // p.rotateX(p.TWO_PI*Bphi);
        // p.rotateZ(p.TWO_PI*Btheta);
        // p.box(50);
        // // p.line(10,10,50,10);
        // p.pop();

      }

      p.mousePressed = function() {
        system.addParticle('electron');
      }


      // A simple Particle class
      let Particle = function(particle_type) {

        if (particle_type==='electron') {
          this.size = 5;
          this.mq = -1.;
        }

        if (particle_type==='alpha') {
          this.size = 5;
          this.mq = 0.01;
        }

        this.velocity = p.createVector(p.mouseX, p.mouseY-canvasHeight/2, 0).mult(0.01);
        this.position = p.createVector(0, canvasHeight/2);

        this.lifespan = 1000;
        this.x = new Array(this.lifespan);
        this.y = new Array(this.lifespan);
        this.i = 0;


      };

      Particle.prototype.run = function() {
        this.update();
        this.display();
      };

      // Method to update position
      Particle.prototype.update = function() {

        this.x[this.i] = this.position.x;
        this.y[this.i] = this.position.y;
        this.i += 1;
        this.lifespan -= 1;

        if (this.position.x>canvasWidth/2) {
          B = p.createVector(0.0, 0.0, 1.0);
          B.mult((10**B_strength)*this.mq);
          this.acceleration = this.velocity.cross(B);
          this.velocity.add(this.acceleration);
          this.velocity = this.velocity.mult(1-10**energy_loss);
        }
        this.position.add(this.velocity);



      };

      // Method to display
      Particle.prototype.display = function() {

        p.noFill();
        p.strokeWeight(2)
        p.stroke(150,150,150, Math.floor(255*this.lifespan/1000));
        p.beginShape();
        for (i=0;i<this.i;i++) {
          p.vertex(this.x[i], this.y[i])
        }
        p.endShape()

        p.noStroke();
        // p.fill(200, Math.floor(255*(this.lifespan/1000)));
        p.fill(200);
        // p.line(this.end_position.x, this.end_position.y,this.starting_position.x, this.starting_position.y);
        p.ellipse(this.position.x, this.position.y, this.size, this.size);



      };

      // Is the particle still useful?
      Particle.prototype.isDead = function() {
        return this.lifespan < 0;
      };

      let ParticleSystem = function() {
        this.particles = [];
      };

      ParticleSystem.prototype.addParticle = function(particle_type) {
        this.particles.push(new Particle(particle_type));
      };


      ParticleSystem.prototype.run = function() {
        for (let i = this.particles.length-1; i >= 0; i--) {
          let part = this.particles[i];
          part.run();
          if (part.isDead()) {
            this.particles.splice(i, 1);
          }
        }
      };


    }

  window.myp5 = new p5(sketch);
}



function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}
