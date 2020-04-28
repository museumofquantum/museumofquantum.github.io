

function probability(){

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Probability");
  $("#exhibit_description").html("<p>Click to release a particle with energy equivalent to the y-axis position.</p>");

  var canvasWidth = 800;
  var canvasHeight = 400;
  var channels = 20;
  var barWidth = canvasWidth / channels;
  var hist = new Array(channels).fill(0);
  var probtype = 'normal';
  var animate = true;


  var sigma_range = 4;

  var sketch = function( p ) {

    p.setup = function() {
      $("#inputs").empty();
      var canvas = p.createCanvas(canvasWidth, canvasHeight);
      canvas.parent("exhibit_canvas");
      button = p.createButton('add 100');
      button.mousePressed(addN(100));
      button2 = p.createButton('reset');
      button2.mousePressed(reset);
    }

    p.draw = function()  {

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
