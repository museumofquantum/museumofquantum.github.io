

function muons(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("How many Muons");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Use the slider to set the quantum number of the particle. Presented are the real and imaginary parts of the wavefunction alongside the probability desnity.");
  var canvasWidth = 800;
  var canvasHeight = 400;

  var size = 100;
  var x1 = 0;
  var x2 = 0;
  var y1 = 0;
  var y2 = 0;
  var currentClicked = false;

  var sketch = function( p ) {

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");
    }

    p.draw = function() {

      p.noStroke();
      p.background('#111')


      if (currentClicked) {
        p.fill(30);
        p.rect(x1,y1, p.mouseX-x1, p.mouseY-y1);
      } else {
        p.fill(60);
        p.rect(x1,y1, x2-x1, y2-y1);
      }



    }


    p.mousePressed = function () {
      x1 = p.mouseX;
      y1 = p.mouseY;
      x2 = x1;
      y2 = y1;
      console.log(x1,y1)
      currentClicked = true;
    }

    p.mouseReleased = function () {
      x2 = p.mouseX;
      y2 = p.mouseY;
      console.log(x2,y2)
      currentClicked = false;
    }

  }



  window.myp5 = new p5(sketch);

}
