

function fusion(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Fusion");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Click anywhere to create a particle. The particle should roll up the potential but fail to overcome the barrier. Now increase the energy and see what happens. Even at high-energy the particle never overcomes the barrier. Now turn on quantum mode. There is now some non-zero probability that particles can tunnell through the barrier. This proablity depends on the initial energy of the particles.");

  var canvasWidth = 800;
  var canvasHeight = 400;
  var points = [];
  var bullets = [];
  var quantum = false;


  var sketch = function( p ) {

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");


      $("#controls").append("<span>ENERGY</span>");
      initial_speed_slider = p.createSlider(0,10.0,3.5,0);
      initial_speed_slider.class('superposition_slider');
      initial_speed_slider.parent('controls');

      $("#controls").append("<span>MODE</span>");
      mode = p.createRadio();
      mode.option('', false);
      mode.html("<span class='controls_checkbox_label'>Classical</span>", true);
      mode.option('', true);
      mode.html("<span class='controls_checkbox_label'>Quantum</span>", true);
      mode.parent('controls');
      mode._getInputChildrenArray()[0].checked = true;
      mode.changed(reset);

      button1 = p.createButton('reset');
      button1.mousePressed(reset);
      button1.parent('controls');

    }

    p.draw = function()  {
      p.background('#111');
      drawPotential();

      quantum = mode.value();

      for (let i=0; i < bullets.length; ++ i) {
          bullets[i].fire();
          bullets[i].show();

          if (bullets[i].x > 0.8*canvasWidth && !bullets[i].inwell) {
            console.log('here');
            bullets[i].x = 0.8*canvasWidth;
            bullets[i].v = Math.sign(bullets[i].v)*5.0;
            bullets[i].inwell = true;
          }
          if (bullets[i].x > canvasWidth) {
            bullets[i].v = -bullets[i].v;
          }
          if (bullets[i].x<0.8*canvasWidth && bullets[i].inwell) {
            bullets[i].v = -bullets[i].v;
          }
        }

    }

    function reset() {
      bullets.length = 0;
    }



    function drawPotential() {
        for (var i = 0; i < canvasWidth; i++) {
          y = (canvasHeight/4 + U(i));
          points[i] = p.createVector(i, canvasHeight-y);
        }

        p.noFill();
        p.stroke(100);
        p.strokeWeight(2);
        p.beginShape();
        for (var i = 0; i < canvasWidth; i++) {
            p.vertex(points[i].x, points[i].y);
        }
        p.endShape();
    }


    function Bullet(Y){
        this.x = 0;
        this.v = initial_speed_slider.value();
        this.y = canvasHeight - canvasHeight/4.;
        this.r = 10;
        this.inwell = false;

        this.show = function(){
          p.noStroke();
          p.fill(150);
          p.circle(this.x,this.y,this.r);
        }
        this.fire = function() {

            if (quantum && !this.inwell) {
              this.prob = 1/(1+Math.sinh(0.07*(0.8*canvasWidth-this.x)));
              if (Math.random()<this.prob) {
                this.inwell = true;
                this.x = canvasWidth*0.8;
                this.v = 3.5;
              }
            }

            this.a = -0.3*Math.sign(this.v)*(U(this.x+Math.sign(this.v)*1)-U(this.x));

            if (this.inwell) {
              this.a = 0.0;
            }

            console.log(this.a, this.v, this.x)

            this.v += this.a;
            this.x += this.v;
            this.y = canvasHeight-(canvasHeight/4 + U(this.x)) - this.r+3;

            if (this.inwell) {
              this.y = canvasHeight - this.r+3;
            }

        }

    }


    function U(i) {
      if (i<0.8*canvasWidth) {
      return (((1.0-i/canvasWidth)/3)**-2);
    } else {
      return -canvasHeight/4+1;
    }
    }


    p.mousePressed = function() {
      if (p.mouseY < canvasHeight) {
        bullets.push( new Bullet(p.mouseY));
      }
    }





  }

  window.myp5 = new p5(sketch);

}
