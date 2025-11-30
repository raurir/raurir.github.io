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

var isNode = typeof module !== "undefined";
if (isNode) {
	var colours = require("./colours.js");
	var dom = require("./dom.js");
	var geom = require("./geom.js");
	var rand = require("./rand.js");
}

var splitPolygon = function splitPolygon(array, start, end) {
	var copy = array.slice();
	var chunk1 = copy.slice(0, start + 1);
	var chunk3 = copy.splice(end, array.length - end);
	var chunk2 = array.slice().splice(start, end - start + 1);
	var arrayA = chunk1.concat(chunk3);
	var arrayB = chunk2;
	return [arrayA, arrayB];
};

// copied from polygon_slice, see comments there.
var getRotationRange = function getRotationRange(sides) {
	var rotationRange = 90 - (180 * (sides - 2)) / sides || 45;
	return ((rotationRange * 3) / 180) * Math.PI;
};

var recursive_polygon = function recursive_polygon() {
	return function () {
		var r = rand.instance();
		var c = colours.instance(r);
		var progress;
		var size = 500;
		var sw = size;
		var sh = size;

		var settings = {
			// copied from polygon_slice
			rotation: {
				type: "Number",
				label: "Rotation",
				min: 0,
				max: 9,
				cur: 0,
			},
			background: {
				type: "Boolean",
				label: "Background",
				cur: true,
			},
			// maxDepth: {
			// 	type: "Number",
			// 	label: "Max Depth",
			// 	min: 2,
			// 	max: 8,
			// 	cur: 2
			// }
		};

		var bmp = dom.canvas(sw, sh);
		var ctx = bmp.ctx;

		var iterations;
		var backgroundColour;
		var insetDistance;
		var insetLocked;
		var insetLockedValue;
		var insetThreshold;
		var depthLocked;
		var maxDepth;
		var mutateAmount;
		var mutateThreshold;
		var sides;
		var splitEdgeRatioLocked;
		var splitLongest;
		var wonky;
		var isSierpinski;

		var generateParent = function generateParent() {
			var colour = c.getRandomColour();
			var i = 0;
			var angles = [];
			while (angles.length < sides) {
				angles.push((i / sides) * Math.PI * 2);
				i++;
			}
			// angles.sort();
			var points = angles.map(function (angle) {
				var radius = wonky ? r.getNumber(0.4, 0.45) : 0.45;
				var x = Math.sin(angle) * radius;
				var y = Math.cos(angle) * radius;
				return {x: x, y: y};
			});

			drawNext({points: points, colour: colour, depth: 0});
		};

		var drawNext = function drawNext(parent) {
			var depth = parent.depth + 1;
			if (depth > maxDepth) return;
			iterations++;
			if (iterations > 10000) return;
			var copied = parent.points.slice();
			var len = copied.length;
			var slicerStart = void 0,
				slicerEnd = void 0;
			if (len > 3) {
				var offset = r.getInteger(0, len);
				// shift array around offset
				var shifted = copied.splice(0, offset);
				copied = copied.concat(shifted);
				slicerStart = 0; // always slice from 0, no need to randomise this, array has been shifted around.
				slicerEnd = r.getInteger(2, len - 2);
			} else {
				// len is 3

				if (isSierpinski) {
					var half01 = geom.lerp(
						copied[0],
						copied[1],
						wonky ? r.getNumber(0.4, 0.6) : 0.5,
					);
					var half12 = geom.lerp(
						copied[1],
						copied[2],
						wonky ? r.getNumber(0.4, 0.6) : 0.5,
					);
					var half20 = geom.lerp(
						copied[2],
						copied[0],
						wonky ? r.getNumber(0.4, 0.6) : 0.5,
					);

					var centreTriangle = [half01, half12, half20];
					if (settings.background.cur) {
						drawPolygon(centreTriangle, {
							fillStyle: backgroundColour,
						});
					} else {
						bmp.ctx.globalCompositeOperation =
							"destination-out";
						drawPolygon(centreTriangle, {fillStyle: "black"});
						bmp.ctx.globalCompositeOperation = "source-over";
					}
					drawSplit(parent, [copied[0], half01, half20], depth);
					drawSplit(parent, [copied[1], half12, half01], depth);
					drawSplit(parent, [copied[2], half20, half12], depth);
				} else {
					var edge = splitLongest
						? getLongest(copied)
						: r.getInteger(0, 2); // pick which edge to split
					var splitRatio = splitEdgeRatioLocked
						? splitEdgeRatioLocked
						: r.getNumber(0.1, 0.9);
					var newPoint = void 0;
					switch (edge) {
						case 0:
							newPoint = geom.lerp(
								copied[0],
								copied[1],
								splitRatio,
							);
							copied.splice(1, 0, newPoint);
							slicerStart = 1;
							slicerEnd = 3;
							break;
						case 1:
							newPoint = geom.lerp(
								copied[1],
								copied[2],
								splitRatio,
							);
							copied.splice(2, 0, newPoint);
							slicerStart = 0;
							slicerEnd = 2;
							break;
						case 2:
							newPoint = geom.lerp(
								copied[2],
								copied[0],
								splitRatio,
							);
							copied.push(newPoint);
							slicerStart = 1;
							slicerEnd = 3;
					}
				}
			}

			if (!isSierpinski) {
				var _splitPolygon = splitPolygon(
						copied,
						slicerStart,
						slicerEnd,
					),
					_splitPolygon2 = _slicedToArray(_splitPolygon, 2),
					arrayA = _splitPolygon2[0],
					arrayB = _splitPolygon2[1];

				drawSplit(parent, arrayA, depth);
				drawSplit(parent, arrayB, depth);
			}
		};

		var drawSplit = function drawSplit(parent, points, depth) {
			var colour =
				mutateThreshold && r.random() < mutateThreshold
					? c.mutateColour(parent.colour, mutateAmount)
					: c.getRandomColour();
			var inset = insetLocked
				? insetLockedValue
				: r.random() > insetThreshold;

			drawPolygon(points, {
				fillStyle: colour,
				strokeStyle: colour,
				lineWidth: 0,
			});

			if (inset) {
				var insetPoints = geom.insetPoints(
					points,
					insetDistance,
				);
				if (insetPoints) {
					var inOrder = geom.polygonsSimilar(
						points,
						insetPoints,
					);
					if (inOrder) {
						if (settings.background.cur) {
							drawPolygon(insetPoints, {
								fillStyle: backgroundColour,
							});
						} else {
							ctx.globalCompositeOperation = "destination-out";
							drawPolygon(insetPoints, {fillStyle: "black"});
							ctx.globalCompositeOperation = "source-over";
						}
					}
				}
			}

			// shall we go deeper?
			if (depthLocked || r.random() > 0.2) {
				drawNext({
					points: points,
					colour: colour,
					depth: depth,
				});
			}
		};

		var fillAndStroke = function fillAndStroke(_ref) {
			var lineWidth = _ref.lineWidth,
				strokeStyle = _ref.strokeStyle,
				fillStyle = _ref.fillStyle;

			if (lineWidth && strokeStyle) {
				ctx.strokeStyle = strokeStyle;
				ctx.lineWidth = lineWidth;
				ctx.stroke();
			}
			if (fillStyle) {
				ctx.fillStyle = fillStyle;
				ctx.fill();
			}
		};

		var drawPolygon = function drawPolygon(points, options) {
			ctx.beginPath();
			points.forEach(function (_ref2, i) {
				var x = _ref2.x,
					y = _ref2.y;

				ctx[i == 0 ? "moveTo" : "lineTo"](x * size, y * size);
			});
			ctx.closePath();
			fillAndStroke(options);
			// points.forEach((p, i) => {
			// 	ctx.fillStyle = "#FFF";
			// 	ctx.font = '18px Helvetica';
			// 	ctx.fillText("p" + i, p.x, p.y);
			// });
		};

		var getLength = function getLength(a, b) {
			var dx = a.x - b.x,
				dy = a.y - b.y;
			return Math.hypot(dx, dy);
		};

		var getLongest = function getLongest(points) {
			var len = 0,
				edgeIndex = null;
			for (var i = 0, il = points.length; i < il; i++) {
				var p0 = points[i];
				var p1 = points[(i + 1) % il];
				var p0p1Len = getLength(p0, p1);
				if (p0p1Len > len) {
					len = p0p1Len;
					edgeIndex = i;
				}
			}
			return edgeIndex;
		};

		var init = function init(options) {
			iterations = 0;
			progress =
				options.progress ||
				function () {
					console.log(
						"recursive_polygon - no progress defined",
					);
				};
			size = options.size;
			sw = options.sw || size;
			sh = options.sh || size;
			r.setSeed(options.seed);
			c.getRandomPalette();
			bmp.setSize(sw, sh);

			settings.rotation.cur = r.getInteger(0, 9);
			settings.background.cur = r.getInteger(0, 4) > 3;
			if (options.settings) {
				settings = options.settings;
			}
			progress("settings:initialised", settings);

			// bias sides towards low polys.
			sides =
				3 +
				Math.round(r.random() * r.random() * r.random() * 28);
			if (sides === 3) {
				isSierpinski = r.random() > 0.8;
			}
			if (sides < 5) {
				wonky = r.random() > 0.8;
			}
			insetDistance = r.getNumber(0.001, 0.02);
			mutateThreshold = r.getInteger(0, 1) && r.getNumber(0, 1); // 0 or any number `between 0 and 1`, since `between 0 and 1` does not include 0!
			mutateAmount = r.getNumber(5, 30);
			maxDepth = r.getInteger(1, 8);
			depthLocked = r.getNumber(0, 1) > 0.5;
			splitLongest = r.random() > 0.5;
			splitEdgeRatioLocked = r.random() > 0.5 ? 0.5 : false;
			insetLocked = r.random() > 0.5;
			if (insetLocked) {
				insetLockedValue = r.random() > 0.5;
			} else {
				insetThreshold = r.random() * 0.5;
			}

			var startAngle =
				(settings.rotation.cur / settings.rotation.max) *
				getRotationRange(sides);

			backgroundColour = c.getRandomColour();
			if (settings.background.cur) {
				ctx.fillStyle = backgroundColour;
				ctx.fillRect(0, 0, sw, sh);
			} else {
				ctx.clearRect(0, 0, sw, sh);
			}
			ctx.save();
			ctx.translate(sw * 0.5, sh * 0.5);
			ctx.rotate(startAngle);
			generateParent();
			progress("render:complete", bmp.canvas);
			ctx.restore();
		};

		var update = function update(settings, seed) {
			init({
				progress: progress,
				seed: seed,
				size: size,
				settings: settings,
			});
		};

		return {
			init: init,
			settings: settings,
			stage: bmp.canvas,
			update: update,
		};
	};
};

if (isNode) {
	module.exports = recursive_polygon();
} else {
	define("recursive_polygon", recursive_polygon);
}
