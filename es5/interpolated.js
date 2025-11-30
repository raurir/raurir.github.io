"use strict";

var isNode = typeof module !== "undefined";

if (isNode) {
  // Canvas = require('canvas');
  // eslint-disable-next-line no-redeclare
  var rand = require("./rand.js");
  // eslint-disable-next-line no-redeclare
  var dom = require("./dom.js");
  // eslint-disable-next-line no-redeclare
  var colours = require("./colours.js");
  var lagrange = require("./lagrange.js");
}

// const log = (...args) => console.info(...args);
var log = function log() {};

// eslint-disable-next-line no-unused-vars
var interpolated = function interpolated() {
  var isSvg =
    arguments.length > 0 && arguments[0] !== undefined
      ? arguments[0]
      : false;

  var r = rand.instance();
  var c = colours.instance(r);

  var stage = isSvg
    ? dom.svg("svg", {width: 1, height: 1})
    : dom.canvas(1);
  var initialSettings = {
    background: {
      type: "Boolean",
      label: "Background",
      cur: true,
    },
  };

  var settings = initialSettings;
  var progress = function progress() {};
  var size = void 0;

  var init = function init(options) {
    // console.log(options);
    var seed = options.seed;

    if (options.progress) {
      progress = options.progress;
    }
    if (options.size) {
      size = options.size;
    }

    settings = JSON.parse(
      JSON.stringify(options.settings || initialSettings),
    );

    progress("settings:initialised", settings);

    r.setSeed(seed);
    c.getRandomPalette();

    var TAU = Math.PI * 2;
    var maskColourShow = "white";
    var maskColourHide = "black";

    var half = 0.5;
    var offScreen = Math.sqrt(half * half * 2);
    var detail = Math.ceil(size / 2);
    var threshold = 1 / 500;
    var points = r.getInteger(4, 8);
    var lines = r.getInteger(30, 150);
    var maxStrokeWidth = r.getNumber(1, 20) / 1000;

    var isRotated = r.getNumber(0, 1) > 0.5;
    var layer0Rotation = isRotated ? r.getNumber(0, 180) : 0;
    var layer1Rotation =
      layer0Rotation + (isRotated ? r.getNumber(-30, 30) : 0);
    var layer1Offset = isRotated
      ? {x: 0, y: 0}
      : {
          x: r.getNumber(-50, 50) / 1000,
          y: r.getNumber(-50, 50) / 1000,
        };

    var sameColourMod = r.getNumber(0, 1);
    var bgColour = c.getRandomColour();
    var drawLayer0 = r.getNumber(0, 1) > 0.3;
    var drawLayer1 = drawLayer0
      ? r.getNumber(0, 1) > 0.5
      : true;
    var overlapStroked = drawLayer1 && r.getNumber(0, 1) > 0.5;

    // common
    var sides = void 0,
      startAngle = void 0,
      radius = void 0,
      isPoly = void 0;

    // svg
    var bg = void 0,
      ctx = void 0,
      inner = void 0,
      layer0Mask = void 0,
      layer0Show = void 0,
      layer1Mask = void 0,
      layer1Show = void 0;

    // canvas
    var bmpSize = 2 * Math.sqrt((size * size) / 2);
    var layerCurves = void 0,
      layer0Bmp = void 0,
      layer1Bmp = void 0;

    if (isSvg) {
      dom.setAttributes(stage, {
        width: size,
        height: size,
        viewBox: "0 0 " + size + " " + size,
      });
      inner = dom.svg("g", {id: "curves"});
      bg = dom.svg("rect", {
        x: 0,
        y: 0,
        width: size,
        height: size,
        style: "fill:" + bgColour,
      });
      layer0Mask = dom.svg("mask", {id: "zeroMask"});
      layer0Show = dom.svg("rect", {
        x: -size,
        y: -size,
        width: size * 3,
        height: size * 3,
        style: "fill:" + maskColourShow,
      });
      layer1Mask = dom.svg("mask", {id: "oneMask"});
      layer1Show = dom.svg("rect", {
        x: -size,
        y: -size,
        width: size * 3,
        height: size * 3,
        style: "fill:" + maskColourHide,
      });

      stage.appendChild(inner);
      if (settings.background.cur) stage.appendChild(bg);
      stage.appendChild(layer0Mask);
      layer0Mask.appendChild(layer0Show);
      stage.appendChild(layer1Mask);
      layer1Mask.appendChild(layer1Show);
    } else {
      stage.setSize(size, size);
      ctx = stage.ctx;
      if (settings.background.cur) {
        ctx.fillStyle = bgColour;
        stage.ctx.fillRect(0, 0, size, size);
      }
      layerCurves = dom.canvas(bmpSize);
      layerCurves.ctx.translate(
        (bmpSize - size) / 2,
        (bmpSize - size) / 2,
      );
      layer0Bmp = dom.canvas(bmpSize);
      layer1Bmp = dom.canvas(bmpSize);
    }

    var oscillators = Array(points * 4)
      .fill()
      .map(function () {
        return {
          o: r.getNumber(-Math.PI, Math.PI),
          s: r.getNumber(0.001, 0.004) * 5,
        };
      });

    var getOscillator = function getOscillator(pi, t) {
      var d = 0.1;
      var m0 = void 0,
        m1 = void 0,
        m2 = void 0,
        m3 = void 0;
      for (var i = 0; i < 4; i++) {
        m0 = oscillators[pi + i + 0];
        m1 = oscillators[pi + i + 1];
        m2 = oscillators[pi + i + 2];
        m3 = oscillators[pi + i + 3];
      }
      var fn = function fn(acc, _ref) {
        var o = _ref.o,
          s = _ref.s;
        return acc + Math.sin(o + t * s);
      };
      var x = [m0, m1].reduce(fn, 0) * d * 0.3;
      var y = [m2, m3].reduce(fn, 0) * d * 0.5;
      return {x: x, y: y};
    };

    var getBasePoint = function getBasePoint(li, pi) {
      var _getOscillator = getOscillator(pi, li * 4 + pi * 20),
        xo = _getOscillator.x,
        yo = _getOscillator.y;

      var x = pi / (points - 1) + xo;
      var y = li / lines + yo;
      return {x: x, y: y};
    };

    var getPoint = function getPoint(li, pi) {
      return basePoints[li][pi];
    };

    var drawCurve = function drawCurve(li, _ref2) {
      var colour = _ref2.colour,
        strokeWidth = _ref2.strokeWidth;

      var arrPoints = Array(points)
        .fill()
        .map(function (_, pi) {
          return getPoint(li, pi);
        });

      var lag = lagrange(arrPoints);

      var path = [];
      var lx = void 0,
        ly = void 0;

      if (!isSvg) {
        layerCurves.ctx.beginPath();
        layerCurves.ctx.strokeStyle = colour;
        layerCurves.ctx.lineWidth = strokeWidth;
      }

      Array(detail)
        .fill()
        .forEach(function (_, i) {
          var x =
            -offScreen + (i / detail) * (1 + 2 * offScreen);
          var y = lag.valueOf(x);

          var dx = x - lx;
          var dy = y - ly;

          if (Math.sqrt(dx * dx + dy * dy) < threshold) {
            // no purpose in rendering this node, too close to previous
            return;
          }

          if (isSvg) {
            path.push(i === 0 ? "M" : "L", x * size, y * size);
          } else {
            if (i == 0) {
              layerCurves.ctx.moveTo(x * size, y * size);
            } else {
              layerCurves.ctx.lineTo(x * size, y * size);
            }
          }

          lx = x;
          ly = y;
        });

      if (!isSvg) {
        layerCurves.ctx.stroke();
      }

      return isSvg
        ? dom.svg("path", {
            d: path.join(" "),
            fill: "transparent",
            stroke: colour,
            "stroke-width": strokeWidth,
          })
        : path;
    };

    var basePoints = Array(lines)
      .fill()
      .map(function (_, li) {
        return Array(points)
          .fill()
          .map(function (_, pi) {
            return getBasePoint(li, pi);
          });
      });

    var lastColour = c.getRandomColour();
    Array(lines)
      .fill()
      .forEach(function (_, li) {
        var sameColour = r.getNumber(0, 1) > sameColourMod;
        var colour = void 0;
        if (sameColour) {
          colour = lastColour;
        } else {
          colour = bgColour;

          var i = 0;
          while (colour == bgColour && i < 5) {
            colour = c.getRandomColour();
            i++;
          }
        }
        lastColour = colour;
        var strokeWidth =
          r.getNumber(1 / 1000, maxStrokeWidth) * size;
        var curve = drawCurve(li, {
          colour: colour,
          strokeWidth: strokeWidth,
        });
        isSvg && inner.appendChild(curve);
      });

    if (drawLayer1) {
      sides = r.getInteger(3, 8);
      startAngle = r.getNumber(0, 360);
      radius = r.getNumber(half * 0.3, half * 0.7);
      isPoly = r.getNumber(0, 1) > 0.5;
    }

    var polyPath = function polyPath(_ref3) {
      var radius = _ref3.radius,
        sides = _ref3.sides;
      return Array(sides)
        .fill()
        .map(function (_, j) {
          var angle = (j / sides) * TAU;
          var x = radius * Math.cos(angle) * size;
          var y = radius * Math.sin(angle) * size;
          return {x: x, y: y};
        });
    };

    if (isSvg) {
      // begin vector render

      var drawPolygonSvg = function drawPolygonSvg(_ref4) {
        var radius = _ref4.radius,
          sides = _ref4.sides;

        var path = polyPath({radius: radius, sides: sides})
          .map(function (_ref5, j) {
            var x = _ref5.x,
              y = _ref5.y;
            return (j === 0 ? "M" : "L") + x + "," + y;
          })
          .concat("Z");
        return dom.svg("path", {d: path.join(" ")});
      };

      var drawCircleSvg = function drawCircleSvg(_ref6) {
        var radius = _ref6.radius;
        return dom.svg("circle", {r: radius * size});
      };

      var shapeItSvg = function shapeItSvg(_ref7) {
        var masker = _ref7.masker,
          rotation = _ref7.rotation,
          x = _ref7.x,
          y = _ref7.y;

        var shape = isPoly
          ? drawPolygonSvg({sides: sides, radius: radius})
          : drawCircleSvg({radius: radius});
        shape.setAttribute(
          "fill",
          overlapStroked ? "transparent" : masker,
        );
        shape.setAttribute("stroke", masker);
        shape.setAttribute("stroke-width", (100 / 1000) * size);
        shape.setAttribute("stroke-linejoin", "round");
        shape.setAttribute(
          "transform",
          "translate(" +
            (half - x) * size +
            "," +
            (half - y) * size +
            ") rotate(" +
            rotation +
            ")",
        );
        return shape;
      };

      if (drawLayer0) {
        var layer0Transform =
          "translate(" +
          half * size +
          "," +
          half * size +
          ") scale(1.2) rotate(" +
          layer0Rotation +
          ") translate(" +
          -half * size +
          "," +
          -half * size +
          ")";
        var layer0Use = dom.svg("use", {
          transform: layer0Transform,
          href: "#curves",
          mask: "url(#zeroMask)",
        });
        stage.appendChild(layer0Use);
        var layer0Shape = shapeItSvg({
          masker: maskColourHide,
          rotation: startAngle - layer0Rotation,
          x: 0,
          y: 0,
        });
        layer0Mask.appendChild(layer0Shape);
      }

      if (drawLayer1) {
        var layer1Shape = shapeItSvg({
          masker: maskColourShow,
          rotation: startAngle - layer1Rotation,
          x: layer1Offset.x,
          y: layer1Offset.y,
        });
        layer1Mask.appendChild(layer1Shape);
        var layer1Transform =
          "translate(" +
          half * size +
          "," +
          half * size +
          ")\n\t\t\t\t\tscale(1.2) rotate(" +
          layer1Rotation +
          ")\n\t\t\t\t\ttranslate(" +
          (-half + layer1Offset.x) * size +
          "," +
          (-half + layer1Offset.y) * size +
          ")";
        var layer1Use = dom.svg("use", {
          transform: layer1Transform,
          href: "#curves",
          mask: "url(#oneMask)",
        });
        stage.appendChild(layer1Use);
      }

      // end vector rendering
    } else {
      // else is bmp

      var drawPolygonBmp = function drawPolygonBmp(_ref8) {
        var canvas = _ref8.canvas,
          radius = _ref8.radius,
          sides = _ref8.sides;

        canvas.ctx.beginPath();
        canvas.ctx.lineJoin = "round";
        polyPath({radius: radius, sides: sides}).map(
          function (_ref9, j) {
            var x = _ref9.x,
              y = _ref9.y;

            if (j === 0) {
              canvas.ctx.moveTo(x, y);
            } else {
              canvas.ctx.lineTo(x, y);
            }
          },
        );
        canvas.ctx.closePath();
      };

      var drawCircleBmp = function drawCircleBmp(_ref10) {
        var canvas = _ref10.canvas,
          radius = _ref10.radius;
        return canvas.ctx.drawCircle(0, 0, radius * size);
      };

      var shapeItBmp = function shapeItBmp(
        canvas,
        masker,
        rotation,
      ) {
        canvas.ctx.save();
        canvas.ctx.translate(half * size, half * size);
        canvas.ctx.scale(1.2, 1.2);
        canvas.ctx.rotate((rotation / 180) * Math.PI);
        isPoly
          ? drawPolygonBmp({
              canvas: canvas,
              sides: sides,
              radius: radius,
            })
          : drawCircleBmp({canvas: canvas, radius: radius});
        canvas.ctx.fillStyle = overlapStroked
          ? "transparent"
          : masker == maskColourHide
            ? bgColour
            : masker;
        canvas.ctx.fill();
        canvas.ctx.strokeStyle = masker;
        canvas.ctx.lineWidth = (100 / 1000) * size;
        canvas.ctx.stroke();
        canvas.ctx.restore();
      };

      if (drawLayer0) {
        // do layer 0 bg
        layer0Bmp.ctx.save();
        layer0Bmp.ctx.translate(half * size, half * size);
        layer0Bmp.ctx.scale(1.2, 1.2);
        layer0Bmp.ctx.rotate((layer0Rotation / 180) * Math.PI);
        layer0Bmp.ctx.translate(
          -half * bmpSize,
          -half * bmpSize,
        );
        layer0Bmp.ctx.drawImage(layerCurves.canvas, 0, 0);
        layer0Bmp.ctx.restore();

        // layer 0 shape - temp is needed to mask out with stroke!
        var temp0 = dom.canvas(bmpSize);
        shapeItBmp(
          temp0,
          maskColourHide,
          startAngle - layer0Rotation,
        );
        layer0Bmp.ctx.globalCompositeOperation =
          "destination-out";
        layer0Bmp.ctx.drawImage(temp0.canvas, 0, 0);

        ctx.drawImage(layer0Bmp.canvas, 0, 0);
      }

      if (drawLayer1) {
        // do layer 1 bg
        layer1Bmp.ctx.save();
        layer1Bmp.ctx.translate(half * size, half * size);
        layer1Bmp.ctx.scale(1.2, 1.2);
        layer1Bmp.ctx.rotate((layer1Rotation / 180) * Math.PI);
        layer1Bmp.ctx.translate(
          -half * bmpSize,
          -half * bmpSize,
        );
        layer1Bmp.ctx.translate(
          layer1Offset.x * size,
          layer1Offset.y * size,
        );
        layer1Bmp.ctx.drawImage(layerCurves.canvas, 0, 0);
        layer1Bmp.ctx.restore();

        // layer 1 shape
        var temp1 = dom.canvas(bmpSize);
        shapeItBmp(
          temp1,
          maskColourShow,
          startAngle - layer0Rotation,
        );
        layer1Bmp.ctx.globalCompositeOperation =
          "destination-in";
        layer1Bmp.ctx.drawImage(temp1.canvas, 0, 0);

        ctx.drawImage(layer1Bmp.canvas, 0, 0);
      }

      // document.body.appendChild(layerCurves.canvas);
      // document.body.appendChild(layer0Bmp.canvas);
      // document.body.appendChild(layer1Bmp.canvas);

      // end bmp
    }

    progress("render:complete", isSvg ? stage : stage.canvas);
  };

  var update = function update(settings, seed) {
    return init({settings: settings, seed: seed});
  };

  return {
    init: init,
    settings: settings,
    stage: isSvg ? stage : stage.canvas,
    update: update,
  };
};

if (isNode) {
  module.exports = interpolated;
} else if (typeof define !== "undefined") {
  define("interpolated", function () {
    return interpolated;
  });
}
