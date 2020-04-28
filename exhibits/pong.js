


function pong(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Quantum Pong");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Use your mouse to control the paddle. Due to quantum tunnelling the ball has a chance of passing through the paddle depending on its energy and the thickness of the barrier.");


  var sketch = function( p ) {

    var xBall = Math.floor(Math.random() * 300) + 50;
    var yBall = 50;
    var diameter = 20;
    var xBallChange = 3;
    var yBallChange = 3;

    var canvasWidth = 800;
    var canvasHeight = 400;


    // Variables for the paddle
    var xPaddle;
    var yPaddle;
    var paddleWidth = 100;
    var paddleHeight = 15;

    var quantum = true;
    var V0 = 1.0;
    var started = false;
    var score = 0;

    var prob = 0.8;

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");
      $("#controls").append("<span>BARRIER WIDTH</span>");
      width_slider = p.createSlider(0,5.0,2.5,0);
      width_slider.class('superposition_slider');
      width_slider.parent('controls');
      $("#controls").append("<span>E/V</span>");
      E_slider = p.createSlider(0,2.0,0.1,0);
      E_slider.class('superposition_slider');
      E_slider.parent('controls');
    }

    p.draw = function() {

      getProb();

      var paddleHeight = 15*width_slider.value();

      p.background('#111');

      // Ball bounces off walls
    	xBall += xBallChange;
    	yBall += yBallChange;
    	if (xBall < diameter/2 ||
          xBall > canvasWidth - 0.5*diameter) {
    		xBallChange *= -1;
      }
    	if (yBall < diameter/2) {
        yBallChange *= -1;
    	}

      if (yBall > canvasHeight - diameter) {
        xBall = Math.floor(Math.random() * 300) + 50;
        yBall = 50;
        score = 0;
        xBallChange = Math.floor(p.random(0,1)*6)-3.0;
    	}

      // Detect collision with paddle
      if ((xBall > xPaddle &&
          xBall < xPaddle + paddleWidth) &&
          (yBall + (diameter/2) >= yPaddle) &&
          (yBall + (diameter/2) <= yPaddle+yBallChange-1)) {

            if (p.random(0,1) > prob) {
                xBallChange *= -1;
                yBallChange *= -1;
                score++;
              } else {
                alert("Even the best player can't beat the rules of quantum mechanics. Just like in life, death is inevitable no matter how well you play the game.")
              }
      }



      // Draw ball
    	p.fill(255);
    	p.noStroke();
    	p.ellipse(xBall, yBall, diameter, diameter);

      // Update paddle location
      if (!started) {
        xPaddle = p.mouseX;
        yPaddle = canvasHeight - 100;
        started = true;
      }

      // Draw paddle
      p.fill(100);
      p.noStroke();
      p.rect(xPaddle, yPaddle, paddleWidth, paddleHeight);

      // Draw score
      p.fill(255);
      p.textSize(25);
      p.text("Transmission probability: " + prob.toFixed(3), 10, 25);
      p.fill(200);
      p.textSize(20);
    	p.text("Score: " + score, canvasWidth-100, 25);
    }


    p.mouseMoved = function() {
      xPaddle = p.mouseX;
    }


    function getProb(){

        if (quantum) {
          if (E_slider.value()<V0) {
            prob = 1/(1+((V0**2*Math.sinh(width_slider.value()*Math.sqrt(V0-E_slider.value()))**2)/(4*E_slider.value()*(V0-E_slider.value()))));
          } else if (E_slider.value()==V0) {
            E=V0-0.0001;
            prob = 1/(1+((V0**2*Math.sinh(width_slider.value()*Math.sqrt(V0-E_slider.value()))**2)/(4*E_slider.value()*(V0-E_slider.value()))));
          } else {
            prob = 1/(1+((V0**2*Math.sin(width_slider.value()*Math.sqrt(E_slider.value()-V0))**2)/(4*E_slider.value()*(E_slider.value()-V0))));
          }
        } else {
          if (E_slider.value()<V0) {
            prob = 0.0;
          } else {
            prob = 1.0;
          }
        }
      }


    }



  window.myp5 = new p5(sketch);
}
