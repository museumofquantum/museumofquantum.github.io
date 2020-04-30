
function cloudchamber(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Cloud Chamber");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("");


  var sketch = function( p ) {

      let system;
      var canvasWidth = 800;
      var canvasHeight = 400;
      var max_velocity = 10;
      var particle_types = ['electron', 'alpha'];
      var addAlpha = false;

      p.preload = function(){
        img = p.loadImage("images/radioactivity.png");
      }


      p.setup = function() {

        $("#controls").empty();
        var canvas = p.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("exhibit_canvas");

        checkbox2 = p.createCheckbox('', false);
        checkbox2.changed(function() {addAlpha = !addAlpha});
        checkbox2.html("<span class='controls_checkbox_label'>Add Alpha source</span>", true);
        checkbox2.class('controls_checkbox');
        checkbox2.parent('controls');

        system = new ParticleSystem();

      }

      p.draw = function() {
        p.background('#111');
        if (Math.random() < 0.1) {
          system.addParticle();
        }

        if (addAlpha) {
          starting_position = p.createVector(30, canvasHeight/2);
          if (Math.random() < 0.4) {
            starting_position.x += 5*p.random(-1,1);
            starting_position.y += 5*p.random(-1,1);
            system.addAlpha(starting_position);
          }
        }
        system.run();
        if (addAlpha) {
          starting_position = p.createVector(30, canvasHeight/2);
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
          this.length = p.random(0,800);
        }

        if (particle_type==='alpha') {
          this.strokeWeight = 7;
          this.life_span_change = 2;
          this.length = p.random(0,200);
        }

        this.velocity = p.createVector(this.length*p.random(-1, 1), this.length*p.random(-1, 1));
        this.starting_position = starting_position;
        this.end_position = this.starting_position.copy();
        this.end_position.add(this.velocity);
        this.lifespan = p.random(0,255); // starting opacity


      };

      Particle.prototype.run = function() {
        this.update();
        this.display();
      };

      // Method to update position
      Particle.prototype.update = function(){
        this.lifespan -= this.life_span_change;
      };

      // Method to display
      Particle.prototype.display = function() {
        p.stroke(200, this.lifespan);
        p.strokeWeight(this.strokeWeight);
        p.line(this.end_position.x, this.end_position.y,this.starting_position.x, this.starting_position.y);

      };

      // Is the particle still useful?
      Particle.prototype.isDead = function(){
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
