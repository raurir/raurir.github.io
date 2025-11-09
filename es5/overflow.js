"use strict";

var isNode = typeof module !== "undefined";

var r = rand.instance();
r.setSeed(Math.random());
var c = colours.instance(r);

var overflow = function overflow() {
	var TAU = Math.PI * 2;
	var size, sw, sh;
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;

	var polys = [];
	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);

		c.getRandomPalette();

		createPolygon();
		createPolygon();
		polys.forEach(function (poly) {
			ctx.strokeStyle = poly.colour;
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
				// con.log(xs, ys);
			});
			ctx.closePath();
			ctx.stroke();
			// ctx.fill();
		});
	}

	function createPolygon() {
		var poly = {
			colour: c.getRandomColour(),
			points: []
		};
		// geom.pointInPolygon(polygon, point)
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
