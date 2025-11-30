"use strict";

define("tentacle", function () {
	var r = rand.instance();
	var c = colours.instance(r);

	var TAU = Math.PI * 2;
	var bmp = dom.canvas(1, 1);
	var ctx = bmp.ctx;

	var size, sw, sh, cx, cy;
	var numLines;
	var lineLength;
	var lines = [];
	var colour;

	function init(options) {
		r.setSeed((options && options.seed) || Math.random());
		c.getRandomPalette();
		colour = c.getNextColour();
		numLines = r.getInteger(5, 15);
		lineLength = r.getInteger(20, 50);

		// size = (options && options.size) || 400;
		size = 800;
		sw = size;
		sh = size;
		cx = sw / 2;
		cy = sh / 2;
		bmp.setSize(sw, sh);

		for (var j = 0; j < numLines; j++) {
			var line = [];
			for (var i = 0; i < lineLength; i++) {
				line.push(createJoint(j, i));
			}
			lines.push(line);
		}
		render(0);
	}

	function createJoint(j, i) {
		var pos = 0;
		var x = 0;
		var y = i * 20;
		var rot = 0;
		var rad = 2 + 0.3 * (lineLength - i);
		// con.log(rad);
		return {
			pos: pos,
			rot: rot,
			x: x,
			y: y,
			move: function move(px, py) {
				pos += 0.01;
				// feed oscillation in here.
				rot =
					(j / numLines) * TAU + Math.sin(pos) * 0.24 * (i + 1);
				x = px + Math.sin(rot) * 10;
				y = py + Math.cos(rot) * 10;

				ctx.beginPath();
				ctx.drawCircle(cx + x, cy + y, rad);
				ctx.fill();

				/*
        ctx.beginPath();
        ctx.strokeStyle = "#b5e";
        ctx.moveTo(cx + px, cy + py);
        ctx.lineTo(cx + x, cy + y);
        ctx.stroke();
        */

				return {x: x, y: y};
			},
		};
	}

	function render(_time) {
		// if (_time < 1e4)
		requestAnimationFrame(render);
		ctx.fillStyle = "black";
		ctx.rect(0, 0, sw, sh);
		ctx.fill();

		ctx.globalAlpha = 0.5;
		ctx.fillStyle = colour;

		for (var j = 0; j < numLines; j++) {
			var p = {x: 0, y: 0};
			for (var i = 0; i < lineLength; i++) {
				var joint = lines[j][i];
				p = joint.move(p.x, p.y);
			}
		}
	}

	var experiment = {
		stage: bmp.canvas,
		init: init,
	};

	return experiment;
});
