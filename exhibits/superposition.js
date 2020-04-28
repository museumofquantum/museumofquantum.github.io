

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
