

function boltzmann(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Boltzmann distribution");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Use the slider to set the temperature and calculate the numbers of particles in each energy level.");

  var canvasWidth = 800;
  var canvasHeight = 400;
  var initial = 3;
  var final = 2;
  var h = 6.626E-34;
  var c = 3E8;
  var k = 8.617E-5; // ev/K
  var nlevels = 10;
  var N = new Array(nlevels);

  var sketch = function( p ) {

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");

      $("#controls").append("<span>TEMPERATURE</span>");
      T_slider = p.createSlider(2.7,5,3.826,0);
      T_slider.class('superposition_slider');
      T_slider.parent('controls');
      T_slider.input(update);

      update();

    }

    function update() {

      p.noStroke();
      p.background('#111')

      T = 10**(T_slider.value());




      for (i=0; i<nlevels; i++) {
        N[i] = Boltzmann(i+1, T);
      }
      console.log(N);

      sumN = N.reduce((a, b) => a + b, 0);

      for (i=0; i<nlevels; i++) {
        height = 300*N[i]/sumN;
        p.fill(200,200,200,100);
        p.rect(i*50, canvasHeight, 50, -height);
      }

      p.noStroke();
      p.fill('#FFF');
      p.textSize(20);
      p.text(T.toFixed(0)+'K', 10,30);


    }

    function energy(n) {
      return -13.6/n**2; // eV
    }

    function Boltzmann(n, T) {
      E0 = -13.6;
      En = energy(n);
      return ((2*n**2)/2)*Math.exp(-(En-E0)/(k*T));
    }

  }

  window.myp5 = new p5(sketch);

}
