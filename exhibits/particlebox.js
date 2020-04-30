

function particlebox(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Particle in a Box");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Use the slider to set the quantum number of the particle. Presented are the real and imaginary parts of the wavefunction alongside the probability desnity.");
  var canvasWidth = 800;
  var canvasHeight = 400;
  var ilen=200;
  var psi = new Array(ilen);
  var t = 1;
  var dt = 0.01;

  var sketch = function( p ) {

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");

      $("#controls").append("<span>QUANTUM NUMBER</span>");
      n_slider = p.createSlider(1, 10, 1, 1);
      n_slider.class('superposition_slider');
      n_slider.parent('controls');
      // n_slider.input(update);

    }

    p.draw = function() {

      p.noStroke();
      p.background('#111')


      p.fill(40);
      p.rect(0,0, (canvasWidth - ilen)/2, canvasHeight);
      p.rect((canvasWidth - ilen)/2+ilen,0, (canvasWidth - ilen)/2, canvasHeight);

      n = n_slider.value();

      psi = wavefunc(n);

      p.stroke(255,255,255,100);
      p.strokeWeight(2);
      p.noFill();
      phase = Math.cos(t);
      p.beginShape();
      for (i=0; i<ilen+1; i++) {
        x = i + 300;
        y = (psi[i]*phase)*50 + 200;
        p.vertex(x, y);
      }
      p.endShape();

      p.stroke(255,255,255,100);
      p.strokeWeight(2);
      p.noFill();
      phase = Math.sin(t);
      p.beginShape();
      for (i=0; i<ilen+1; i++) {
        x = i + 300;
        y = (psi[i]*phase)*50 + 200;
        p.vertex(x, y);
      }
      p.endShape();

      p.stroke(255,255,255,255);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (i=0; i<ilen+1; i++) {
        x = i + 300;
        y = -(psi[i]**2)*50 + 200;
        p.vertex(x, y);
      }
      p.endShape();

      t = t +dt;



    }

    function wavefunc(n) {
      k = n*p.PI
      for (i=0; i<ilen+1; i++) {
        x = i/ilen
        psi[i] = Math.sqrt(2)*Math.sin(k*x);
      }
      return psi;
    }




  }

  window.myp5 = new p5(sketch);

}
