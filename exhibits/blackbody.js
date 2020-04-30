

function blackbody(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Blackbody spectrum");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Use the slider to set the temperature of the blackbody to see the spectrum and observed colour.");

  var canvasWidth = 800;
  var canvasHeight = 400;
  var initial = 3;
  var final = 2;
  var h = 6.626E-34;
  var c = 3E8;
  var k = 1.38E-23;

  var img;


  var sketch = function( p ) {

    p.preload = function(){
      img = p.loadImage("images/spectrum.png");
    }

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");

      $("#controls").append("<span>TEMPERATURE</span>");
      T_slider = p.createSlider(2.7,5,3.826,0);
      T_slider.class('superposition_slider');
      T_slider.parent('controls');
      T_slider.input(update);


      // img = p.loadImage('images/spectrum.png');
      update();

    }

    function update() {

      p.noStroke();
      p.background('#111')
      p.tint(255, 50);
      p.image(img, 0, 0, canvasWidth, 300);

      T = 10**(T_slider.value());

      RGB = TtoColor(T);

      // p.background(RGBA);
      p.fill(RGB);
      p.stroke(RGB);

      p.rect(0, 300, 800, canvasHeight-100);

      p.noStroke();
      p.fill('#FFF');
      p.textSize(20);
      p.text(T.toFixed(0)+'K', 10,30);

      // draw blackbody curve

      p.stroke(RGB);
      p.strokeWeight(2);
      p.noFill();
      p.beginShape();
      for (i=0; i<canvasWidth; i++) {
        l = 2500*(i/canvasWidth) * 1E-9; // l in m
        y = 300 - Planck(l, T)/1E28;
        // p.ellipse(i,y,2,2);
        p.vertex(i, y);
      }
      p.endShape();




    }

    function Planck(l, T) {
      return (1/l**5)*(1/(Math.exp(h*c/(l*k*T))-1));
    }

  }

  window.myp5 = new p5(sketch);

}




function TtoColor(kelvin) {

  var temperature = kelvin / 100.0;
  var red, green, blue;

  if (temperature < 66.0) {
    red = 255;
  } else {
    // a + b x + c Log[x] /.
    // {a -> 351.97690566805693`,
    // b -> 0.114206453784165`,
    // c -> -40.25366309332127
    //x -> (kelvin/100) - 55}
    red = temperature - 55.0;
    red = 351.97690566805693+ 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
    if (red < 0) red = 0;
    if (red > 255) red = 255;
  }

  /* Calculate green */

  if (temperature < 66.0) {

    // a + b x + c Log[x] /.
    // {a -> -155.25485562709179`,
    // b -> -0.44596950469579133`,
    // c -> 104.49216199393888`,
    // x -> (kelvin/100) - 2}
    green = temperature - 2;
    green = -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;

  } else {

    // a + b x + c Log[x] /.
    // {a -> 325.4494125711974`,
    // b -> 0.07943456536662342`,
    // c -> -28.0852963507957`,
    // x -> (kelvin/100) - 50}
    green = temperature - 50.0;
    green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
    if (green < 0) green = 0;
    if (green > 255) green = 255;

  }

  /* Calculate blue */

  if (temperature >= 66.0) {
    blue = 255;
  } else {

    if (temperature <= 20.0) {
      blue = 0;
    } else {

      // a + b x + c Log[x] /.
      // {a -> -254.76935184120902`,
      // b -> 0.8274096064007395`,
      // c -> 115.67994401066147`,
      // x -> kelvin/100 - 10}
      blue = temperature - 10;
      blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
      if (blue < 0) blue = 0;
      if (blue > 255) blue = 255;
    }
  }

  RGB = [red, green, blue]

  return RGB;
}
