

function hspecseries(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Hydrogen Spectral Series");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Click anywhere to create a particle. The particle should roll up the potential but fail to overcome the barrier. Now increase the energy and see what happens. Even at high-energy the particle never overcomes the barrier. Now turn on quantum mode. There is now some non-zero probability that particles can tunnell through the barrier. This proablity depends on the initial energy of the particles.");

  var canvasWidth = 800;
  var canvasHeight = 400;
  var initial = 3;
  var final = 2;
  var R_H = 1.09677583E7; // Rydberg constant in m^-1


  var sketch = function( p ) {

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");


      $("#controls").append("<span>n<sub> initial</sub></span>");
      initial_slider = p.createSlider(1,10,3,1);
      initial_slider.class('superposition_slider');
      initial_slider.parent('controls');

      $("#controls").append("<span>n<sub> final</sub></span>");
      final_slider = p.createSlider(1,10,2,1);
      final_slider.class('superposition_slider');
      final_slider.parent('controls');

      img = p.loadImage('images/spectrum.png');

      p.image(img, 0, 0, canvasWidth, 50);

    }

    p.draw = function()  {

      p.noStroke();
      p.background('#111')
      p.tint(255, 127);
      p.image(img, 0, 0, canvasWidth, 50);

      initial = initial_slider.value();
      final = final_slider.value();

      wv = rydberg(initial, final)*1E9;

      RGBA = wavelengthToColor(wv);

      // p.background(RGBA);
      p.fill(RGBA);
      p.stroke(RGBA);

      if (wv < 370 || wv > 780) {
        console.log('here');
        p.stroke(100,100,100,100);
        p.fill(0);
      }

      p.rect(0, 50, 800, canvasHeight-50);

      p.strokeWeight(2);
      x = Math.floor(canvasWidth*wv/2500);
      p.line(x, 0, x, 50);

      p.noStroke();
      p.fill(255);
      p.text(wv.toFixed(0)+'nm', x+5,30);

      p.text('ULTRAVIOLET', 10,30);
      p.text('NEAR-INFRARED', 500,30);

      // for (n=1; n<10; n++) {
      //   e = energy(n);
      //   y = -canvasHeight*e/13.6 - 1;
      //   p.stroke(255);
      //   p.strokeWeight(2);
      //   p.line(0, y, 100, y);
      // }


    }

    function rydberg(i,f) {
      return (R_H*(1/f**2 - 1/i**2))**-1;
    }

    function energy(n) {
      return -13.6/n**2; // eV
    }



  }

  window.myp5 = new p5(sketch);

}





// takes wavelength in nm and returns an rgba value
function wavelengthToColor(wavelength) {
    var r,
        g,
        b,
        alpha,
        colorSpace,
        wl = wavelength,
        gamma = 1;


    if (wl >= 380 && wl < 440) {
        R = -1 * (wl - 440) / (440 - 380);
        G = 0;
        B = 1;
   } else if (wl >= 440 && wl < 490) {
       R = 0;
       G = (wl - 440) / (490 - 440);
       B = 1;
    } else if (wl >= 490 && wl < 510) {
        R = 0;
        G = 1;
        B = -1 * (wl - 510) / (510 - 490);
    } else if (wl >= 510 && wl < 580) {
        R = (wl - 510) / (580 - 510);
        G = 1;
        B = 0;
    } else if (wl >= 580 && wl < 645) {
        R = 1;
        G = -1 * (wl - 645) / (645 - 580);
        B = 0.0;
    } else if (wl >= 645 && wl <= 780) {
        R = 1;
        G = 0;
        B = 0;
    } else {
        R = 0;
        G = 0;
        B = 0;
    }

    // intensty is lower at the edges of the visible spectrum.
    if (wl > 780 || wl < 380) {
        alpha = 0;
    } else if (wl > 700) {
        alpha = (780 - wl) / (780 - 700);
    } else if (wl < 420) {
        alpha = (wl - 380) / (420 - 380);
    } else {
        alpha = 1;
    }

    RGBA = [Math.floor(R*255), Math.floor(G*255), Math.floor(B*255), Math.floor(alpha*255)]

    return RGBA;

}
