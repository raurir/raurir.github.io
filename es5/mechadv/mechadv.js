"use strict";

/*global 
colourGrey,
drawBand,
drawBike,
drawCircle,
drawCutouts,
drawSeeds,
drawSpokes,
fxhash,
fxrand,
generateMetal,
integer,
makeCanvas,
number,
 */

var isLight = function isLight(v) {
	return v < 0.1;
};

var SPOKES = "SPOKES";
var MANDALA = "MANDALA";
var CIRCLES = "CIRCLES";
var BIKE = "BIKE";
// const allStyles = [SPOKES, MANDALA, CIRCLES, BIKE];
var allStyles = [BIKE];

var getVariants = function getVariants(v) {
	if (v < 0.6) return allStyles;
	if (v < 0.9) return allStyles.filter(function () {
		return number(0, 1) > 0.5;
	});
	return allStyles.splice(integer(0, allStyles.length - 1), 1);
};

window.$fxhashFeatures = {
	isLight: isLight(fxrand()),
	// isLight: true,
	isSpinning: fxrand() > 0.5,
	// isSpinning: false,
	isZooming: fxrand() > 0.5,
	// isZooming: false,
	variants: getVariants(fxrand()),
	speed: 0.01 + fxrand() * 0.03 // used to be const 0.02;
};

var pi = Math.PI;
var pi2 = pi * 2;

// eslint-disable-next-line no-unused-vars
function mechadv() {
	var stage = makeCanvas(1, 1);
	var context = stage.getContext("2d");

	function init(_ref) {
		var stageSize = _ref.size;

		var sw = stageSize;
		var sh = stageSize;
		stage.width = sw;
		stage.height = sh;

		var _window$$fxhashFeatur = window.$fxhashFeatures,
		    isLight = _window$$fxhashFeatur.isLight,
		    isSpinning = _window$$fxhashFeatur.isSpinning,
		    isZooming = _window$$fxhashFeatur.isZooming,
		    speed = _window$$fxhashFeatur.speed,
		    variants = _window$$fxhashFeatur.variants;

		console.log("$fxhashFeatures", window.$fxhashFeatures);
		if (isLight) {
			document.body.style.background = "#fff";
		}

		var speedMod = 1;
		var speedModTarget = 1;
		var padding = 5; // canvas padding for cogs so the bitmap doesn't get cut off the cog canvas
		var cogs = [];
		var dir = 1;
		var cx = 0.5 * sw;
		var cy = 0.5 * sh;
		var magic = 0;

		var cogNumber = 0;

		var curvature = 1.6; //1.7;

		function createCog(cogIndex, forceX, forceY) {
			var forceSize = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
			var preventOverlap = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

			var cogCanvas;
			var ctx;
			var size;
			var cogDirection;
			var ang;

			// console.log("createCog", cogIndex);

			var prevCog = cogs[cogIndex];
			if (forceX && forceY && prevCog) {
				var dy = forceY - prevCog.yp;
				var dx = forceX - prevCog.xp;
				ang = Math.atan(dy / dx);
				ang += dx < 0 ? pi : 0;
				dx = Math.abs(dx) - Math.abs(prevCog.size);
				dy = Math.abs(dy) - Math.abs(prevCog.size);
				size = forceSize || Math.sqrt(dx * dx + dy * dy);
			} else {
				ang = number(0, pi2);
				size = forceSize || number(60, 300); // was 80 for +
			}

			var teeth = ~~(size / 10);

			if (teeth < 5) {
				// cogs with 4 teeth look shite.
				return;
			}

			var thisCX = prevCog && prevCog.cx || cx;
			var thisCY = prevCog && prevCog.cy || cy;

			// console.log(prevCog && prevCog.cx, prevCog && prevCog.cy);

			if (prevCog) {
				cogDirection = prevCog.cogDirection * -1;
				var wtf = prevCog.wtf;

				// magic += size - 10;
				wtf += size - 10;
				thisCX += wtf * Math.cos(ang);
				cx = thisCX;
				thisCY += wtf * Math.sin(ang);
				cy = thisCY;
			} else {
				cogDirection = dir;
			}
			magic = size - 10;

			var minRad = size - 22;
			var maxRad = size + 0;
			var verts = [];
			var step = pi2 / (teeth * 4);
			var mod = 0;
			var oddEven = 0;
			var halfRadius = (maxRad - minRad) / curvature + minRad;
			for (var j = 0; j < teeth * 4; j++) {
				var i = j * step;
				var topBottomLand = ~~mod % 2;
				var r = topBottomLand * (maxRad - minRad) + minRad;
				mod += 0.5;
				oddEven += 1;
				var angle = i - step / 2; // offsets teeth a bit, making sure at angle 0, we are in the middle of a "bottom land" rather than "top land"
				var realX = r * Math.cos(angle);
				var realY = r * Math.sin(angle);
				var v = void 0;
				if (oddEven % 2 == 0) {
					v = { tb: topBottomLand, ex: realX, ey: realY };
				} else {
					var halfX = halfRadius * Math.cos(i - step);
					var halfY = halfRadius * Math.sin(i - step);
					v = {
						tb: topBottomLand,
						mp: true, // middle point
						ex: realX,
						ey: realY,
						mx: halfX,
						my: halfY
					};
				}
				verts.push(v);
				// console.log("coords", i, v.ex, v.ey, v.mx, v.my );
			}
			// console.log("=====================");

			var xp = thisCX;
			var yp = thisCY;
			var rotation = number(0, pi2);

			if (prevCog) {
				// prevCog = cogs[cogNumber - 1];
				rotation = prevCog.teeth / teeth * -prevCog.rotation + ang * (prevCog.teeth + teeth) / teeth;
				if (teeth % 2 == 0) {
					rotation += pi2 / (teeth * 2);
				}
			}

			var cog = { cogDirection: cogDirection, spin: dir, wtf: magic, cx: thisCX, cy: thisCY, size: size, rotation: rotation, teeth: teeth, xp: xp, yp: yp };

			// console.log(angle, radius);

			if (preventOverlap) {
				// check any cogs are overlapping.
				for (var k = 0; k < cogs.length; k++) {
					var otherCog = cogs[k];
					if (otherCog == prevCog) {
						// previous cog SHOULD be close!
						continue;
					}
					var _dx = xp - otherCog.xp;
					var _dy = yp - otherCog.yp;
					var d = Math.sqrt(_dx * _dx + _dy * _dy);

					// context.strokeStyle = "red";
					// context.lineWidth = 4;
					// context.beginPath();
					// context.moveTo(xp, yp);
					// context.lineTo(otherCog.xp, otherCog.yp);
					// context.closePath();
					// context.stroke();

					if (d < size + otherCog.size) {
						// console.log("too close!");
						return;
					}
				}
			}

			// context.strokeStyle = "green";
			// context.lineWidth = 4;
			// context.beginPath();
			// context.moveTo(forceX, forceY);
			// context.lineTo(xp, yp);
			// context.stroke();

			var render = function render() {
				var dims = (size + padding) * 2;
				var axleSize = minRad * 0.2;

				var cutoutStyle = variants[integer(0, variants.length - 1)];

				cogCanvas = makeCanvas(dims, dims);
				//	document.body.appendChild( cogCanvas );
				ctx = cogCanvas.getContext("2d");

				ctx.save();
				ctx.translate(size + padding, size + padding);

				// draw teeth
				ctx.fillStyle = colourGrey({ darkest: 20, lightest: 70 });
				ctx.beginPath();
				var v = verts[0];
				ctx.moveTo(v.ex, v.ey);
				for (var i = 1; i < verts.length; i++) {
					v = verts[i];
					if (v.mp) {
						ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey);
					} else {
						ctx.lineTo(v.ex, v.ey);
					}
				}
				v = verts[0];
				ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey);
				ctx.closePath();
				ctx.fill();

				// ctx.strokeStyle = "black";
				// ctx.shadowBlur = 8;
				// ctx.shadowColor = "#000";

				// ctx.fillRect(-200, -200, 400, 400);

				// draw main circle
				drawCircle(ctx, 0, 0, minRad, { fillStyle: colourGrey({ lightest: 20 }) });

				if (number(0, 1) > 0.5) {
					// paint with dotty metal
					var metal = generateMetal(300, 300);
					var pattern = ctx.createPattern(metal, "repeat");
					ctx.fillStyle = pattern;
					ctx.fill();
				}

				if (number(0, 1) > 0.5) {
					// draw some lathe marks
					var latheScratches = integer(12, size / 5);
					if (latheScratches > 40) latheScratches = 40;
					for (var l = 0; l < latheScratches; l++) {
						drawCircle(ctx, 0, 0, number(axleSize, minRad), {
							fillStyle: null,
							lineWidth: 1,
							strokeStyle: colourGrey({ darkest: 1, lightest: 200, alpha: number(0.01, 0.1) })
						});
					}
				}

				// draw some cutouts
				switch (cutoutStyle) {
					case BIKE:
						ctx.globalCompositeOperation = "destination-out";
						drawBike(ctx, axleSize, minRad);
						break;

					case MANDALA:
						ctx.globalCompositeOperation = "destination-out";
						drawSeeds(ctx, axleSize, minRad);
						break;

					case SPOKES:
						// eslint-disable-next-line no-case-declarations
						var outerRadius = minRad * number(0.8, 0.9);
						// eslint-disable-next-line no-case-declarations
						var innerRadius = number(axleSize, minRad / 2);
						ctx.globalCompositeOperation = "destination-out";
						drawCircle(ctx, 0, 0, outerRadius - 5, { fillStyle: "green" });
						ctx.globalCompositeOperation = "source-over";
						ctx.fillStyle = colourGrey({ lightest: 70 });
						drawSpokes(ctx, teeth, innerRadius, outerRadius);
						// draw a circular cap to cover loose ends.
						drawCircle(ctx, 0, 0, innerRadius + 5, { fillStyle: colourGrey() });
						break;

					case CIRCLES:
						ctx.globalCompositeOperation = "destination-out";
						drawCutouts(ctx, teeth, axleSize + minRad * 0.1, minRad * 0.9);
						break;
				}

				// if (number(0, 1) > 0.5) {
				// 	// maybe draw centre
				// 	drawCircle(ctx, 0, 0, minRad * 0.16);
				// }

				// draw some bands

				// ctx.globalCompositeOperation = "source-atop";
				ctx.globalCompositeOperation = "source-over";
				// draw inner band
				// if (number(0, 1) > 0.9) {
				drawBand(ctx, axleSize, axleSize + minRad * number(0.02, 0.2));
				// }
				var outerBand = number(0, 1) > 0.8;
				var outerBandMin = void 0;
				if (outerBand) {
					outerBandMin = minRad * number(0.8, 0.98);
					drawBand(ctx, outerBandMin, minRad);
				}

				if (outerBand && number(0, 1) > 0.8) {
					// draw label
					var distance = outerBandMin + (minRad - outerBandMin) / 2;
					ctx.font = "15px Courier";
					ctx.fillStyle = colourGrey({ darkest: 0, lightest: 100 });
					fxhash.split("").forEach(function (chr, chrIndex) {
						var angle = chrIndex * Math.asin(12 / distance);
						ctx.save();
						ctx.rotate(-angle);
						ctx.translate(0, distance + 4);
						ctx.fillText(chr, 0, 0);
						ctx.restore();
					});
				}

				// draw axle
				ctx.globalCompositeOperation = "source-over";
				// drawCircle(ctx, 0, 0, axleSize, {fillStyle: "red"});
				// drawCircle(ctx, 0, 0, axleSize, {fillStyle: "#fff"});
				// drawCircle(ctx, 0, 0, axleSize, {fillStyle: colourGrey({lightest: 50})});
				drawCircle(ctx, 0, 0, axleSize, { fillStyle: isLight ? "#fff" : "#000" });
			};

			var draw = function draw() {
				// return;
				// context.globalAlpha = 0.5;
				if (!cogCanvas) {
					render();
				}
				context.save();
				context.translate(xp, yp);
				context.rotate(rotation);
				context.drawImage(cogCanvas, -size - padding, -size - padding);
				context.restore();
			};

			cog.rotate = function () {
				rotation += pi2 / teeth * cogDirection * speed * speedMod;
				draw();
			};

			cogs[cogNumber] = cog;
			cogNumber++;
			return cog;
		}

		// stripy background removed from original

		// eslint-disable-next-line no-unused-vars
		var spin = 0;
		var spinRate = number(-1, 1) * -0.005;
		var zoom = -pi / 2; // to ensure it starts at 1, since Math.sin(-pi/2) = -1
		function onLoop() {
			requestAnimationFrame(onLoop);

			context.fillStyle = isLight ? "#fff" : "#000";
			context.fillRect(0, 0, sw, sh);

			context.save();
			var scale = Math.sin(zoom) + (isZooming ? 1.7 : 2); // range is from -1 -> -1 + offset
			context.translate(sw * 0.5, sh * 0.5);
			context.scale(scale, scale);
			context.translate(0, 0);
			context.rotate(spin * spinRate);
			context.translate(-sw / 2, -sh / 2);

			cogs.forEach(function (cog) {
				return cog.rotate();
			});
			context.restore();

			spin += Number(isSpinning);
			zoom += isZooming ? 0.002 : 0;

			speedMod -= (speedMod - speedModTarget) * 0.04;
			// console.log(speedMod, speedModTarget);
		}

		var n = null; // first node
		/*
  const grid = () => {
  	const d = 150;
  	const size = 85;
  	const sx = sw * 0.5;
  	const sy = sh * 0.5;
  	createCog(n, sx, sy, size);
  	for (var i = 0; i < 37; i++) {
  		const xi = Math.floor((i + 1) / 2);
  		const yi = Math.ceil((i + 0.5) / 2) % 2;
  		createCog(i, sx + d * xi, sy + d * yi, size);
  	}
  };
  */

		var grid = function grid(_ref2) {
			var d = _ref2.d,
			    size = _ref2.size,
			    min = _ref2.min,
			    total = _ref2.total,
			    larger = _ref2.larger;

			var max = stageSize - min;
			cx = min + d;
			cy = min + d;
			createCog(n, cx, cy, size * larger);
			var dir = 1;
			for (var i = 0; i < total - 1; i++) {
				cx += d * dir;
				if (cx > max) {
					cy += d;
					cx -= d;
					dir *= -1;
				} else if (cx < min + size * 1) {
					cy += d;
					cx += d;
					dir *= -1;
				}
				var forceSize = larger == 1 ? size // larger = 1: all are the same size
				: size * (((i + 1) % 2 == 1) + 1) * larger; // larger != 1: every second is different size
				createCog(i, cx, cy, forceSize);
			}
		};

		var gridFixed = function gridFixed() {
			return grid({ d: 150, size: 190, min: 100, total: 11 * 11, larger: 1 });
		};
		var gridAlternate = function gridAlternate() {
			return grid({ d: 150, size: 40, min: 300, total: 8 * 8, larger: 4 });
		};

		var spiral = function spiral() {
			var size = number(100, 300); // 180

			var angleDir = integer(0, 1) * 2 - 1;
			var angleStart = number(0, pi2); // 0
			var angleBase = number(0.03, 0.04); // 0.07
			var angleExponent = 1.2; //number(1, 2); // 1.5

			var radiusStart = 100; // number(50, 200) * pi2; // 120
			var radiusBase = size * number(1, 2); // 60
			var radiusExponent = number(1, 2); // 1.5

			// console.log({angleStart, angleBase, angleExponent, radiusStart, radiusBase, radiusExponent});
			for (var i = 0; i < 15; i++) {
				var angle = angleStart + angleDir * Math.pow(i * angleBase, angleExponent) * pi2;
				var radius = radiusStart + Math.pow(i * radiusBase, radiusExponent);
				var x1 = sw * 0.5 + Math.sin(angle) * radius;
				var y1 = sh * 0.5 + Math.cos(angle) * radius;
				var x2 = sw * 0.5 + Math.sin(angle + pi) * radius;
				var y2 = sh * 0.5 + Math.cos(angle + pi) * radius;

				context.fillStyle = "green";
				context.fillRect(x1 - 5, y1 - 5, 10, 10);
				context.fillRect(x2 - 5, y2 - 5, 10, 10);

				if (i == 1) {
					createCog(0, x1, y1, size, true);
					createCog(0, x2, y2, size, true);
				} else if (i > 1) {
					createCog(2 * i - 3, x1, y1, size, true);
					createCog(2 * i - 2, x2, y2, size, true);
				} else {
					createCog(n, x1, y1, size);
				}
			}
		};

		var plus = function plus() {
			var d = 750;
			var depth = 8;

			var sizes = Array(depth).fill().map(function () {
				return number(100, 500);
			});

			var directions = [{ x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }];
			createCog(n, sw * 0.5, sh * 0.5, 500); // 0

			directions.forEach(function (_ref3, dirIndex) {
				var x = _ref3.x,
				    y = _ref3.y;

				for (var i = 0; i < depth; i++) {
					var xo = sw * 0.5 + x * (i + 1) * d;
					var yo = sh * 0.5 + y * (i + 1) * d;
					var driverIndex = i == 0 ? i : i + dirIndex * depth;
					createCog(driverIndex, xo, yo, sizes[i]);
				}
			});
		};

		var randomDistribution = function randomDistribution(symmetry) {
			return function () {
				var attempts = 0;
				createCog(n, cx, cy, number(50, sw / 2));
				var driverIndex = 0;
				while (attempts < 4000) {
					var xo = number(0, sw);
					var yo = number(0, sh);
					var success = createCog(driverIndex, xo, yo, undefined, true);
					if (success) {
						if (symmetry) {
							// if symmetrical, try and connect every second cog with it's driver.
							createCog(cogs.length > 2 ? driverIndex - 1 : 0, sw - xo, sh - yo, undefined, true);
							driverIndex++;
						}
						driverIndex++;
					}
					attempts++;
				}
			};
		};

		var randomSymmetrical = randomDistribution(true);
		var randomNonsensical = randomDistribution(false);

		var funcs = [gridFixed, gridAlternate, randomSymmetrical, randomNonsensical, spiral, plus];
		funcs[integer(0, funcs.length - 1)]();
		// createCog(n, cx, cy, stageSize / 2 - 10);
		// plus();
		// gridAlternate();
		// gridFixed();
		// spiral();
		// randomSymmetrical();
		// randomNonsensical();
		onLoop();
		document.body.addEventListener("click", function (e) {
			var direction = Math.floor(Math.random() * 2) * 2 - 1;
			var yRatio = e.clientY / window.innerHeight;
			speedModTarget = speed + Math.random() * yRatio * 10 * direction;
			// console.log(speedModTarget);
		});
	}

	return { init: init, stage: stage };
}
