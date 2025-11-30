"use strict";

/* eslint-disable no-console */
var isNode = typeof module !== "undefined";
if (isNode) {
  var dom = require("../dom.js");
}

var shapes = [
  1, // circle
  2, // square
  3, // diamond
  4, // dither alg 1
  5, // dither alg 2
  6,
];

var fillDither = function fillDither(args) {
  var c = args.c,
    r = args.r,
    size = args.size,
    settings = args.settings;

  var checkArgs = Object.keys(args).sort().join(",");
  if (checkArgs !== "c,r,settings,size") {
    console.warn(
      "fillDither `args` are not ok... received:",
      checkArgs,
    );
  }

  var checkSettings = Object.keys(settings).sort().join("\n");
  if (
    checkSettings !==
    "alternate\nbaseRotation\nbg\nfg\nshape\nvaryRotation\nwiggle"
  ) {
    console.warn(
      "fillDither argument `settings` is not ok... received:",
      checkSettings,
    );
  }

  var _settings$alternate = settings.alternate,
    alternate =
      _settings$alternate === undefined
        ? r.getNumber(0, 1) > 0.5
        : _settings$alternate,
    baseRotation = settings.baseRotation,
    _settings$bg = settings.bg,
    bg =
      _settings$bg === undefined
        ? c.getRandomColour()
        : _settings$bg,
    _settings$fg = settings.fg,
    fg =
      _settings$fg === undefined
        ? c.getRandomColour(true)
        : _settings$fg,
    _settings$shape = settings.shape,
    shape =
      _settings$shape === undefined
        ? shapes[r.getInteger(0, shapes.length - 1)]
        : _settings$shape,
    varyRotation = settings.varyRotation,
    _settings$wiggle = settings.wiggle,
    wiggle =
      _settings$wiggle === undefined ? 10 : _settings$wiggle;

  var half = size / 2;
  var padding = Math.sqrt(half * half * 2) - half; // the gaps between the corner when rotated 45 degrees
  var min = -padding;
  var max = size + padding * 2;

  var stage = dom.canvas(size, size);
  var ctx = stage.ctx,
    canvas = stage.canvas;
  // document.body.appendChild(canvas);

  ctx.translate(half, half);
  ctx.rotate(baseRotation + r.getNumber(0, varyRotation));
  ctx.translate(-half, -half);

  // ctx.fillStyle = "#f00";
  // ctx.fillRect(half - 25, half - 25, 50, 50);

  // draw background
  ctx.fillStyle = bg;
  ctx.fillRect(min, min, max, max);

  // draw dither
  var jump = size / 40;
  var yJump = jump;
  var xJump = jump;

  var diamondScale = r.getNumber(0.5, 1);

  ctx.fillStyle = fg;
  ctx.strokeStyle = fg;

  var i = void 0;
  var y = min;
  var row = 0;
  while (y < max) {
    var ditherRatio = y / size;
    var ditherAmount = ditherRatio * jump;
    if (ditherRatio <= 0) {
      // not visible, don't render anything
      row++;
      y += yJump;
      continue;
    }
    if (ditherRatio >= 1.1) {
      // no discernible detail, flood fill!
      ctx.fillRect(min, y, max - min, max - y);
      break;
    }

    var x = min - (alternate && row % 2 === 0 ? xJump / 2 : 0);
    while (x < max) {
      var wiggleX = (wiggle * r.getNumber(-xJump, xJump)) / 2;
      var wiggleY = (wiggle * r.getNumber(-yJump, yJump)) / 2;

      if (shape === 1) {
        // circle
        ctx.beginPath();
        ctx.drawCircle(
          x + wiggleX,
          y + wiggleY,
          ditherAmount * 0.7,
        );
        ctx.closePath();
        ctx.fill();
      } else if (shape === 2) {
        // square
        ctx.fillRect(
          x + wiggleX,
          y + wiggleY,
          ditherAmount,
          ditherAmount,
        );
      } else if (shape === 3) {
        // diamond
        ctx.save();
        ctx.translate(x + wiggleX, y + wiggleY);
        ctx.scale(diamondScale, 1);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(0, 0, ditherAmount, ditherAmount);
        ctx.restore();
      } else if (shape === 4) {
        // dither - alg 1, randomly distribute
        for (i = 0; i < ditherAmount * 5; i++) {
          var xd = x + Math.random() * xJump;
          var yd = y + Math.random() * yJump;
          ctx.fillRect(xd, yd, 2, 2);
        }
      } else if (shape === 5) {
        // dither - alg 2, randomly fill all cells.
        var blocksize = 2;
        var blocks = jump / blocksize;
        for (i = 0; i < Math.pow(blocks, 2); i++) {
          if (Math.random() > ditherRatio) continue;
          var overlap = 0.3; // slight bleed
          var _xd = x + (i % blocks) * blocksize;
          var _yd = y + Math.floor(i / blocks) * blocksize;
          ctx.fillRect(
            _xd - overlap,
            _yd - overlap,
            blocksize + overlap * 2,
            blocksize + overlap * 2,
          );
        }
      } else if (shape === 6) {
        // dither - crosshatches
        for (i = 0; i < ditherAmount; i++) {
          var angle = r.getNumber(0, Math.PI * 2);
          var distance = ditherRatio * jump * 3;
          var d1 =
            r.getNumber(1, 1) * Math.sin(angle) * distance;
          var d2 =
            r.getNumber(1, 1) * Math.cos(angle) * distance;

          var xs = x + xJump / 2 - d1;
          var ys = y + yJump / 2 - d2;
          var xe = x + xJump / 2 + d1;
          var ye = y + xJump / 2 + d2;

          var isForeground = r.random() < ditherRatio;

          ctx.strokeStyle = isForeground ? fg : bg;
          ctx.lineWidth = isForeground ? 4 : 2;
          ctx.beginPath();
          ctx.moveTo(xs, ys);
          ctx.lineTo(xe, ye);
          ctx.stroke();
        }
      } else if (shape === 80) {
        // failed but nice
        // dither - crosshatches
        /*for (i = 0; i < 2; i++) {
    	const xs = x + xJump / 2;
    	const ys = y + yJump / 2; // + r.getNumber(0, yJump);
    	const angle = rand.getNumber(0, Math.PI * 2);
    	const xe = xs; // + r.getNumber(0, Math.sin(angle) * ditherRatio * jump * 3);
    	const ye = ys + r.getNumber(0, Math.cos(angle) * ditherRatio * jump * 3);
    	ctx.lineWidth = 2;
    	ctx.beginPath();
    	ctx.moveTo(xs, ys);
    	ctx.lineTo(xe, ye);
    	ctx.stroke();
    }*/
      } else {
        throw new Error("no shape!");
      }
      x += xJump;
    }
    row++;
    y += yJump;
  }

  return canvas;
};

if (isNode) module.exports = fillDither;
