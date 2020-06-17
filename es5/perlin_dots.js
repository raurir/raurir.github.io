"use strict";

var perlin_dots = function perlin_dots(perlin) {
	var pixel = 20;
	var w = 30;
	var h = 30;
	var sw = w * pixel;
	var sh = h * pixel;

	var c = dom.canvas(sw, sh);
	var d = c.ctx;

	var dots = [];
	var numDots = 4e2;

	// const logger = document.createElement("div");
	// document.body.appendChild(logger);

	// var iterations = 0;
	var channelRed = perlin.noise(w, h);
	var channelGreen = perlin.noise(w, h);
	var channelBlue = perlin.noise(w, h);

	var scale = 0.03;
	var t = 1;
	var red = channelRed.cycle(t, scale);
	// var green = channelGreen.cycle(t, scale);
	// var blue = channelBlue.cycle(t, scale);

	var genClamp = function genClamp(min, max) {
		return function (val) {
			if (val < min) return min;
			if (val > max) return max;
			return val;
		};
	};

	var drawFrame = function drawFrame(time) {
		requestAnimationFrame(drawFrame);
		drawColours();
		drawDots();
		// console.log("d", dots[0]);
	};

	function drawColours(time) {
		// var t = time * 0.005;

		for (var i = 0, il = w * h; i < il; i++) {
			var xp = i % w;
			var yp = Math.floor(i / w);
			// d.save();
			// d.setTransform( 1, 0, 0, 1, 0, 0 );
			var r = ~~(red[i] * 255),
			    g = ~~(red[i] * 255),
			    b = ~~(red[i] * 255);
			d.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			d.fillRect(xp * pixel, yp * pixel, pixel, pixel);

			// min = M.min(r, min);
			// max = M.max(r, max);
			// min = M.min(g, min);
			// max = M.max(g, max);
			// min = M.min(b, min);
			// max = M.max(b, max);
		}

		// console.log(dots[0]);
		// logger.innerHTML = min + "<br>" + max;

		// requestAnimationFrame(drawColours);
	}
	var drawDots = function drawDots() {
		var d = dots.map(function (dotA) {
			var pressure = {
				x: 0,
				y: 0
			};
			var pa = dotA.position();

			dots.forEach(function (dotB) {
				if (dotA === dotB) {
					return;
				}
				var pb = dotB.position();
				var dx = pb.x - pa.x;
				var dy = pb.y - pa.y;
				var d = Math.hypot(dx, dy);
				if (d < 1) return;
				if (d > 200) return;

				// const xi = Math.floor((pa.x + dx / 2) / pixel);
				// const yi = Math.floor((pa.y + dy / 2) / pixel);
				var xi = Math.floor(pa.x / pixel);
				var yi = Math.floor(pa.y / pixel);
				var i = yi * w + xi;

				if (!red[i]) {
					// off screen
					// throw new Error();
					return;
				}

				var push = red[i] - 0.5;
				// const attraction = Math.abs(push) > 0.01 ? push * 0.008 : 0;
				var attraction = push * 0.008;
				// pressure.x += (50 - Math.abs(dx)) * (dx < 0 ? -1 : 1) * 0.01;
				// pressure.y += (50 - Math.abs(dy)) * (dy < 0 ? -1 : 1) * 0.01;
				pressure.x += dx / d * attraction; // (50 - Math.abs(dx)) * (dx < 0 ? -1 : 1) * 0.01;
				pressure.y += dy / d * attraction; //(50 - Math.abs(dy)) * (dy < 0 ? -1 : 1) * 0.01;

				// if (isNaN(pressure.x)) {
				// 	console.log(pressure, dx, d, attraction);
				// 	throw new Error();
				// }

				// }
			});

			// console.log("pressure", pressure.x, pressure.y);
			dotA.move(pressure);
			dotA.draw();
			return dotA;
		});
		dots = d;
	};

	var generateDot = function generateDot() {
		var x = Math.random() * sw;
		var y = Math.random() * sh;
		var draw = function draw() {
			d.fillStyle = "#000";
			d.fillRect(x, y, 2, 2);
		};
		var move = function move(distance) {
			x += distance.x;
			y += distance.y;
		};
		var position = function position() {
			return { x: x, y: y };
		};
		return {
			position: position,
			draw: draw,
			move: move
		};
	};

	return {
		init: function init() {
			for (var i = 0; i < numDots; i++) {
				dots.push(generateDot());
			}
			drawFrame();
		},
		stage: c.canvas
	};
};

define("perlin_dots", ["perlin"], perlin_dots);
