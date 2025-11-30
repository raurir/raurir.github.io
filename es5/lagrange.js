"use strict";

// https://gist.github.com/maccesch/995144
// eslint-disable-next-line no-unused-vars
function lagrange(arr) {
  if (arr.length < 2) {
    throw new Error("need at least two points");
  }

  if (
    arr.every(function (_ref) {
      var x = _ref.x,
        y = _ref.y;

      return typeof x === "number" && typeof y === "number";
    }) === false
  ) {
    throw new Error("all points need to have a numeric x & y");
  }

  var points = arr.slice();

  // Recalculate barycentric weights.
  function calc() {
    var k = points.length;
    var w;

    for (var j = 0; j < k; ++j) {
      w = 1;
      for (var i = 0; i < k; ++i) {
        if (i != j) {
          w *= points[j].x - points[i].x;
        }
      }
      points[j].w = 1 / w;
    }
  }

  function addPoint(x, y) {
    points.push({x: x, y: y});
    calc();
    return points.length - 1;
  }

  function changePoint(index, x, y) {
    points[index] = {x: x, y: y};
    calc();
  }

  function valueOf(x) {
    var a = 0;
    var b = 0;
    var c = 0;

    for (var j = 0; j < points.length; ++j) {
      var point = points[j];
      if (x != point.x) {
        a = point.w / (x - point.x);
        b += a * point.y;
        c += a;
      } else {
        return point.y;
      }
    }

    return b / c;
  }

  calc();

  return {
    addPoint: addPoint,
    changePoint: changePoint,
    valueOf: valueOf,
  };
}

if (typeof module !== "undefined") module.exports = lagrange;
