"use strict";

/*global __dirname, fillDither */
var isNode = typeof module !== "undefined";
if (isNode) {
	var Canvas = require("canvas");
	var colours = require("./colours.js");
	var dom = require("./dom.js");
	var fillDither = require("./fill/dither.js");
	var fs = require("fs");
	var rand = require("./rand.js");
	var Image = Canvas.Image;
}

var squash_match_shirt = function squash_match_shirt() {
	return function () {
		var r = rand.instance();
		var c = colours.instance(r);

		var stage = dom.canvas(1, 1);
		var canvas = stage.canvas,
		    ctx = stage.ctx;

		var settings = {};

		var size = void 0;
		var sizeX = void 0;
		var sizeY = void 0;

		var sectors = 10;
		// angle of each sector
		var angle = 1 / sectors * Math.PI * 2;

		function renderRegion(rot) {
			var settings = {
				alternate: true,
				baseRotation: (1 / 4 + 1 / sectors / 2) * Math.PI * 2,
				bg: "transparent",
				fg: "#F4502B",
				shape: 1,
				varyRotation: false,
				wiggle: 0
			};
			var d = size / 2;
			// Math.sqrt(Math.pow(size / 2, 2) * 2); // diagonal distance
			var pattern = fillDither({ c: c, r: r, size: d * 1, settings: settings });
			var patternFill = ctx.createPattern(pattern, "no-repeat");

			ctx.save();
			ctx.translate(size / 2, size / 2);
			ctx.rotate(rot * Math.PI * 2);
			ctx.fillStyle = patternFill;
			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(d, 0);
			ctx.lineTo(Math.cos(angle) * d, Math.sin(angle) * d);
			ctx.closePath();
			ctx.fill();
			// ctx.strokeStyle = "white";
			// ctx.lineWidth = 10;
			ctx.stroke();
			ctx.restore();
		}

		function renderSquare() {
			var settings = {
				baseRotation: 0,
				varyRotation: false
			};
			var d = size;
			var pattern = fillDither({ c: c, r: r, size: d, settings: settings });
			var patternFill = ctx.createPattern(pattern, "no-repeat");

			ctx.fillStyle = patternFill;
			ctx.rect(0, 0, size, size);
			ctx.fill();
			// ctx.strokeStyle = "white";
			// ctx.lineWidth = 10;
			ctx.stroke();
		}

		function renderBMPFromFile(url, scale) {
			var img = new Image();
			img.onload = function () {
				var width = img.width;
				var height = img.height;
				ctx.translate(size / 2, size / 2);
				ctx.scale(scale, scale);
				ctx.translate(-width / 2, -height / 2);
				ctx.drawImage(img, 0, 0);
			};
			img.onerror = function (err) {
				console.log("renderBMPFromFile error", err);
			};
			img.src = url;
		}

		function renderLogo() {
			var fontSize = size * 0.1;
			var font = "MyriadPro-Bold";
			ctx.save();
			ctx.translate(size / 2, size / 2);
			ctx.font = fontSize + "px " + font;
			ctx.fillStyle = "black";
			ctx.fillText("SquashMatch", 0, 0);
			ctx.restore();
		}

		function generate() {
			// renderSquare();

			// ctx.fillStyle = "transparent";
			// ctx.rect(0, 0, size, size);
			// ctx.fill();
			for (var i = 0; i < sectors; i++) {
				renderRegion(i / sectors);
			}
			// renderBMPFromFile("./SquashMatchIconCircle.png", 0.5);

			ctx.globalCompositeOperation = "destination-out";
			ctx.beginPath();
			ctx.drawCircle(size / 2, size / 2, size / 2 * 0.6);
			ctx.closePath();
			ctx.fill();
			ctx.globalCompositeOperation = "source-over";

			// made with https://ezgif.com/crop/
			renderBMPFromFile("./SquashMatchIconCircleHiRes.png", size * 0.0004);

			renderLogo();

			// progress("render:complete", canvas);
		}

		return {
			init: function init(options) {
				size = options.size;
				sizeX = size;
				sizeY = size;
				r.setSeed(options.seed);
				c.setPalette(["#fff", "transparent"]);
				stage.setSize(sizeX, sizeY);
				generate(0);
			},
			settings: settings,
			stage: canvas,
			update: function update() {}
		};
	};
};

if (isNode) {
	var ex = squash_match_shirt();
	module.exports = ex;
	var inst = ex();
	inst.init({ size: 1500 });
	console.log("render complete");
	setTimeout(function () {
		var filename = __dirname + "/../export/squash_match_shirt_" + new Date().getTime() + ".png";
		inst.stage.toBuffer(function (err, buf) {
			if (err) {
				console.log("savecanvas err", err);
				return;
			}
			fs.writeFile(filename, buf, function () {
				console.log("saveFile success", filename);
			});
		});
	}, 500);
} else {
	define("squash_match_shirt", squash_match_shirt);
}
