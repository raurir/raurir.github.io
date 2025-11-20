"use strict";

var isNode = typeof module !== "undefined";

var r = rand.instance();
var c = colours.instance(r);

var overflow = function overflow() {
	var TAU = Math.PI * 2;
	var size, sw, sh;
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;

	var polys = [];
	function init(options) {
		r.setSeed(options.seed || Math.random());
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);

		c.getRandomPalette();

		createPolygon();
		createPolygon();
		createPolygon();

		polys.forEach(function (poly) {
			ctx.strokeStyle = "#ffffffa0";
			ctx.fillStyle = poly.colour + "40";
			ctx.beginPath();
			poly.points.forEach(function (_ref, i) {
				var x = _ref.x,
				    y = _ref.y;

				var xs = x * sw,
				    ys = y * sh;
				if (i) {
					ctx.lineTo(xs, ys);
				} else {
					ctx.moveTo(xs, ys);
				}
			});
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		});

		polys.forEach(function (poly) {
			ctx.strokeStyle = poly.colour;
			ctx.beginPath();
			poly.points.forEach(function (_ref2, i) {
				var x = _ref2.x,
				    y = _ref2.y;

				var xs = x * sw,
				    ys = y * sh;

				polys.forEach(function (otherPoly) {
					if (poly === otherPoly) {
						// ignore
					} else {
						var inside = geom.pointInPolygon(otherPoly.points, { x: x, y: y });
						if (inside) {
							ctx.fillStyle = "#ff000080";
							ctx.fillRect(xs - 10, ys - 10, 20, 20);
						}
					}
				});
			});
		});
	}

	function createPolygon() {
		var poly = {
			colour: c.getRandomColour(),
			points: []
		};

		var sides = r.getInteger(3, 17);
		var radius = r.getNumber(0.1, 0.4);
		var cx = r.getNumber(0, 1);
		var cy = r.getNumber(0, 1);
		for (var i = 0; i < sides; i++) {
			var angle = i / sides * TAU;
			var x = cx + Math.sin(angle) * radius;
			var y = cy + Math.cos(angle) * radius;
			poly.points.push({ x: x, y: y });
		}
		polys.push(poly);
	}

	var experiment = {
		stage: stage.canvas,
		init: init
	};

	progress("render:complete", stage.canvas);

	return experiment;
};
if (isNode) {
	module.exports = overflow();
} else {
	define("overflow", overflow);
}
