"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var isNode = typeof module !== "undefined";

if (isNode) {
	// eslint-disable-next-line no-redeclare
	var rand = require("./rand.js");
	// eslint-disable-next-line no-redeclare
	var dom = require("./dom.js");
	// eslint-disable-next-line no-redeclare
	var colours = require("./colours.js");
}

// eslint-disable-next-line no-unused-vars
// const log = (...args) => console.info(...args);
var log = function log() {};

var aristotle = function aristotle() {
	var isSvg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

	var r = rand.instance();
	var c = colours.instance(r);
	var stage = isSvg ? dom.svg("svg", { width: 1, height: 1 }) : dom.canvas(1, 1);
	var inner = isSvg && dom.svg("g");
	var defs = isSvg && dom.svg("defs");
	var angle60 = Math.PI * 2 / 3;

	var initialSettings = {
		time: {
			type: "Number",
			label: "Time",
			min: 0,
			max: 20,
			cur: 10
		},
		edge: {
			type: "Boolean",
			label: "Fill Screen",
			cur: true
		},
		background: {
			type: "Boolean",
			label: "Background",
			cur: false
		}
	};
	var settings = initialSettings;

	var generationRequired = true;
	var gradientSets = [];
	var lastSeed = void 0;
	var progress = function progress() {};
	var shapes = [];
	var size = void 0;

	var init = function init(options) {
		var seed = options.seed;


		var targets = [];

		if (lastSeed != seed) {
			shapes = [];
			generationRequired = true;
			gradientSets = [];
		}
		lastSeed = seed;

		if (options.progress) {
			progress = options.progress;
		}
		if (options.size) {
			size = options.size;
		}
		settings = JSON.parse(JSON.stringify(options.settings || initialSettings));

		// log("settings", settings.background);

		progress("settings:initialised", settings);

		var backgrounds = [];

		r.setSeed(seed);

		var backgroundColor = void 0;

		var half = size / 2;
		var baseRotation = r.getNumber(0, 1);
		var triggerLimit = r.getNumber(0.01, 0.5);
		var radiusOuter = r.getNumber(0.03, 0.1);
		var outOfBounds = radiusOuter * 6;
		var minHeight = radiusOuter * Math.sin(angle60); // this is edge to edge of the bounding box, not corner to corner.
		var pixelSize = Math.ceil(radiusOuter * 2 * size);
		var lineWidth = r.getNumber(0, 1) > 0.5 ? radiusOuter * r.getNumber(0, 0.3) : 0;
		var gap = r.getNumber(0, 0.01);
		var radiusInner = gap < radiusOuter ? radiusOuter - gap : radiusOuter;

		// log("init", {lineWidth, settings, gap, triggerLimit, radiusOuter, outOfBounds, pixelSize});

		isSvg ? dom.setAttributes(stage, { width: size, height: size, viewBox: "0 0 " + size + " " + size }) : stage.setSize(size, size);

		var renderBackground = function renderBackground() {
			if (settings.background.cur) {
				stage.ctx.fillStyle = backgroundColor;
				stage.ctx.fillRect(0, 0, size, size);
			} else {
				stage.ctx.clearRect(0, 0, size, size);
			}
		};

		var xo = void 0;

		// colour control
		var timeA = new Date().getTime();

		var sample = { w: 300, h: 1 };
		var gradientSamplesCanvas = dom.canvas(sample.w, sample.h);

		var createGradient = function createGradient(gradientSetIndex, gradientIndex) {
			var numColours = 2; // r.getInteger(2, 3);
			// following logic is good for numColours over 3, over complicated for 2, but 2 looks better.
			// basically want to spread gradients from -100% -> 200% so they are smoother
			// this principle is not possible with canvas, 0->1 is the colorStop range for createLinearGradient.
			var start = r.getNumber(-100, 0);
			var end = r.getNumber(100, 200);
			var delta = end - start;
			var stops = Array(numColours).fill().map(function (_, colourIndex) {
				var zeroToOne = colourIndex / (numColours - 1);
				var offset = start + zeroToOne * delta;
				var stopColour = c.getRandomColour();
				if (isSvg) {
					return "<stop offset=\"" + offset + "%\" stop-color=\"" + stopColour + "\"/>";
				} else {
					return { offset: offset, stopColour: stopColour };
				}
			});

			if (isSvg) {
				return "<linearGradient id=\"Gradient" + gradientIndex + "\" x1=\"0\" x2=\"1\" y1=\"0\" y2=\"0\">" + stops.join("") + "</linearGradient>";
			} else {
				var alreadyGenerated = gradientSets && gradientSets[gradientSetIndex] && gradientSets[gradientSetIndex][gradientIndex];
				if (alreadyGenerated) {
					// previous pass generated all gradient data, including gradientSampleCanvas + sampling <- expensive operations
					return alreadyGenerated;
				}

				// svg allows color stops outside 0-100%, canvas doesn't. so draw a canvas from -100% -> 200% (sample.w) to sample colours from.
				var gradientSampleCanvas = dom.canvas(sample.w, sample.h);

				var gradientFill = gradientSampleCanvas.ctx.createLinearGradient(0, 0, sample.w, sample.h);
				stops.forEach(function (_ref) {
					var offset = _ref.offset,
					    stopColour = _ref.stopColour;

					gradientFill.addColorStop((offset + 100) / sample.w, stopColour);
				});
				gradientSampleCanvas.ctx.fillStyle = gradientFill;
				gradientSampleCanvas.ctx.fillRect(0, 0, sample.w, sample.h);

				gradientSamplesCanvas.ctx.drawImage(gradientSampleCanvas.canvas, 0, 11 * gradientIndex);

				var gradientData = gradientSampleCanvas.ctx.getImageData(0, 0, sample.w, sample.h).data;

				var getPixel = function getPixel(perc) {
					var index = Math.floor(perc) * 4;
					var r = gradientData[index];
					var g = gradientData[index + 1];
					var b = gradientData[index + 2];
					// a = gradientData[index + 3];
					return "rgb(" + r + "," + g + "," + b;
				};

				var canvasStops = stops.map(function (_ref2, index) {
					var offset = _ref2.offset;

					var lerpedColour = getPixel(offset + 100);
					return { offset: index, stopColour: lerpedColour };
				});

				return { start: start, end: end, stops: canvasStops };
			}
		};

		var gradients = 16;
		var currentGradient = void 0;
		var currentGradientIndex = 0;

		var setGradients = function setGradients(_, gradientSetIndex) {
			c.getRandomPalette();
			// TODO unpure yuck
			backgrounds[gradientSetIndex] = c.getRandomColour();
			return Array(gradients).fill().map(function (_, gradientIndex) {
				return createGradient(gradientSetIndex, gradientIndex);
			});
		};
		gradientSets = Array(3) // each fxhash has only gets this many gradients. not relevant for FunkyVector which is a still image: only one gradient.
		.fill().map(setGradients);

		var pickNextGradient = function pickNextGradient() {
			currentGradientIndex++;
			currentGradientIndex %= gradientSets.length;
			currentGradient = gradientSets[currentGradientIndex];
			backgroundColor = backgrounds[currentGradientIndex];
			if (isSvg) {
				defs.innerHTML = currentGradient;
			}
		};
		pickNextGradient();

		var timeB = new Date().getTime();

		if (isSvg) {
			/*
   const gradientSamplesSVGHolder = dom.svg("svg");
   	currentGradient.forEach((gradString, i) => {
   	const gradientSampleSVG = dom.svg("rect", {
   		id: `gradient-sample-${i}`,
   		x: 0,
   		y: i * 11,
   		width: sample.w,
   		height: sample.h,
   		fill: `url(#Gradient${i})`,
   	});
   	gradientSamplesSVGHolder.appendChild(gradientSampleSVG);
   });
   document.body.appendChild(gradientSamplesSVGHolder);
   */

			stage.appendChild(defs);
			stage.appendChild(inner);
		} else {}
		// document.body.appendChild(gradientSamplesCanvas.canvas);


		// shape generation

		var scaleGroup = function scaleGroup(group, scale) {
			var rotate = group.rotate,
			    x = group.x,
			    y = group.y;

			if (isSvg) {
				group.setAttribute("transform", "translate(" + x * size + "," + y * size + ") rotate(" + rotate + ") scale(" + scale + ")");
			}
		};

		var calcTriangleScale = function calcTriangleScale(group, distance, amount) {
			var halfD = triggerLimit / 2;
			var scale = Math.abs((distance - halfD) / halfD);
			var shapesAmount = 1 - (1 - scale) * amount;
			calcTriangle(group, shapesAmount);
		};

		var calcTriangle = function calcTriangle(group, scale) {
			group.scale = Math.min(scale, group.scale);
			targets.push(group);
		};

		var row = 0;
		var col = 0;
		var iteration = 0;
		var timeC = new Date().getTime();

		var gradientBox = !isSvg && dom.canvas(pixelSize, pixelSize);

		if (!generationRequired) {
			// the while loop is not happening, so:
			shapes.forEach(function () {
				// got to call random shapes.length times to equate to:
				r.getInteger(0, 1); // rotate =
				r.getInteger(0, 1); // gradient =
			});
		}

		log({ generationRequired: generationRequired });

		// only need to calculate shapes on first pass, settings changes etc can reuse last pass.
		// creating dom.canvas and applying gradients are expensive operations!

		var _loop = function _loop() {
			iteration++;

			if (iteration > 100000) {
				throw new Error("bailing because too many iterations");
			}
			var second = row % 2 == 0;
			var colIndex = col;
			var large = radiusOuter * 2;

			if (colIndex === 0) {
				xo = second ? 0 : radiusOuter / -2;
			}

			xo += col % 2 == second ? large : large / 2;

			var x = xo - outOfBounds;
			var y = row * minHeight - outOfBounds;

			if (x > 1 + outOfBounds) {
				// incrementing row
				row++;
				col = 0;
				return "continue";
			}
			if (y > 1 + outOfBounds) {
				// finished
				row++;
				col = 0;
				generationRequired = false;
				return "break";
			}

			var group = isSvg ? dom.svg("g") : dom.canvas(pixelSize, pixelSize);
			if (isSvg) inner.appendChild(group);

			var pathCorner = function pathCorner(_, j) {
				var angle = ((second + colIndex) % 2 ? 0 : angle60 / 2) + j * angle60;
				var tx = (radiusInner - lineWidth) * Math.cos(angle);
				var ty = (radiusInner - lineWidth) * Math.sin(angle);
				return isSvg ? "" + (j === 0 ? "M" : "L") + tx * size + "," + ty * size : { tx: tx, ty: ty };
			};

			var path = Array(3).fill(0).map(pathCorner);
			var rotate = r.getInteger(0, 2) * 120;
			var gradientId = r.getInteger(0, gradients - 1);

			if (isSvg) {
				var triangle = dom.svg("path", { id: "triangle-" + row + "-" + col, d: path.concat("Z").join(" "), fill: "url(#Gradient" + gradientId + ")" });
				// svg is no longer centred properly in canvas conversion, also no rotation on svg!
				group.appendChild(triangle);
			} else {
				var ctx = group.ctx;

				var gradient = ctx.createLinearGradient(-pixelSize, 0, pixelSize, 0);
				currentGradient[gradientId].stops.forEach(function (_ref4) {
					var offset = _ref4.offset,
					    stopColour = _ref4.stopColour;

					gradient.addColorStop(offset, stopColour);
				});

				gradientBox.ctx.fillStyle = gradient;
				gradientBox.ctx.fillRect(0, 0, pixelSize, pixelSize);
				gradientBox.ctx.fill();

				// since we are using stroke, to get curved triangles, we need to mask out the shape on to another canvas
				var shapeBox = dom.canvas(pixelSize, pixelSize);

				shapeBox.ctx.translate(pixelSize / 2, pixelSize / 2);
				shapeBox.ctx.fillStyle = "green";
				shapeBox.ctx.beginPath();
				path.forEach(function (_ref5, index) {
					var tx = _ref5.tx,
					    ty = _ref5.ty;

					var x = tx * size;
					var y = ty * size;
					if (index === 0) {
						shapeBox.ctx.moveTo(x, y);
					} else {
						shapeBox.ctx.lineTo(x, y);
					}
				});
				shapeBox.ctx.closePath();
				shapeBox.ctx.lineCap = "round";
				shapeBox.ctx.lineJoin = "round";
				shapeBox.ctx.lineWidth = lineWidth * size;
				shapeBox.ctx.strokeStyle = "green";
				shapeBox.ctx.fill();
				shapeBox.ctx.stroke();

				ctx.drawImage(gradientBox.canvas, 0, 0);
				ctx.globalCompositeOperation = "destination-in";
				ctx.drawImage(shapeBox.canvas, 0, 0);
			}

			group.x = x;
			group.y = y;
			group.rotate = rotate;
			group.scale = 1;
			group.timeout1 = null;

			scaleGroup(group, 1);

			col++;

			shapes.push(group);
		};

		_loop2: while (generationRequired) {
			var _ret = _loop();

			switch (_ret) {
				case "continue":
					continue;

				case "break":
					break _loop2;}
		}

		shapes.forEach(function (group) {
			return group.scale = 1;
		});

		var timeD = new Date().getTime();

		log(timeB - timeA, timeC - timeB, timeD - timeC);

		// animation control

		var morphOne = function morphOne(group) {
			clearTimeout(group.timeout1);
			scaleGroup(group, 0);
			group.timeout1 = setTimeout(function () {
				return scaleGroup(group, 1);
			}, 600);
		};

		var hideOne = function hideOne(group, delay) {
			clearTimeout(group.timeout1);
			setTimeout(function () {
				return scaleGroup(group, 0);
			}, delay);
		};

		var showOne = function showOne(group, delay) {
			return setTimeout(function () {
				return scaleGroup(group, 1);
			}, delay);
		};

		// animation modifiers
		var m0 = void 0,
		    m1 = void 0,
		    m2 = void 0,
		    m3 = void 0;
		var setModifier = function setModifier() {
			return { o: r.getNumber(-Math.PI, Math.PI), s: r.getNumber(0.001, 0.002) };
		};
		var setModifiers = function setModifiers() {
			var _Array$fill$map, _Array$fill$map2;

			return _Array$fill$map = Array(4).fill().map(setModifier), _Array$fill$map2 = _slicedToArray(_Array$fill$map, 4), m0 = _Array$fill$map2[0], m1 = _Array$fill$map2[1], m2 = _Array$fill$map2[2], m3 = _Array$fill$map2[3], _Array$fill$map;
		};
		setModifiers();

		var getTimeDelayFn = function getTimeDelayFn() {
			// these fns have suffered from the canvas conversion. were svg only, not fixed for svg.
			var fadeStyle = r.getInteger(0, 5);
			return function (group, offset) {
				switch (fadeStyle) {
					case 0:
						{
							// circle sweep from in to out:
							var dx = group.x - 0.5;
							var dy = group.y - 0.5;
							var d = Math.sqrt(dx * dx + dy * dy);
							return offset + d;
						}
					case 1:
						// random
						return offset + Math.random() * 2000;
					case 2:
						// sweep vertical down
						return offset + group.y;
					case 3:
						// sweep vertical up
						return offset + size - group.y;
					case 4:
						// sweep horizontal right
						return offset + group.x;
					case 5:
						// sweep horizontal left
						return offset + size - group.x;
				}
			};
		};

		// eslint-disable-next-line no-unused-vars
		var next = function next(t) {
			var delayHide = getTimeDelayFn();

			shapes.forEach(function (group) {
				hideOne(group, delayHide(group, 0.1));
			});
			// max 2000
			setTimeout(function () {
				setModifiers();
				pickNextGradient();
			}, 2500);
			// max 4500
			var delayShow = getTimeDelayFn();
			setTimeout(function () {
				shapes.forEach(function (group) {
					return showOne(group, delayShow(group, 0));
				});
			}, 5000);
			// max 11500
			setTimeout(function () {
				aristotleSet += 12000;
				requestAnimationFrame(animate);
			}, 11500);
		};

		var calculateTargets = function calculateTargets(t, amount) {
			var i = t * 0.001;
			var triggerDistance = (Math.sin(Math.PI + i) + 0.6) * 0.5;

			// center moving everywhere
			var fn = function fn(acc, _ref3, i) {
				var o = _ref3.o,
				    s = _ref3.s;
				return acc + Math[i % 2 ? "sin" : "cos"](o + t * s);
			};
			var cx = [m0, m1].reduce(fn, 0) * 0.5 + 0.5;
			var cy = [m2, m3].reduce(fn, 0) * 0.5 + 0.5;

			shapes.forEach(function (group) {
				var dx = group.x - cx;
				var dy = group.y - cy;
				var d = Math.sqrt(dx * dx + dy * dy);
				if (d > triggerDistance && d < triggerDistance + triggerLimit) {
					// console.log("triggering", t);
					isSvg ? morphOne(group) : calcTriangleScale(group, d - triggerDistance, amount);
				} else {
					// console.log("not triggering", t);
					if (!isSvg) {
						calcTriangle(group, 1);
					}
				}
			});
		};

		var aristotleSet = 0;
		// eslint-disable-next-line no-unused-vars
		var frameReq = void 0;
		var animate = function animate(t) {
			// console.log(t);
			if (t < aristotleSet + 15000) {
				frameReq = requestAnimationFrame(animate);
				calculateTargets(t);
			} else {
				aristotleSet += 15000;
				next(t);
			}
		};

		// kick it off
		if (isSvg) {
			setTimeout(function () {
				return animate(0);
			}, 500);
		} else {
			calculateTargets(settings.time.cur * 40 + r.getInteger(0, 1e7), r.getNumber(0, 1));
			calculateTargets(settings.time.cur * 60 + r.getInteger(0, 1e7), r.getNumber(0, 1));

			targets = [];
			calculateTargets(settings.time.cur * 80 + r.getInteger(0, 1e7), r.getNumber(0, 1));

			renderBackground();

			if (!settings.time.cur) {
				// if 0, then ignore all previous calculations (scales) and render tris at full size.
				// but we need the previous calculations to remain for deterministic randoms...

				targets = shapes.map(function (group) {
					return Object.assign(group, { scale: 1 });
				});
			}

			targets.forEach(function (group) {
				var canvas = group.canvas,
				    rotate = group.rotate,
				    scale = group.scale,
				    x = group.x,
				    y = group.y;


				var dx = x - 0.5;
				var dy = y - 0.5;
				var h = Math.hypot(dx, dy);
				if (settings.edge.cur == false && h > 0.2 + r.getNumber(0, 0.3) - radiusOuter) {
					// filter out some hidden ones if not drawing to edge of screen square
					return;
				}

				stage.ctx.save();

				// rotate base
				stage.ctx.translate(half, half);
				stage.ctx.rotate(baseRotation * Math.PI * 2);
				stage.ctx.translate(-half, -half);

				// translate triangle
				stage.ctx.translate(x * size, y * size);
				stage.ctx.scale(scale, scale);
				stage.ctx.rotate(rotate / 180 * Math.PI);
				stage.ctx.translate(-pixelSize / 2, -pixelSize / 2);

				// render
				stage.ctx.drawImage(canvas, 0, 0);

				stage.ctx.restore();
			});
		}

		progress("render:complete", stage.canvas);
	};

	var update = function update(settings, seed) {
		var then = new Date().getTime();
		// log("aristotle update", settings, seed);

		init({ settings: settings, seed: seed });
		var now = new Date().getTime();
		log("update time:", now - then);
	};

	return { init: init, settings: settings, stage: isSvg ? stage : stage.canvas, update: update };
};

if (isNode) {
	module.exports = aristotle;
} else if (typeof define !== "undefined") {
	define("aristotle", function () {
		return aristotle;
	});
}
