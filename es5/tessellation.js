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

/* eslint-disable no-console */
/* eslint-disable indent */
var isNode = typeof module !== "undefined";

if (isNode) {
}
// var rand = require("./rand.js");
// var dom = require("./dom.js");
// var colours = require("./colours.js");
// var geom = require("./geom.js");

// prettier-ignore
var SHAPE_L = { "0": { "blocks": [[1, 1], [0, 1]],
		"points": [{ "x": 0,
			y: 0 }, { "x": 2, y: 0 }, { "x": 2, "y": 2 }, { "x": 1,
			"y": 2 }, {
			"x": 1, y: 1 }, { "x": 0, "y": 1

		}] }, "1": { blocks: [[0, 1], [1, 1]],
		"points": [{ "x": 1, "y": 0 }, { "x": 2, "y": 0 }, { x: 2, "y": 2 }, { "x": 0,
			"y": 2 }, { "x": 0, y: 1 }, { "x": 1, "y": 1

		}] }, "2": { blocks: [[1, 0], [1, 1]],
		"points": [{ "x": 0, "y": 0 }, { "x": 1, "y": 0 }, { x: 1, "y": 1 }, { "x": 2,
			"y": 1 }, { "x": 2, y: 2 }, { "x": 0, y: 2 }]

	}, "3": { "blocks": [[1, 1], [1, 0]],
		"points": [{ "x": 0,
			"y": 0 }, { "x": 2, y: 0 }, { "x": 2, "y": 1
		}, { "x": 1,
			"y": 1 }, { x: 1, y: 2 }, { x: 0,
			y: 2 }] } };

/*

^ homage to @aemkei

indeed 'points' are no longer needed but the original idea with dotLine and hashPolygon (removed)
needed to draw around the perimeter

*/

var tessellation = function tessellation() {
	return function () {
		var r = rand.instance();
		var c = colours.instance(r);

		var bmp = dom.canvas(1, 1);
		var ctx = bmp.ctx;
		var backgroundColour = "#000";

		var progress = void 0;
		var sh = void 0;
		var sw = void 0;
		var size = void 0;

		var attempt = 0;
		var maxAttempts = 1e5;

		var blocks = void 0;
		var block = void 0;

		var occupied = void 0;
		var spots = [];
		var spotId = 1;

		var settings = {};

		var dotLine = function dotLine(ctx, _ref, _ref2) {
			var _ref3 = _slicedToArray(_ref, 2),
				a = _ref3[0],
				b = _ref3[1];

			var fillStyle = _ref2.fillStyle;

			var dx = a.x - b.x;
			var dy = a.y - b.y;
			var jumps = Math.ceil(Math.hypot(dx, dy) / 0.35);
			ctx.fillStyle = fillStyle;
			for (var i = 0; i < jumps; i++) {
				var _geom$lerp = geom.lerp(a, b, i / jumps),
					x = _geom$lerp.x,
					y = _geom$lerp.y;

				ctx.fillRect(
					Math.floor(x * block * sw - 2),
					Math.floor(y * block * sw - 2),
					4,
					4,
				);
			}
		};

		var isBusy = function isBusy(nextOccupied, x, y) {
			if (x < 0) return 0;
			if (x > blocks - 1) return 0;
			if (y < 0) return 0;
			if (y > blocks - 1) return 0;
			var index = y * blocks + x;
			return nextOccupied[index];
		};

		var testNeighbours = function testNeighbours(nextOccupied) {
			return nextOccupied.some(
				function (occupied, positionIndex) {
					var x = positionIndex % blocks;
					var y = Math.floor(positionIndex / blocks);

					if (occupied === 0) {
						// this block is empty
						var top = isBusy(nextOccupied, x, y - 1);
						var topRight = isBusy(nextOccupied, x + 1, y - 1);
						var right = isBusy(nextOccupied, x + 1, y);
						var bottomRight = isBusy(
							nextOccupied,
							x + 1,
							y + 1,
						);
						var bottom = isBusy(nextOccupied, x, y + 1);
						var bottomLeft = isBusy(nextOccupied, x - 1, y + 1);
						var left = isBusy(nextOccupied, x - 1, y);

						var isSingleBlock = left && right && top && bottom;
						if (isSingleBlock) {
							return true;
						}
						// check horizontal 2 blocks
						var isHorizontalDouble =
							top && topRight && bottomRight && bottom;
						if (isHorizontalDouble) {
							return true;
						}
						// check vertical 2 blocks
						var isVerticalDouble =
							right && bottomRight && bottomLeft && left;
						if (isVerticalDouble) {
							return true;
						}
					}
					return false;
				},
			);
		};

		var getBlocks = function getBlocks(shapeBlocks, position) {
			var blocks = []; // shapeBlocks.reduce blah blah
			for (var i = 0; i < shapeBlocks.length; i++) {
				var row = shapeBlocks[i];
				for (var j = 0; j < row.length; j++) {
					if (row[j] === 1) {
						var x = position.x + j;
						var y = position.y + i;
						blocks.push({x: x, y: y});
					}
				}
			}
			return blocks;
		};

		var testPolygon = function testPolygon(
			shapeBlocks,
			position,
		) {
			var test = occupied.slice();
			for (var i = 0; i < 2; i++) {
				for (var j = 0; j < 2; j++) {
					var x = position.x + j;
					var y = position.y + i;

					if (x < 0) continue;
					if (x > blocks - 1) continue;
					if (y < 0) continue;
					if (y > blocks - 1) continue;

					var col = shapeBlocks[i][j];
					if (col === 0) continue;

					var blockIndex = y * blocks + x;
					if (test[blockIndex] > 0) {
						return false;
					}
					test[blockIndex] = spotId;
				}
			}

			var problem = testNeighbours(test);
			if (problem) {
				return false;
			}

			occupied = test;
			return true;
		};

		var drawPolygon = function drawPolygon(points, _ref4) {
			var lineWidth = _ref4.lineWidth,
				strokeStyle = _ref4.strokeStyle,
				fillStyle = _ref4.fillStyle;

			var polygon = dom.canvas(2 * block * sw, 2 * block * sw);
			// document.body.appendChild(polygon.canvas);
			polygon.ctx.beginPath();
			points.forEach(function (_ref5, i) {
				var x = _ref5.x,
					y = _ref5.y;

				polygon.ctx[i == 0 ? "moveTo" : "lineTo"](
					x * block * sw,
					y * block * sh,
				);
			});
			polygon.ctx.closePath();

			var gradient = polygon.ctx.createLinearGradient(
				0,
				0,
				r.getNumber(block, 2 * block),
				r.getNumber(block, 2 * block),
			);
			gradient.addColorStop(0, fillStyle);
			gradient.addColorStop(1, c.mutateColour(fillStyle, 20));

			polygon.ctx.fillStyle = gradient;
			polygon.ctx.fill();

			polygon.ctx.strokeStyle = strokeStyle;
			polygon.ctx.lineWidth = lineWidth;
			polygon.ctx.stroke();

			// const len = points.length;
			// const dotFillStyle = `rgba(0,0,0,${r.getInteger(50, 255)}`;
			// for (var i = 0; i < len; i++) {
			//   dotLine(polygon.ctx, [points[i], points[(i + 1) % len]], {fillStyle: dotFillStyle});
			// }

			return polygon;
		};

		var drawShape = function drawShape(rotation, position) {
			var shape = SHAPE_L[rotation];

			var ok = testPolygon(shape.blocks, position);
			if (!ok) {
				// drawPolygon(shape.points, {fillStyle: "#f0f"});
				// console.log("failing");
				return false;
			}

			var polygon = drawPolygon(shape.points, {
				fillStyle: c.getNextColour(),
				// fillStyle: c.getRandomColour(),
				lineWidth: 0.1,
				strokeStyle: "#000",
			});

			var x = (position.x / blocks) * sw;
			var y = (position.y / blocks) * sh;

			ctx.save();
			ctx.translate(x - sw / 2, y - sh / 2);
			ctx.drawImage(polygon.canvas, 0, 0);
			ctx.restore();

			// center point
			// ctx.fillStyle = "white";
			// ctx.fillRect(0 - 10, 0 - 10, 20, 20);

			var sp = getBlocks(shape.blocks, position);
			spots.push({id: spotId, blocks: sp});
			spotId++;

			// !! invalid due to restore() above.
			// draw ids of each spot
			// ctx.font = "12px Helvetica";
			// ctx.fillStyle = "white";
			// sp.forEach(({x, y}) => {
			//   ctx.fillText(spotId, ((x + 0.4) / blocks) * sw, ((y - 1) / blocks) * sw + 40);
			// });

			return true;
		};

		var complete = false;

		var getPosFromRadial = function getPosFromRadial(
			ratioComplete,
		) {
			var p = ratioComplete * 50;
			var diagonal = Math.ceil(
				Math.hypot(blocks / 2, blocks / 2),
			); // + 2);
			var r = p * blocks * 0.04;

			if (r > diagonal) {
				complete = true;
			}

			var a = (p / (1 + r * -0)) * 20;
			var x = Math.floor(blocks / 2 + Math.sin(a) * r);
			var y = Math.floor(blocks / 2 + Math.cos(a) * r);

			// const r = p * 0.5;
			// const a = (z / 180) * Math.PI * 137.5;

			return {x: x, y: y};
		};

		var jitter = function jitter(rot, pos) {
			var go = true;
			for (var x = -1; x < 2 && go; x++) {
				for (var y = -1; y < 2 && go; y++) {
					for (var r = 0; r < 4 && go; r++) {
						go = !drawShape((rot + r) % 4, {
							x: pos.x + x,
							y: pos.y + y,
						});
					}
				}
			}
		};

		var drawSet = function drawSet() {
			// console.log("drawSet");
			attempt++;
			var ratioComplete = attempt / maxAttempts;
			var occComplete =
				occupied.filter(function (b) {
					return b > 0;
				}).length /
					occupied.length ===
				1;

			if (complete || occComplete) {
				console.log("complete");
				return;
			}
			if (ratioComplete >= 1) {
				// does it happen? hmmm, stop recursion
				return;
			}

			var pos = getPosFromRadial(ratioComplete);
			var rot = r.getInteger(0, 3);
			jitter(rot, pos);

			// const {x, y} = pos;
			// ctx.fillStyle = "red";
			// ctx.fillRect((x / blocks) * sw, (y / blocks) * sw, 4, 4);
			// progress("render:complete", bmp.canvas);

			if (attempt % 100 === 0) {
				// progress("render:progress", ratioComplete);
				setTimeout(function () {
					return drawSet();
				}, 10);
				// console.log(occupied);
			} else {
				drawSet();
			}
		};

		var init = function init(options) {
			progress =
				options.progress ||
				function () {
					console.log("tessellation - no progress defined");
				};
			r.setSeed(options.seed);
			size = options.size;
			sw = options.sw || size;
			sh = options.sh || size;
			bmp.setSize(sw, sh);

			c.getRandomPalette();

			var ranges = [];
			for (var i = 8; i < size / 8; i++) {
				var d = size / i;
				if (Math.round(d) === d) {
					ranges.push(d);
				}
			}
			// console.log(ranges);

			blocks = ranges[r.getInteger(0, ranges.length - 1)];
			block = 1 / blocks;

			// console.log(blocks, block);

			occupied = new Array(blocks * blocks).fill(0);

			progress("settings:initialised", settings);

			ctx.fillStyle = backgroundColour;
			ctx.fillRect(0, 0, sw, sh);
			ctx.translate(sw / 2, sh / 2); // compensated for in drawImage
			ctx.rotate(r.getNumber(0, Math.PI * 2));
			var scale = r.getNumber(1.3, 1.6);
			ctx.scale(scale, scale);

			drawSet();
		};

		var update = function update(settings, seed) {
			console.log("update", settings);
			init({
				progress: progress,
				seed: seed,
				size: size,
				settings: settings,
			});
		};

		return {
			stage: bmp.canvas,
			init: init,
			settings: settings,
			update: update,
		};
	};
};
if (isNode) {
	module.exports = tessellation();
} else {
	define("tessellation", tessellation);
}
