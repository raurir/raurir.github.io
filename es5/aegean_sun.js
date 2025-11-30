"use strict";

define("aegean_sun", ["perlin"], function (perlin) {
	var rndI = rand.instance();
	rndI.setSeed(Math.random());
	var c = colours.instance(rndI);

	var sw = window.innerWidth;
	var sh = window.innerHeight;
	var w = sw,
		h = sh;

	var channelX = perlin.noise(w, h);
	var channelY = perlin.noise(w, h);

	var maxSize = rndI.getInteger(100, 300);
	var minSize = rndI.getInteger(4, 10);
	var maxBoxes = Math.floor((sw * sh) / 200);
	var cols = c.getRandomPalette();
	var canvas = dom.canvas(sw, sh);
	var ctx = canvas.ctx;
	var pixels = [];

	function go(t) {
		ctx.clearRect(0, 0, sw, sh);
		// requestAnimationFrame(go);
		var noiseX = channelX.cycle(t * 0.000001, 0.005);
		var noiseY = channelY.cycle(t * 0.00001, 0.004);
		// for (var i = 0, il = w * h; i < il; i++){
		// 	var xi = i % w;
		// 	var yi = Math.floor(i / w);
		// 	var x = xi;
		// 	var y = yi
		// 	ctx.fillStyle = `rgba(${ Math.round(noise[i] * 200) },1,1,1)`;
		// 	ctx.fillRect(x, y, 1, 1);
		// }

		var segments = 20;
		var steps = 40;

		function contour() {
			var p0 = {x: rndI.getNumber(0.4, 0.6) * w, y: 0 * h};
			var p1 = {x: rndI.getNumber(0.4, 0.6) * w, y: 1 * h};
			var line = [];
			for (var i = 0; i < segments; i++) {
				var p = geom.lerp(p0, p1, i / segments);
				// ctx.fillStyle = `rgba(0,200,1,1)`;
				// ctx.fillRect(p.x, p.y, 2, 2);
				line.push(p);
			}
			renderLine(line);
			return line;
		}

		function recurse(line, offset) {
			var segments = line.length;
			var nextLine = [];
			for (var i = 0; i < segments; i++) {
				var p = {
					x: line[i].x + offset.x,
					y: line[i].y + offset.y,
				};

				var noiseIndex = Math.floor(p.y * w + p.x);
				var x = (noiseX[noiseIndex] - 0.5) * 2;
				var y = (noiseY[noiseIndex] - 0.5) * 0;
				p.x += x;
				p.y += y;
				nextLine.push(p);
			}
			renderLine(nextLine);
			return nextLine;
		}

		function renderLine(line) {
			var segments = line.length;
			ctx.beginPath();
			for (var i = 0; i < segments; i++) {
				var p = line[i];
				if (i == 0) {
					ctx.moveTo(p.x, p.y);
				} else {
					ctx.lineTo(p.x, p.y);
				}
			}
			ctx.stroke();
		}

		var line = contour();
		var next = line,
			prev = line;
		for (var i = 0; i < steps; i++) {
			next = recurse(next, {x: 4, y: 0});
			prev = recurse(prev, {x: -4, y: 0});
		}
	}

	function init() {
		var bg = c.getRandomColour();
		cols.splice(cols.indexOf(bg), 1);
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, sw, sh);
		ctx.strokeStyle = c.getNextColour();
		go(0);
	}
	return {
		init: init,
		stage: canvas.canvas,
	};
});
