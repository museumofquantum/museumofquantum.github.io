

function hspecseries_pure(){

  var R_H = 1.09677583E7; // Rydberg constant in m^-1

  $( "#about" ).hide();
  $( "#exhibits" ).show();

  if (window.hasOwnProperty('myp5')) {
    window.myp5.remove();
  }

  $("#exhibit_title").html("Hydrogen Spectral Series");
  $("#exhibit_description").html("<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse neque ex, venenatis id mauris quis, faucibus iaculis nunc. Sed congue arcu vel lorem euismod tincidunt. Sed at lorem ullamcorper, imperdiet lectus fermentum, aliquam erat. Mauris bibendum nec purus nec finibus. Nunc eget nibh mauris. Aliquam ultrices ligula non felis tristique euismod. Etiam vitae sem orci. Proin vel neque id metus accumsan laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut eleifend finibus ipsum, vel molestie nisi dapibus ac.</p>");
  $("#instructions").html("Click anywhere to create a particle. The particle should roll up the potential but fail to overcome the barrier. Now increase the energy and see what happens. Even at high-energy the particle never overcomes the barrier. Now turn on quantum mode. There is now some non-zero probability that particles can tunnell through the barrier. This proablity depends on the initial energy of the particles.");


  // $('#exhibit_canvas').append('<div width="100%" height="50px"><div id="spectrum" style="position:relative;" ><img style="position:absolute;top:0px;left:0px;opacity:0.5;" width="800px" height="50px" src="images/spectrum.png"><div id="marker"></div></div></div>');

  $('#exhibit_canvas').append('<div style="position:relative;" id="container" width="100%" height="400px"></div>')

  $('#container').append('<img style="position:absolute;top:0px;left:0px;opacity:0.5;" width="800px" height="50px" src="images/spectrum.png">');
  $('#container').append('<div id="marker"></div>');
  $('#container').append('<div style="position:absolute;top:50px;left:0px;width:100%;height:350px;" id="colour"></div>');

  $('#marker').css({'position':'absolute','width':'1px', 'height':'50px','background-color':'#FFF', 'left':'100px'})

  $("#controls").append("<span>n<sub> initial</sub></span>");
  $('#controls').append('<input id="initial" type="range" min="1" max="10" step="1" class="superposition_slider">');

  $("#controls").append("<span>n<sub> final</sub></span>");
  $('#controls').append('<input id="final" type="range" min="1" max="10" step="1" class="superposition_slider">');

  $('#initial').change(update);
  $('#final').change(update);

  document.getElementById("initial").value = 3;
  document.getElementById("final").value = 2;

  update();

  function update() {

    i = document.getElementById("initial").value;
    f = document.getElementById("final").value;

    wv = rydberg(i,f)*1E9;

    RGBA = wavelengthToColor(wv);
    rgba = 'rgba('+String(RGBA[0])+','+String(RGBA[1])+','+String(RGBA[2])+','+String(RGBA[3])+')';
    $("#colour").css('background-color', rgba);

    x = Math.floor(800*wv/2500);
    console.log(x);
    $('#marker').css('left', String(x)+'px');
    $("#marker").css('background-color', rgba);

  }

  function rydberg(i,f) {
    return (R_H*(1/f**2 - 1/i**2))**-1;
  }

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

    RGBA = [Math.floor(R*255), Math.floor(G*255), Math.floor(B*255), alpha]

    return RGBA;

}
