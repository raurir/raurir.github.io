"use strict";

var isNode = "undefined" != typeof module;

if (isNode) var con = console, rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var alien = function() {
    var centre, stage = dom.canvas(1, 1), ctx = stage.ctx, numberOfRows = 10, numberOfColumns = 10, cellSize = Math.ceil(rand.getInteger(20, 60) / numberOfColumns), halfColumns = numberOfColumns / 2, canvasWidth = cellSize * (numberOfColumns + 2), canvasHeight = cellSize * (numberOfRows + 2);
    function render() {
        var aliens = function() {
            function r(m) {
                return ~~(Math.random() * m + 1);
            }
            function q() {
                for (var l = r(11), g = r(5), a = [], i = 0; i < l; ) j = i * g, a.push(j), i && a.unshift(-j), 
                i++;
                return a;
            }
            return {
                x: q(),
                y: q()
            };
        }();
        con.log(aliens), aliens.x.forEach(function(x, xi) {
            aliens.y.forEach(function(y) {
                var img = function() {
                    var grid = [], lineSize = rand.getInteger(0, 3);
                    lineSize && (lineSize = cellSize / lineSize);
                    var bmp = dom.canvas(canvasWidth, canvasHeight);
                    function drawCell(y, x, fillStyle, strokeWidth) {
                        var colReflected = void 0;
                        colReflected = halfColumns <= x ? numberOfColumns - x - 1 : x;
                        var isOn = grid[y][colReflected];
                        isOn && (bmp.ctx.fillStyle = fillStyle, bmp.ctx.fillRect((1 + x) * cellSize - strokeWidth, (1 + y) * cellSize - strokeWidth, cellSize + 2 * strokeWidth, cellSize + 2 * strokeWidth));
                    }
                    return function() {
                        for (var row = 0; row < numberOfRows; row++) {
                            grid[row] = [];
                            for (var column = 0; column < halfColumns; column++) grid[row][column] = (probability = column, 
                            Math.random() < (probability + 1) / (halfColumns + 1));
                        }
                        var probability;
                    }(), function() {
                        var column = void 0, row = void 0, colourLine = colours.getNextColour(), colourFill = colours.getNextColour();
                        for (row = 0; row < numberOfRows; row++) for (column = 0; column < numberOfColumns; column++) drawCell(row, column, colourLine, lineSize);
                        for (row = 0; row < numberOfRows; row++) for (column = 0; column < numberOfColumns; column++) drawCell(row, column, colourFill || colours.getNextColour(), 0);
                    }(), bmp.canvas;
                }();
                ctx.drawImage(img, centre + x * canvasWidth, centre + y * canvasHeight);
            }), progress("render:progress", xi / aliens.x.length);
        }), progress("render:complete", stage.canvas);
    }
    return {
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
            centre = sh / 2, colours.getRandomPalette(), render();
        },
        render: render,
        stage: stage.canvas
    };
};

isNode ? module.exports = alien() : define("alien", alien);