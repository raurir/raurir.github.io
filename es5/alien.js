'use strict';

var isNode = typeof module !== "undefined";

if (isNode) {
	var con = console;
	var rand = require('./rand.js');
	var dom = require('./dom.js');
	var colours = require('./colours.js');
}

var alien = function alien() {
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;
	var centre, size, sw, sh;

	var numberOfRows = 10;
	var numberOfColumns = 10;
	var halfColumns = numberOfColumns / 2;
	var cellSize = void 0;
	var canvasWidth = void 0;
	var canvasHeight = void 0;

	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);

		cellSize = Math.ceil(rand.getInteger(20, 60) / numberOfColumns);
		canvasWidth = cellSize * (numberOfColumns + 2);
		canvasHeight = cellSize * (numberOfRows + 2);

		centre = sh / 2;
		colours.getRandomPalette();
		render();
	}

	function render() {
		var aliens = manyAliens();
		aliens.x.forEach(function (x, xi) {
			aliens.y.forEach(function (y) {
				var img = oneAlien();
				ctx.drawImage(img, centre + x * canvasWidth, centre + y * canvasHeight);
			});
			progress("render:progress", xi / aliens.x.length);
		});
		progress("render:complete", stage.canvas);
	}

	function oneAlien() {
		var grid = [];

		var lineSize = rand.getInteger(0, 3); // either draw no line
		if (lineSize) lineSize = cellSize / lineSize; // or fraction of cell size

		var bmp = dom.canvas(canvasWidth, canvasHeight);

		function seed() {
			for (var row = 0; row < numberOfRows; row++) {
				grid[row] = [];
				for (var column = 0; column < halfColumns; column++) {
					grid[row][column] = createSeedCell(column);
				}
			}
		}

		function createSeedCell(probability) {
			var chance = Math.random();
			var cutoff = (probability + 1) / (halfColumns + 1);
			return chance < cutoff;
		}

		function drawGrid() {
			var column = void 0,
			    row = void 0;
			var colourLine = colours.getNextColour();
			var colourFill = colours.getNextColour();
			for (row = 0; row < numberOfRows; row++) {
				for (column = 0; column < numberOfColumns; column++) {
					drawCell(row, column, colourLine, lineSize);
				}
			}
			for (row = 0; row < numberOfRows; row++) {
				for (column = 0; column < numberOfColumns; column++) {
					drawCell(row, column, colourFill || colours.getNextColour(), 0);
				}
			}
		}

		function drawCell(y, x, fillStyle, strokeWidth) {
			var colReflected = void 0;
			if (x >= halfColumns) {
				colReflected = numberOfColumns - x - 1;
			} else {
				colReflected = x;
			}

			var isOn = grid[y][colReflected];

			if (isOn) {
				bmp.ctx.fillStyle = fillStyle;
				bmp.ctx.fillRect((1 + x) * cellSize - strokeWidth, (1 + y) * cellSize - strokeWidth, cellSize + strokeWidth * 2, cellSize + strokeWidth * 2);
			}
		}

		seed();
		drawGrid();
		return bmp.canvas;
	}

	function manyAliens() {
		function r(m) {
			return ~~(Math.random() * m + 1);
		};
		function q() {
			var l = r(11),
			    g = r(5),
			    a = [],
			    i = 0;
			while (i < l) {
				var j = i * g;
				a.push(j);
				if (i) a.unshift(-j);
				i++;
			}
			return a;
		}
		return { x: q(), y: q() };
	}

	var experiment = {
		init: init,
		render: render,
		stage: stage.canvas
	};

	return experiment;
};

if (isNode) {
	module.exports = alien();
} else {
	define("alien", alien);
}
