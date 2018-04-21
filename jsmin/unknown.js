"use strict";

var con = console, isNode = "undefined" != typeof module, unknown = function() {
    var bmp = dom.canvas(800, 800), ctx = bmp.ctx;
    return {
        stage: bmp.canvas,
        resize: function(w, h) {
            bmp.canvas.setSize(w, h);
        },
        init: function() {
            var y = -10;
            colours.getRandomPalette();
            for (var rOffset = rand.getNumber(0, 2), rBase = rand.getNumber(1, 2), rPower = rand.getNumber(1.01, 1.5), gOffset = rand.getNumber(-2, 2), gBase = rand.getNumber(8e3, 1e4), gPower = rand.getNumber(.4, .6), yOffset = rand.getNumber(-2, 2), yBase = rand.getNumber(1.2, 2), yPower = rand.getNumber(1.2, 1.6), yMultiplier = rand.getNumber(2, 3), i = 0; i < 10; i++) {
                var r = Math.pow((rOffset + 10 - i) * rBase, rPower), g = Math.pow((gOffset + 10 - i) * gBase, gPower);
                y += Math.pow((yOffset + 10 - i) * yBase, yPower) * yMultiplier, ctx.fillStyle = colours.getNextColour();
                for (var cols = i + 1, j = 0; j < cols; j++) {
                    var x = 400 + (j - (cols - 1) / 2) / cols * g;
                    ctx.beginPath(), ctx.drawCircle(x, y, r), ctx.closePath(), ctx.fill();
                }
            }
        },
        kill: function() {}
    };
};

isNode ? module.exports = unknown() : define("unknown", unknown);