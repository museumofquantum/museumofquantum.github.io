


function tunnelling(){

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Tunnelling - NOT YET IMPLEMENTED");
  $("#exhibit_description").html("<p>Click to release a particle with energy equivalent to the y-axis position.</p>");

  var sketch = function( p ) {


    var bullets = [];
    var Prob = new Array(300);
    var V0 = 0.5;
    var quantum = true;

     p.setup = function() {
      $("#inputs").empty();
      var canvas = p.createCanvas(800, 300);
      canvas.parent("exhibit_canvas");
      $("#inputs").append("<span>BARRIER WIDTH</span>");
      width_slider = p.createSlider(0,5.0,2.5,0);
      width_slider.class('superposition_slider');
      width_slider.parent('inputs');

      checkbox = p.createCheckbox('quantum', true);
      checkbox.changed(function() {quantum = !quantum});
      checkbox.style('width','100');
      checkbox.parent('inputs');
    }

    p.draw = function() {

      p.background('#111');
      p.noStroke();
      p.textSize(15);
      p.fill(0, 102, 153);
      p.text('E/V', 10, 20);
      p.fill(153, 0, 0);
      p.text('Transmission probability', 50, 20);

      DrawBarrier();

      p.fill(240);
      p.text('E/V='+((-(p.mouseY-300)/150)).toFixed(2), 10, p.mouseY-10)
      p.stroke(50);
      p.line(0,p.mouseY,800,p.mouseY);

      var texti = 40;
      for (let i=0; i < bullets.length; ++ i) {
          bullets[i].fire();

          if (bullets[i].onScreen()) {
              bullets[i].show();
              p.fill(0, 102, 153);
              p.text(bullets[i].E.toFixed(2)/V0, 10, texti);
              p.fill(153, 0, 0);
              p.text(bullets[i].prob.toFixed(2), 50, texti);
              texti += 20;
            }

          if (bullets[i].inbarrier()) {
            ran = p.random(0,1);

            if (ran > bullets[i].prob) {
                bullets[i].speed = -bullets[i].speed;
              }
          } // end in barrier
        } // end for loop

        // $("#E").html('E/V='+((-(p.mouseY-300)/150)).toFixed(2));
        DrawProb();
    }

    p.mousePressed = function() {
      bullets.push( new Bullet(p.mouseY));
    }



    function DrawBarrier(){
      p.fill(60);
      p.noStroke();
      var width = width_slider.value();
      p.rect(500, 150, width*10, 150);

    }

    function DrawProb(){

      p.fill('#111');
      p.stroke(100);
      p.rect(600,30,150,270);
      p.noStroke();
      p.textSize(12);
      p.fill(200);
      p.push();
      p.text('Transmission Probability', 600, 20);
      p.translate(590,170);
      p.rotate(-p.PI/2);
      p.text("Energy",0,0);
      p.pop();

      for (var i = 30; i < 300; i++) {

        E = -(i-300)/300;

        if (quantum) {
          if (E<V0) {
            Prob = 1/(1+((V0**2*Math.sinh(width_slider.value()*Math.sqrt(V0-E))**2)/(4*E*(V0-E))));
          } else if (E==V0) {
            E=V0-0.0001;
            Prob = 1/(1+((V0**2*Math.sinh(width_slider.value()*Math.sqrt(V0-E))**2)/(4*E*(V0-E))));
          } else {
            Prob = 1/(1+((V0**2*Math.sin(width_slider.value()*Math.sqrt(E-V0))**2)/(4*E*(E-V0))));
          }
        } else {

          if (E<V0) {
            Prob = 0.0;
          } else {
            Prob = 1.0;
          }

        }

        p.fill(200);
        p.ellipse(600 + Prob*150, i, 2, 2);

      }


    }



    function Bullet(Y){
        this.speed = 4;
        this.x = 0;
        this.y = Y;
        this.E = -(Y-300)/300;

        // if (this.E<V0) {
        //   this.p = 1/(1+(V0**2*(Math.sinh(1.0)**2)/(4*this.E*(V0-this.E))));
        // }

        if (quantum) {
          if (this.E<V0) {
            this.prob = 1/(1+((V0**2*Math.sinh(width_slider.value()*Math.sqrt(V0-this.E))**2)/(4*this.E*(V0-this.E))));
          }
          if (this.E>V0) {
            this.prob = 1/(1+((V0**2*Math.sin(width_slider.value()*Math.sqrt(this.E-V0))**2)/(4*this.E*(this.E-V0))));
          }
        } else {
          if (this.E<V0) {
            this.prob = 0.0;
          }
          if (this.E>V0) {
            this.prob = 1.0;
          }
        }


        this.r = 10;

        this.show = function(){
          p.fill(150);
          p.circle(this.x,this.y,this.r);
        }
        this.fire = function() {
            this.x += this.speed;
        }
        this.onScreen = function() {
          return this.x > -this.r && this.x < p.width+this.r &&
                  this.y > -this.r && this.y < p.height+this.r;
        }
        this.inbarrier = function() {
          return this.x > 500 && this.x < 505;
        }
    }

}

window.myp5 = new p5(sketch);

}



















function superposition(){

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

   var sketch = function( p ) {

     $("#exhibit_title").html("Superposition");
     $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");

     var xspacing = 5;   // How far apart should each horizontal location be spaced
     var w;              // Width of entire wave

     var theta = 0.0;  // Start angle at 0
     var amplitude = 75.0;  // Height of wave
     var period = 500.0;  // How many pixels before the wave repeats
     var dx;  // Value for incrementing X, a function of period and xspacing
     var yvalues1;  // Using an array to store height values for the wave
     var yvalues2;  // Using an array to store height values for the wave

     p.setup = function() {
       $("#inputs").empty();
       var canvas = p.createCanvas(800, 360);
       canvas.parent("exhibit_canvas");
       w = p.width+xspacing;
       dx = (p.TWO_PI / period) * xspacing;
       yvalues1 = new Array(w/xspacing);
       yvalues2 = new Array(w/xspacing);
       $("#inputs").append("<span>PHASE</span>");
       slider1 = p.createSlider(0,p.TWO_PI,0,0);
       slider1.class('superposition_slider');
       slider1.parent('inputs');

       $("#inputs").append("<span>PERIOD</span>");
       slider2 = p.createSlider(0.5,1.5,1,0);
       slider2.class('superposition_slider');
       slider2.parent('inputs');
     };

     p.draw = function() {
       p.background('#111');
       calcWave();
       renderWave();
     };

     function calcWave() {
       // Increment theta (try different values for 'angular velocity' here

       // For every x value, calculate a y value with sine function
       var x1 = 0;
       for (var i = 0; i < yvalues1.length; i++) {
         yvalues1[i] = p.sin(x1)*amplitude;
         x1+=dx;
       }

       var x2 = slider1.value();
       var period = slider2.value();
       for (var i = 0; i < yvalues2.length; i++) {
         yvalues2[i] = p.sin(x2/period)*amplitude;
         x2+=dx;
       }
     }

     function renderWave() {
       p.noStroke();
       p.fill(100);
       // A simple way to draw the wave with an ellipse at each location
       for (var x = 0; x < yvalues1.length; x++) {
         p.ellipse(x*xspacing, p.height/2+yvalues1[x], 3, 3);
       }

       p.fill(100);
       // A simple way to draw the wave with an ellipse at each location
       for (var x = 0; x < yvalues2.length; x++) {
         p.ellipse(x*xspacing, p.height/2+yvalues2[x], 3, 3);
       }

       p.fill(255);
       // A simple way to draw the wave with an ellipse at each location
       for (var x = 0; x < yvalues2.length; x++) {
         p.ellipse(x*xspacing, p.height/2+(yvalues1[x]+yvalues2[x]), 5, 5);
       }

     }



   };

   window.myp5 = new p5(sketch);
}
