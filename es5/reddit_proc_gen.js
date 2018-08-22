"use strict";

var isNode = typeof module !== "undefined";

var reddit_proc_gen = function reddit_proc_gen() {
	var TAU = Math.PI * 2;
	var bmp = dom.canvas(1, 1);
	var ctx = bmp.ctx;

	var border = void 0;
	var cutHalf = void 0;
	var maxDepth = void 0;
	var minArea = void 0;
	var radius = void 0;
	var sh = void 0;
	var size = void 0;
	var sw = void 0;

	var settings = {
		spread: {
			type: "Number",
			label: "Spread", // TODO name
			min: 1,
			max: 10,
			cur: 10
		},
		maxDepth: {
			type: "Number",
			label: "Max Depth",
			min: 2,
			max: 8,
			cur: 2
		}
	};

	// been listening to GOTO80 for most of this: https://www.youtube.com/watch?v=2ZXlofdWtWw
	// followed by tranan + hux flux
	// next session: somfay

	// copied from recursive_polygon
	var drawPolygon = function drawPolygon(points, _ref) {
		var lineWidth = _ref.lineWidth,
		    strokeStyle = _ref.strokeStyle,
		    fillStyle = _ref.fillStyle;

		if (!points) {
			return; // con.warn("null array", points)
		}
		ctx.beginPath();
		// ctx.lineCap = "round";
		// ctx.lineJoin = "round";
		points.forEach(function (p, i) {
			ctx[i == 0 ? "moveTo" : "lineTo"](p.x * sw, p.y * sh);
		});
		ctx.closePath();
		if (lineWidth && strokeStyle) {
			ctx.strokeStyle = strokeStyle;
			ctx.lineWidth = lineWidth * size;
			ctx.stroke();
		}
		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	};

	var splitPolygon = function splitPolygon(array) {
		// pick two edges to slice into.
		// to do so we pick the corner of the start of the edge.
		var cornerAlpha = rand.getInteger(0, array.length - 1);
		var cornerBeta = (cornerAlpha + rand.getInteger(1, array.length - 1)) % array.length;

		var cornerMin = Math.min(cornerAlpha, cornerBeta);
		var cornerMax = Math.max(cornerAlpha, cornerBeta);

		// an edge is between point{K}0 - point{K}1
		var pointA0 = array[cornerMin];
		var pointA1 = array[(cornerMin + 1) % array.length];
		var pointB0 = array[cornerMax];
		var pointB1 = array[(cornerMax + 1) % array.length];

		// pick actual slice points somewhere along each edge
		// it is quite pleasant to slice the polygon half way along an edge
		// so going to bias towards that with `cutHalf`
		var pointA = geom.lerp(pointA0, pointA1, cutHalf ? 0.5 : rand.getNumber(0.1, 0.9));
		var pointB = geom.lerp(pointB0, pointB1, cutHalf ? 0.5 : rand.getNumber(0.1, 0.9));

		// min and max are confusing, but one poly starts from 0 which is arrayMin.
		var arrayMin = [];
		var arrayMax = [];

		// add first polygon - start from the first point of the parent
		var i = 0;
		// and navigate around the parent's perimeter
		while (i < array.length) {
			if (i <= cornerMin) {
				arrayMin.push(array[i]);
				//  until we hit the slice point
			} else if (i > cornerMin && i <= cornerMax) {
				// then add points of both ends of the slice
				arrayMin.push(pointA, pointB);
				// jump around to after the other end of the slice...
				i = cornerMax;
			} else {
				// and add the remaining points
				arrayMin.push(array[i]);
			}
			i++;
		}
		// add 2nd polygon, a bit easier...
		// start at point after the slice.
		i = cornerMin + 1;
		arrayMax.push(pointB, pointA);
		while (i < cornerMax + 1) {
			arrayMax.push(array[i]);
			i++;
		}

		return [arrayMin, arrayMax];
	};

	var getStyle = function getStyle() {
		var style = {};
		var colourMode = rand.getInteger(0, 8);
		switch (colourMode) {
			// very rare stroke
			case 0:
				style.lineWidth = 0.001;
				style.strokeStyle = colours.getRandomColour();
				break;
			// rare gradient
			case 1:
			case 2:
				var width = 0;
				var height = 0;
				// pick a gradient direction
				if (rand.getInteger(0, 1) === 0) {
					width = radius * 2; // horizontal
				} else {
					height = radius * 2; // vertical
				}
				var gradient = ctx.createLinearGradient(0.5 - radius, 0.5 - radius, width * sw, height * sh);
				gradient.addColorStop(0, colours.getRandomColour());
				gradient.addColorStop(1, colours.getRandomColour());
				style.fillStyle = gradient;
				break;
			// default to simple colour fill
			default:
				style.fillStyle = colours.getRandomColour();
		}

		return style;
	};

	var c = 0;
	var drawAndSplit = function drawAndSplit(points, depth) {
		// con.log("polygons", points)
		// split the shape
		var polygons = splitPolygon(points);

		// recurse
		depth++;
		polygons.forEach(function (poly) {
			if (depth < settings.maxDepth.cur && ( // always honour max recursions else we crash...
			minArea === 0 || geom.polygonArea(poly) > minArea) // only honour minArea if not zero!
			) {
					drawAndSplit(poly, depth);
				} else {
				var polyInset = geom.insetPoints(poly, border);

				if (!polyInset) return;

				// check if polygon is self intersecting, if so, discard it...
				// yup, this is O(n^2).

				var len = polyInset.length;
				for (var j = 0; j < len - 1; j++) {
					var indexA = j;
					var indexB = j + 1;
					var pointA = polyInset[indexA];
					var pointB = polyInset[indexB];

					// ctx.beginPath();
					// ctx.strokeStyle = "red";
					// ctx.lineWidth = 4;
					// ctx.moveTo(pointA.x, pointA.y);
					// ctx.lineTo(pointB.x, pointB.y);
					// ctx.stroke();

					for (var i = indexB; i < len; i++) {
						c++;
						var indexC = i;
						var indexD = (i + 1) % len;
						var pointC = polyInset[indexC];
						var pointD = polyInset[indexD];
						var intersects = geom.intersectionBetweenPoints(pointA, pointB, pointC, pointD);
						if (intersects) {
							// ctx.beginPath();
							// ctx.strokeStyle = "#0f0";
							// ctx.lineWidth = 2;
							// ctx.moveTo(pointC.x * sw, pointC.y * sh);
							// ctx.lineTo(pointD.x * sw, pointD.y * sh);
							// ctx.stroke();
							// con.log("fail - intersects", intersects, pointA, pointB, pointC, pointD)
							return;
						}
					}
				}

				drawPolygon(polyInset, getStyle());
			}
		});
	};

	var init = function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		colours.getRandomPalette();
		bmp.setSize(sw, sh);
		ctx.clearRect(0, 0, sw, sh);

		border = -rand.getNumber(0.002, 0.01);
		radius = rand.getNumber(0.3, 0.5);
		cutHalf = rand.getNumber(0, 1) > 0.2; // cutting in half is nice!
		minArea = rand.getInteger(0, 1) === 0 ? 0 // either 0, which means ignore minArea altogether
		: rand.getNumber(0.05, radius * 0.8); // or randomize it.
		maxDepth = rand.getInteger(2, 8);

		settings.spread.cur = rand.getInteger(0, 10);
		// settings.minArea.cur = minArea;
		settings.maxDepth.cur = maxDepth;
		if (options.settings) {
			settings = options.settings;
		}

		progress("settings:initialised", settings);

		// minArea = 0.3;
		// maxDepth = 8;
		con.log(minArea, maxDepth);

		var sides = rand.getInteger(3, 7);
		var startAngle = settings.spread.cur / 10 * 1 / sides * TAU;
		// const startAngle = rand.getNumber(0, 1);
		// const startAngle = 1 / 12 * TAU;
		var points = new Array(sides).fill().map(function (side, i) {
			var a = startAngle + i / sides * -TAU;
			var x = 0.5 + Math.sin(a) * radius; // * 0.6,
			var y = 0.5 + Math.cos(a) * radius;
			return { x: x, y: y };
		});

		// perf.start('polygon')
		// draw a border around shape
		drawPolygon(points, {
			strokeStyle: colours.getRandomColour(),
			lineWidth: 0.001
		});
		// inset the shape before recursion begins
		drawAndSplit(geom.insetPoints(points, border), 0);
		progress("render:complete", bmp.canvas);
		console.log("calculations", c);
		// perf.end('polygon')
	};

	var update = function update(settings) {
		con.log("update", settings);
		init({ size: size, settings: settings });
	};
	con.log('ok');

	return {
		stage: bmp.canvas,
		init: init,
		settings: settings,
		update: update
	};
};
if (isNode) {
	module.exports = reddit_proc_gen();
} else {
	define("reddit_proc_gen", reddit_proc_gen);
}
