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

/*global voronoi, fillDither, fillStripes*/
var isNode = typeof module !== "undefined";
if (isNode) {
	var colours = require("./colours.js");
	var dom = require("./dom.js");
	// var geom = require("./geom.js");
	var rand = require("./rand.js");
}

var voronoi_stripes = function voronoi_stripes() {
	return function () {
		var r = rand.instance();
		var c = colours.instance(r);

		var dot = 1;
		var stage = dom.canvas(1, 1);
		var canvas = stage.canvas,
			ctx = stage.ctx;

		var settings = {};

		var size = void 0;
		var sizeX = void 0;
		var sizeY = void 0;

		function positionPoint(index, total) {
			var dim = Math.floor(Math.sqrt(total));
			var x = (index % dim) + 0.5;
			var y = Math.floor(index / dim) + 0.5;

			var blockX = sizeX / dim / dot;
			var blockY = sizeY / dim / dot;

			var centreX = sizeX / 2 / dot;
			var centreY = sizeY / 2 / dot;

			var radius = (index / total) * centreX;
			var angle =
				(index / total) *
				Math.PI *
				index *
				(0.5 + r.getNumber(0, 20));

			var methods = [
				[r.getNumber(0, sizeX), r.getNumber(0, sizeY)], // original random
				[
					centreX + (Math.sin(angle) * sizeX) / 3,
					centreY + (Math.cos(angle) * sizeY) / 3,
				], // polar
				[
					centreX + Math.sin(angle) * radius,
					centreY + Math.cos(angle) * radius,
				], // cluster near centre

				// 3 grid
				[
					(x -
						settings.pointBias / 2 +
						r.getNumber(0, settings.pointBias)) *
						blockX,
					(y -
						settings.pointBias / 2 +
						r.getNumber(0, settings.pointBias)) *
						blockY,
				],
			];
			return methods[settings.pointMethod];
		}

		function renderRegion(region, bounds) {
			var buffer = 10;
			var x = bounds.x,
				y = bounds.y,
				width = bounds.width,
				height = bounds.height;

			if (
				isNaN(x) ||
				isNaN(y) ||
				(isNaN(width) && isNaN(height))
			) {
				// eslint-disable-next-line
				console.log("null renderRegion", bounds);
				return null;
			}
			var size = (width > height ? width : height) + buffer;
			// const pattern = fillStripes({c, r, size, settings});
			var pattern = fillDither({
				c: c,
				r: r,
				size: size,
				settings: settings,
			});
			var regionCanvas = dom.canvas(
				width + buffer,
				height + buffer,
			);
			var imageData = regionCanvas.ctx.getImageData(
				0,
				0,
				width + buffer,
				height + buffer,
			);
			region.forEach(function (_ref) {
				var _ref2 = _slicedToArray(_ref, 2),
					rx = _ref2[0],
					ry = _ref2[1];

				var ox = rx - x;
				var oy = ry - y;
				var xp = (oy * (width + buffer) + ox) * 4;
				imageData.data[xp] = 255;
				imageData.data[xp + 1] = 255;
				imageData.data[xp + 3] = 255;
			});
			// document.body.appendChild(regionCanvas.canvas);
			regionCanvas.ctx.putImageData(imageData, 0, 0);
			regionCanvas.ctx.globalCompositeOperation = "source-in";
			regionCanvas.ctx.drawImage(pattern, 0, 0);
			ctx.drawImage(regionCanvas.canvas, x, y);
		}

		function generate() {
			settings.baseRotation = Math.PI * 2;
			settings.lineGap = r.getNumber(1, 101);
			settings.lineSize = r.getNumber(1, 101);
			settings.overallScale = r.getNumber(50, 200);
			settings.lineScale = settings.overallScale;

			settings.pointBias = r.getNumber(0, 2);
			// settings.pointMethod = r.getInteger(0, 4);
			settings.pointMethod = 0;
			settings.varyDuotone = false;
			// settings.varyDuotone = r.random() > 0.5;
			settings.varyPerLine = false;
			// settings.varyPerLine = r.random() > 0.5;
			settings.varyPerRegion = false;
			// settings.varyPerRegion = r.random() > 0.5;
			settings.varyRotation =
				Math.PI * (r.random() > 0.5 ? 2 : 0.2);

			if (settings.varyDuotone) c.setRandomPalette(0); // this sets black and white (or greys really.)
			// c.setRandomPalette(41); // this sets black and white (or greys really.)
			// c.setRandomPalette();

			settings.sites = 16 + r.getNumber(0, 20);
			// settings.sites = 1 + r.getNumber(0, 80);

			/*
   var txt = [
   	"sites",
   	"overallScale",
   	"pointMethod",
   	"pointBias",
   	"baseRotation",
   	"varyRotation",
   	"varyDuotone",
   	"varyPerRegion",
   	"varyPerLine",
   	"lineScale",
   	"lineSize",
   	"lineGap",
   ]
   	.map(function(v) {
   		return v + ":" + settings[v];
   	})
   	.join("\n");
   */

			voronoi.init({
				dot: dot,
				sites: settings.sites,
				sizeX: sizeX,
				sizeY: sizeY,
				debug: false,
			});
			voronoi.genPoints(positionPoint);
			voronoi.genMap();
			voronoi.drawRegions(renderRegion);
			// voronoi.drawRegionBounds(ctx);
			// voronoi.drawSites(ctx);
		}

		return {
			init: function init(options) {
				size = options.size;
				sizeX = size;
				sizeY = size;
				r.setSeed(options.seed);
				c.getRandomPalette();
				stage.setSize(sizeX, sizeY);
				generate(0);
			},
			settings: settings,
			stage: canvas,
			update: function update() {},
		};
	};
};

if (isNode) {
	module.exports = voronoi_stripes();
} else {
	define("voronoi_stripes", voronoi_stripes);
}
