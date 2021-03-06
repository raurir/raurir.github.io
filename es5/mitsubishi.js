"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// https://codepen.io/raurir/pen/MoppPE/

//  convert -delay 1  *.png animation.gif

var con = console;
var dom = require("./dom.js");
var fs = require("fs");

var size = 300;
var centre = size / 2;
var gridY = 12;
var gridX = gridY * 4;
var thirty = Math.PI / 6;
var sinThirty = Math.sin(thirty);
var cosThirty = Math.cos(thirty);

var c = dom.canvas(size, size);
var ctx = c.ctx;

var unit = 90;

var saveFile = function saveFile(canvas, frame, cb) {
  var filename = '/../export/' + (String(frame).length == 1 ? "0" : "") + frame + '.png';
  canvas.toBuffer(function (err, buf) {
    if (err) {
      con.log("saveFile err", err);
    } else {
      fs.writeFile(__dirname + filename, buf, function () {
        con.log("saveFile success", typeof buf === "undefined" ? "undefined" : _typeof(buf), __dirname + filename);
        cb();
      });
    }
  });
};

var draw = function draw(x, y) {
  var drawLeaf = function drawLeaf(angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(sinThirty * unit, cosThirty * unit);
    ctx.lineTo(0, cosThirty * unit * 2);
    ctx.lineTo(-sinThirty * unit, cosThirty * unit);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };
  drawLeaf(thirty * 1);
  drawLeaf(thirty * 5);
  drawLeaf(thirty * 9);
};

var frames = 32,
    loops = 3;
var render = function render(frame) {

  //time *= 6;
  // requestAnimationFrame(render);
  var scale = Math.sin(frame / frames * Math.PI * 2 - Math.PI / 2) + 1.98; // 2 is perfect here, but no to harmony.
  //scale *= 0.1;
  unit = 51; //(Math.sin(time * 0.0002) + 2) * 30;
  var angle = Math.floor(frame / frames) * Math.PI * 2 / 3 / 4; //Math.sin(time * 0.0001 * Math.PI);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#d11"; // this is mistabishi red https://www.youtube.com/watch?v=is-HVxmUELQ
  ctx.save();
  ctx.translate(centre, centre);
  ctx.rotate(angle);
  ctx.translate(-centre, -centre);
  var gx = 0;
  while (gx++ < gridX) {
    var gy = 0;
    while (gy++ < gridY) {
      var x = centre + (gx - gridX / 2) * cosThirty * unit * scale,
          y = centre + (gx % 2 * 3 + (gy - gridY / 2) * 6) * sinThirty * unit * scale;
      draw(x, y);
    }
  }
  ctx.restore();
  saveFile(c.canvas, frame, function () {
    frame++;
    if (frame < frames * loops) {
      render(frame);
    }
  });
};
render(0);
