

function tunnelling(){

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Tunnelling - NOT YET IMPLEMENTED");
  $("#exhibit_description").html("<p>Click to release a particle with energy equivalent to the y-axis position.</p>");

  var sketch = function( p ) {


    var bullets = [];
    var channels = 30;
    var canvasWidth = 800;
    var canvasHeight = 300;
    var barHeight = canvasHeight / channels;
    var hist_Total = new Array(channels).fill(0);
    var hist_nT = new Array(channels).fill(0);
    var animate = false;

    var Prob = new Array(300);
    var V0 = 0.5;
    var quantum = true;

     p.setup = function() {
      $("#inputs").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");
      $("#inputs").append("<span>BARRIER WIDTH</span>");
      width_slider = p.createSlider(0,5.0,2.5,0);
      width_slider.class('superposition_slider');
      width_slider.parent('inputs');

      checkbox = p.createCheckbox('', true);
      checkbox.changed(function() {quantum = !quantum});
      checkbox.class('input');
      checkbox.html("<span class='checkbox_label'>quantum mode</span>", true);
      console.log(checkbox.elt);
      checkbox.parent('inputs');

      checkbox = p.createCheckbox('', false);
      checkbox.html("<span class='checkbox_label'>animate</span>", true);
      checkbox.changed(function() {animate = !animate});
      checkbox.class('input');
      checkbox.parent('inputs');

      button1 = p.createButton('reset');
      button1.mousePressed(reset);
      button1.class('input');
      button1.parent('inputs');

    }

    function reset() {
      for (var i = 0; i < channels; i++) {
        hist_Total[i] = 0;
        hist_nT[i] = 0;
        var bullets = [];
        }
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

      if (animate) {
        bullets.push(new Bullet(Math.random()*270+30));
      }


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

            j = Math.floor((1-bullets[i].E) * channels);
            hist_Total[j] += 1;

            if (ran > bullets[i].prob) {
                bullets[i].speed = -bullets[i].speed;
                hist_nT[j] += 1;
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

      for (var i = 0; i < channels; i++) {

        if (hist_Total[i]>0) {
          f = (hist_Total[i]-hist_nT[i])/hist_Total[i];
          console.log(hist_Total[i], hist_nT[i], f);
          barWidth = 150*f;
          p.noStroke();
          p.fill(100,100,100,100);
          p.rect(600, i*barHeight, barWidth, barHeight);
        }
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
