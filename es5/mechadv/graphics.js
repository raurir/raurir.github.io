"use strict";

var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;
    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError(
        "Invalid attempt to destructure non-iterable instance",
      );
    }
  };
})();

/*global fxrand, pi, pi2*/

/* ideas

slice/nook for at inner radius for gear lock

extruding screw at inner radius for gear lock

*/

var number = function number(min, max) {
  return fxrand() * (max - min) + min;
};
var integer = function integer(min, max) {
  return ~~number(min, max + 1);
};

var colourMutate = function colourMutate(_ref) {
  var _ref2 = _slicedToArray(_ref, 3),
    r = _ref2[0],
    g = _ref2[1],
    b = _ref2[2];

  var amount =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : 0;
  return (
    "rgb(" +
    [r, g, b]
      .map(function (channel) {
        return ~~number(channel - amount, channel + amount);
      })
      .join(",") +
    ")"
  );
};

var limitVisible = function limitVisible(v) {
  return Math.min(Math.max(v, 30), 250);
};
var modAm = 20;
var greyMod = [0, 0, 0].map(function () {
  return number(-1, 1) * modAm;
});
var highlight = [0, 0, 0].map(function (_, i) {
  return limitVisible(~~number(50, 240) + greyMod[i]);
});

// eslint-disable-next-line no-unused-vars
function colourGrey(options) {
  var defaults = {darkest: 0, lightest: 255, alpha: 1};
  for (var p in options) {
    defaults[p] = options[p];
  }
  var white =
    defaults.white ||
    integer(defaults.darkest, defaults.lightest);
  var r = limitVisible(white + greyMod[0]),
    g = limitVisible(white + greyMod[1]),
    b = limitVisible(white + greyMod[2]),
    a = defaults.alpha;
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

// eslint-disable-next-line no-unused-vars
function makeCanvas(w, h) {
  var can = document.createElement("canvas");
  can.width = w;
  can.height = h;
  return can;
}

function generateNoise(w, h, options) {
  var defaults = {
    darkest: 1,
    lightest: 4,
    alpha: 0.3,
    percentage: 0,
  };
  for (var p in options) {
    defaults[p] = options[p];
  }
  var canvas = makeCanvas(w, h);
  var ctx = canvas.getContext("2d");
  for (var x = 0; x < w; x++) {
    for (var y = 0; y < h; y++) {
      if (number(0, 1) > defaults.percentage) {
        ctx.fillStyle = colourGrey(defaults);
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }
  return canvas;
}
var noise = void 0;

// eslint-disable-next-line no-unused-vars
function generateMetal(w, h) {
  noise = noise || generateNoise(300, 300, {percentage: 0.1});
  var canvas = makeCanvas(w, h);
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = colourGrey({
    darkest: 0,
    lightest: 90,
    alpha: 1,
  });
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(noise, 0, 0);
  return canvas;
}

function drawCircle(c, x, y, r, style) {
  c.moveTo(x + r, y);
  var defaults = {
    fillStyle: "#fff",
    lineWidth: 0,
    strokeStyle: "#000",
  };
  for (var p in style) {
    defaults[p] = style[p];
  }
  c.fillStyle = defaults.fillStyle;
  c.lineWidth = defaults.lineWidth;
  c.strokeStyle = defaults.strokeStyle;
  c.beginPath();
  c.arc(x, y, r, 0, pi2, true);
  c.closePath();
  if (defaults.fillStyle) c.fill();
  if (defaults.lineWidth) c.stroke();
}

// eslint-disable-next-line no-unused-vars
function drawBand(ctx, minRadius, maxRadius) {
  var midRadius = (maxRadius + minRadius) / 2;
  var bandSize = maxRadius - minRadius;
  var style = {
    fillStyle: null,
    // strokeStyle: colourGrey({
    // 	darkest: 0,
    // 	lightest: 40,
    // 	alpha: 0.5,
    // }),
    strokeStyle:
      number(0, 1) > 0.7
        ? colourMutate(highlight, 20)
        : colourGrey(),
    // colour rust removed from original
    lineWidth: bandSize,
  };
  drawCircle(ctx, 0, 0, midRadius, style);
}

// eslint-disable-next-line no-unused-vars
function drawCutouts(ctx, teeth, minRadius, maxRadius) {
  var midRadius = (maxRadius + minRadius) / 2;
  var bandSize = maxRadius - minRadius;
  var style = integer(1, 2);
  switch (style) {
    case 1:
      generateHoles(ctx, teeth, midRadius, bandSize);
      break;
    case 2:
      generateSegment(ctx, teeth, midRadius, bandSize);
      break;
  }
}

function generateHoles(ctx, teeth, midRadius, bandSize) {
  //var holes = ~~(teeth * integer(1,3) / integer(1,2));
  var holeSize = (bandSize / 2) * number(0.6, 0.9);
  var holes = ~~(
    (number(0.5, 0.9) * pi2 * midRadius) /
    holeSize /
    2
  );
  holeSize *= number(0.5, 0.9);
  for (var i = 0; i < holes; i++) {
    var angle = (i / holes) * pi2; // + step / 2;
    drawCircle(
      ctx,
      midRadius * Math.cos(angle),
      midRadius * Math.sin(angle),
      holeSize,
    );
  }
}

function generateSegment(ctx, teeth, midRadius, bandSize) {
  // capped specifies segments to be rounded or angular... angular with many segments will be akin to spokes
  var capped = integer(0, 1) == 0;
  var segments =
    ~~Math.pow(
      teeth,
      1 / (capped ? integer(2, 4) : integer(2, 3)),
    ) + 1;
  var holeSize = number(0.5, 0.8) * bandSize;
  // if capped, remove the capping from segment size... on second thoughts, otherwise remove a little anyway!
  var segmentSize =
    (pi2 / segments -
      (Math.asin(holeSize / midRadius) * capped ? 1 : 0.5)) *
    number(0.5, 0.9);
  var innerRadius = midRadius - holeSize / 2;
  var outerRadius = midRadius + holeSize / 2;

  for (var i = 0; i < segments; i++) {
    var startAngle = (i / segments) * pi2;
    var endAngle = startAngle + segmentSize;
    ctx.beginPath();
    ctx.moveTo(
      Math.cos(startAngle) * innerRadius,
      Math.sin(startAngle) * innerRadius,
    );
    ctx.arc(0, 0, innerRadius, startAngle, endAngle, false);
    if (capped) {
      ctx.arc(
        Math.cos(endAngle) * midRadius,
        Math.sin(endAngle) * midRadius,
        holeSize / 2,
        endAngle + pi,
        endAngle,
        true,
      );
    } else {
      ctx.lineTo(
        Math.cos(endAngle) * outerRadius,
        Math.sin(endAngle) * outerRadius,
      );
    }
    ctx.arc(0, 0, outerRadius, endAngle, startAngle, true);
    if (capped) {
      ctx.arc(
        Math.cos(startAngle) * midRadius,
        Math.sin(startAngle) * midRadius,
        holeSize / 2,
        startAngle,
        startAngle + pi,
        true,
      );
    } else {
      ctx.lineTo(
        Math.cos(startAngle) * innerRadius,
        Math.sin(startAngle) * innerRadius,
      );
    }
    ctx.closePath();
    ctx.fill();
  }
}

// eslint-disable-next-line no-unused-vars
function drawSpokes(ctx, teeth, minRadius, maxRadius) {
  var spokes = Math.min(
    Math.max(2, Math.floor(teeth * number(0.2, 1))),
    50,
  );

  var shaftBase =
    minRadius * Math.atan(pi / spokes) * number(0.6, 1);
  var shaftTop =
    spokes > 20
      ? shaftBase
      : maxRadius * Math.atan(pi / spokes) * number(0.1, 0.3);

  ctx.beginPath();
  for (var i = 0; i < spokes; i++) {
    var angle = (i / spokes) * pi2;

    var tangent = pi / 2 - angle;
    var baseOffsetX = shaftBase * Math.cos(tangent);
    var baseOffsetY = shaftBase * Math.sin(tangent);

    var topOffsetX = shaftTop * Math.cos(tangent);
    var topOffsetY = shaftTop * Math.sin(tangent);

    ctx[i == 0 ? "moveTo" : "lineTo"](
      Math.cos(angle) * minRadius + baseOffsetX,
      Math.sin(angle) * minRadius - baseOffsetY,
    );
    ctx.lineTo(
      Math.cos(angle) * maxRadius + topOffsetX,
      Math.sin(angle) * maxRadius - topOffsetY,
    );
    ctx.lineTo(
      Math.cos(angle) * maxRadius - topOffsetX,
      Math.sin(angle) * maxRadius + topOffsetY,
    );
    ctx.lineTo(
      Math.cos(angle) * minRadius - baseOffsetX,
      Math.sin(angle) * minRadius + baseOffsetY,
    );
  }
  ctx.closePath();
  ctx.fill();
}

// eslint-disable-next-line no-unused-vars
function drawBike(ctx, minRadius, maxRadius) {
  var innerRadius = minRadius * 1.1;
  var outerRadius = maxRadius * 0.9;

  var spokes = integer(5, 10);
  var corners = integer(1, 3);

  var positive = 2 * integer(0, 1) - 1;

  var o = 0;
  var offsets = Array(corners)
    .fill()
    .map(function () {
      o += positive * number(0, 0.3);
      return {
        offsetAngle: o,
        offsetRadius: number(
          innerRadius + (outerRadius - innerRadius) * 0.3,
          outerRadius,
        ),
      };
    });

  var lineWidth = maxRadius / 10;

  // console.log(JSON.stringify(offsets));

  var _loop = function _loop() {
    var angle = (i / spokes) * pi2;

    ctx.beginPath();
    ctx.moveTo(
      Math.cos(angle) * innerRadius,
      Math.sin(angle) * innerRadius,
    );
    offsets.forEach(function (_ref3, index) {
      var offsetAngle = _ref3.offsetAngle,
        offsetRadius = _ref3.offsetRadius;

      var r = index < 2 ? outerRadius : offsetRadius;
      ctx.lineTo(
        Math.cos(angle + offsetAngle) * r,
        Math.sin(angle + offsetAngle) * r,
      );
    });
    ctx.lineJoin = "round";
    ctx.closePath();
    // ctx.strokeStyle = "#f304";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = lineWidth;
    // ctx.lineWidth = 2; //50;
    ctx.fill();
    ctx.stroke();
  };

  for (var i = 0; i < spokes; i++) {
    _loop();
  }
}

// eslint-disable-next-line no-unused-vars
function drawSeeds(ctx, minRadius, maxRadius) {
  var rays = integer(5, 10);
  var theta = pi2 / rays;
  var delta = maxRadius - minRadius;
  var startDistance = number(minRadius * 1.3, minRadius * 1.5);
  var layers = Math.floor(delta / 10);
  var cGap = 0;
  for (var j = 1; j < layers; j++) {
    var distance =
      startDistance + Math.pow(j * (delta / layers), 2) * 1; // + cGap * 1;

    cGap = Math.sin(theta / 2) * distance * 1.3;

    var circleSize = (cGap / 2) * 0.8; //1.2 * Math.pow(j + 1, 2);
    if (distance + circleSize > maxRadius * 0.95) {
      break; // too big, bail...
      // circleSize -= distance - maxRadius;
    }
    for (var i = 0; i < rays; i++) {
      var _angle = (i + (j % 2) * 0.5) * theta;
      drawCircle(
        ctx,
        Math.cos(_angle) * distance,
        Math.sin(_angle) * distance,
        circleSize,
      );
    }
  }
}
