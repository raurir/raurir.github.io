"use strict";

var perlin_leaves = function perlin_leaves(perlin) {

  var timer = function (c) {
    var t = {},
        f = function f() {
      return new Date().getTime();
    };return { start: function start(k) {
        t[k] = f();
      }, end: function end(k) {
        c.log(k, f() - t[k]);
      } };
  }(console);

  var pixel = 10;
  var w = 40;
  var h = 40;

  var M = Math;
  var r = M.random;

  var c = document.createElement("canvas");
  c.width = w * pixel;
  c.height = h * pixel;
  var ctx = c.getContext('2d');

  var logger = document.createElement("div");
  document.body.appendChild(logger);

  var channelRed = perlin.noise(w, h);

  var seed = Math.random() * 1000;
  function drawIt(time) {

    var red = channelRed.cycle(seed + 0.01 * time, 0.01);

    for (var i = 0, il = w * h; i < il; i++) {
      var xp = i % w;
      var yp = Math.floor(i / w);
      var dx = xp - w / 2;
      var dy = yp - h / 2;
      var d = w / 2 - Math.sqrt(dx * dx + dy * dy);
      // d.save();
      // d.setTransform( 1, 0, 0, 1, 0, 0 );
      var r = ~~(red[i] * 255 * d);
      ctx.fillStyle = "rgb(" + r + "," + r + "," + r + ")";
      ctx.fillRect(xp * pixel, yp * pixel, pixel, pixel);

      /*
      sc = Math.sqrt( red[i] * red[i] + blue[i] * blue[i] ) * 0.00001;
      rot = (Math.atan( blue[i] / red[i] ) ) + (red[i] >= 0 ? 0 :  Math.PI);
      d.setTransform(
        sc,
        Math.sin(rot),
        Math.sin(Math.PI + rot),
        sc,
        (xp+0.5) * pixel, // + red[i] * 0.02,
        (yp+0.5) * pixel // + blue[i] * 0.02
      );
      d.fillStyle = "rgba( 255, 255, 255, 0.8 )";
      d.beginPath();
      d.moveTo( -2, 0 );
      d.lineTo( 0, 10 );
      d.lineTo(  2, 0 );
      d.closePath();
      d.fill();
      */
      // d.restore();
    }
    // timer.end("render");
    // timer.end("drawIt");

    // logger.innerHTML = min + '<br>' +  max;
    requestAnimationFrame(drawIt);
  };

  return {
    init: function init() {
      drawIt(0);
    },
    stage: c
  };
};

define("perlin_leaves", ["perlin"], perlin_leaves);
