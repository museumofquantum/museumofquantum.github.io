

function probability(){

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Probability");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Click to draw a particle from a probability distribution and add it to the histogram.");

  var canvasWidth = 800;
  var canvasHeight = 400;
  var channels = 20;
  var barWidth = canvasWidth / channels;
  var hist = new Array(channels).fill(0);
  var probtype = 'normal';
  var animate = false;


  var sigma_range = 4;

  var sketch = function( p ) {

    p.setup = function() {
      $("#controls").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");
      reset();

      $("#controls").append("<span>DISTRIBUTION TYPE:</span>");
      radio = p.createRadio();
      radio.option('', 'normal');
      radio.html("<span class='controls_checkbox_label'>Normal</span>", true);
      radio.option('', 'uniform');
      radio.html("<span class='controls_checkbox_label'>Uniform</span>", true);
      radio.parent('controls');
      radio._getInputChildrenArray()[1].checked = true;
      radio.changed(reset);

      checkbox = p.createCheckbox('', false);
      checkbox.changed(function() {animate = !animate});
      checkbox.html("<span class='controls_checkbox_label'>Animate</span>", true);
      checkbox.class('controls_checkbox');
      checkbox.parent('controls');

      button = p.createButton('add 100');
      button.mousePressed(function() {addN(100)});
      button.parent('controls');

      button2 = p.createButton('reset');
      button2.mousePressed(reset);
      button2.parent('controls');
    }

    p.draw = function()  {

      probtype = radio.value();

      p.background('#111');
      drawProb();

      var total = hist.reduce((a, b) => a + b, 0);

      if (animate) {
        addN(10);
      }


      for (var i = 0; i < channels; i++) {
        N = hist[i];

        if (probtype==='uniform') {
          height = 5*N/total;
        }

        if (probtype==='normal') {
          height = 2*N/total;
        }

        p.noStroke();
        p.fill(100,100,100,100);
        p.rect(i * barWidth, canvasHeight - height*canvasHeight, barWidth, height*canvasHeight);
      }
    }


    function reset() {
      for (var i = 0; i < channels; i++) {
        hist[i] = 0;
        }
    }


    function drawProb() {

      if (probtype==='normal') {

        for (var i = 0; i < canvasWidth; i++) {

          x = i/(canvasWidth/(sigma_range*2)) - sigma_range;
          y = canvasHeight*(1./Math.sqrt(p.TWO_PI))*Math.exp(-0.5*x**2);
          p.fill(200);
          p.noStroke();
          p.ellipse(i, canvasHeight-y, 2, 2);

        }
      }

      if (probtype==='uniform') {

        p.stroke(200);
        p.line(canvasWidth/4, canvasHeight, canvasWidth/4, canvasHeight-canvasHeight/2);
        p.line(canvasWidth/4, canvasHeight-canvasHeight/2, 3*canvasWidth/4, canvasHeight-canvasHeight/2);
        p.line(3*canvasWidth/4, canvasHeight-canvasHeight/2, 3*canvasWidth/4, canvasHeight);

      }



    }


    function addN(N) {
        for (var i = 0; i < N; i++) {
          addone();
        }
    }

    function addone() {
      if (probtype==='normal') {
        var u = 0, v = 0;
        while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
        while(v === 0) v = Math.random();
        n = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        i = Math.floor(n*(channels/(sigma_range*2))+channels/2);
      }
      if (probtype==='uniform') {
        i = Math.floor(Math.random() * channels/2)+channels/4;
      }
      console.log(i);
      hist[i] += 1;
    }

    p.mousePressed = function() {
      addone();
    }

  }

  window.myp5 = new p5(sketch);

}
