
function cloudchamber(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Cloud Chamber");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("This current version show both alpha particles (short thick lines) and electrons (long thin lines). Activating a magnetic field will curve the paths of each particle, though this is strong for the lighter electrons. You can also add an artificial alpha or beta source.");


  var sketch = function( p ) {

      let system;
      var canvasWidth = 800;
      var canvasHeight = 400;
      var max_velocity = 10;
      var particle_types = ['electron', 'alpha'];
      var addAlpha = false;
      var addBeta = false;
      var addBField = false;

      p.preload = function(){
        img = p.loadImage("images/radioactivity.png");
      }


      p.setup = function() {

        $("#controls").empty();
        var canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("exhibit_canvas");

        checkbox1 = p.createCheckbox('', false);
        checkbox1.changed(function() {addBField = !addBField});
        checkbox1.html("<span class='controls_checkbox_label'>Add magnetic field (pointing into the screen)</span>", true);
        checkbox1.class('controls_checkbox');
        checkbox1.parent('controls');

        checkbox2 = p.createCheckbox('', false);
        checkbox2.changed(function() {addAlpha = !addAlpha});
        checkbox2.html("<span class='controls_checkbox_label'>Add alpha source</span>", true);
        checkbox2.class('controls_checkbox');
        checkbox2.parent('controls');

        checkbox3 = p.createCheckbox('', false);
        checkbox3.changed(function() {addBeta = !addBeta});
        checkbox3.html("<span class='controls_checkbox_label'>Add beta source</span>", true);
        checkbox3.class('controls_checkbox');
        checkbox3.parent('controls');

        system = new ParticleSystem();

      }

      p.draw = function() {
        p.background('#111');
        if (Math.random() < 0.1) {
          system.addParticle();
        }

        system.run();

        if (addAlpha) {
          starting_position = p.createVector(30, canvasHeight/2);
          if (Math.random() < 0.4) {
            starting_position.x += 5*p.random(-1,1);
            starting_position.y += 5*p.random(-1,1);
            system.addAlpha(starting_position);
          }
          starting_position = p.createVector(30, canvasHeight/2);
          p.image(img, starting_position.x-25, starting_position.y-22, 50, 44);
        }

        if (addBeta) {
          starting_position = p.createVector(canvasWidth-30, canvasHeight/2);
          if (Math.random() < 0.4) {
            starting_position.x += 5*p.random(-1,1);
            starting_position.y += 5*p.random(-1,1);
            system.addBeta(starting_position);
          }
          starting_position = p.createVector(canvasWidth-30, canvasHeight/2);
          p.image(img, starting_position.x-25, starting_position.y-22, 50, 44);
        }


      }

      p.mousePressed = function() {
        system.addAlpha();
      }


      // A simple Particle class
      let Particle = function(particle_type, starting_position) {

        if (particle_type==='electron') {
          this.strokeWeight = 3;
          this.life_span_change = 2;
          this.length = p.random(0,2000);
          this.mq = -1.;
        }

        if (particle_type==='alpha') {
          this.strokeWeight = 7;
          this.life_span_change = 2;
          this.length = p.random(0,200);
          this.mq = 0.01;
        }

        this.starting_velocity = p.createVector(p.random(-1, 1), p.random(-1, 1), 0);
        this.starting_position = starting_position;
        this.position = starting_position.copy();
        this.lifespan = p.random(0,255); // starting opacity
        this.starting_lifespan = this.lifespan;

      };

      Particle.prototype.run = function() {
        this.update();
        this.display();
      };

      // Method to update position
      Particle.prototype.update = function() {
        this.lifespan -= this.life_span_change;
      };

      // Method to display
      Particle.prototype.display = function() {
        // p.stroke(200, this.lifespan);
        // p.strokeWeight(this.strokeWeight);
        p.noStroke();
        p.fill(200, this.lifespan);
        // p.line(this.end_position.x, this.end_position.y,this.starting_position.x, this.starting_position.y);

        this.position = this.starting_position.copy();
        this.velocity = this.starting_velocity.copy();

        B = p.createVector(0.0, 0.0, 1.0);
        B.mult(0.003*this.mq);

        for (i=0;i<this.length;i++) {
          if (addBField) {
            this.acceleration = this.velocity.cross(B);
          } else {
            this.acceleration = 0.0;
          }
          this.velocity.add(this.acceleration);
          this.velocity = this.velocity.mult(0.9995);
          this.position.add(this.velocity);
          p.ellipse(this.position.x, this.position.y, this.strokeWeight, this.strokeWeight);
        }
      };

      // Is the particle still useful?
      Particle.prototype.isDead = function() {
        return this.lifespan < 0;
      };

      let ParticleSystem = function() {
        this.particles = [];
      };

      ParticleSystem.prototype.addParticle = function() {
        starting_position = p.createVector(p.random(0,canvasWidth), p.random(0,canvasHeight));
        this.particles.push(new Particle(choose(particle_types), starting_position));
      };

      ParticleSystem.prototype.addAlpha = function(starting_position) {
        // starting_position = p.createVector(p.mouseX, p.mouseY);
        this.particles.push(new Particle('alpha', starting_position));
      };

      ParticleSystem.prototype.addBeta = function(starting_position) {
        this.particles.push(new Particle('electron', starting_position));
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
