"use strict";

var isNode = "undefined" != typeof module, pattern_circles = function() {
    var sw, sh, circles, colourBG, rotation, bmp = dom.canvas(1, 1), ctx = bmp.ctx;
    return {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size;
            var cx = (sw = size) / 2, cy = (sh = size) / 2;
            bmp.setSize(sw, sh), ctx.clearRect(0, 0, sw, sh), ctx.fillRect(cx - 2, cy - 2, 4, 4), 
            rotation = Math.random() * Math.PI / 2;
            for (var size = 10 + ~~(50 * Math.random()), lines = 2 + ~~(5 * Math.random()), widths = []; widths.length < lines; ) widths.push(Math.ceil(Math.random() * size));
            widths.push(size);
            var noDuplicates = [];
            widths.map(function(a, i) {
                widths.indexOf(a) == i && noDuplicates.push(a);
            }), widths = noDuplicates.sort(function(a, b) {
                return a < b ? -1 : 1;
            }), colours.getRandomPalette();
            for (var palette = []; palette.length < widths.length; ) palette.push(colours.getRandomColour());
            colourBG = colours.getRandomColour(), con.log("colourBG", colourBG);
            var patternSize = size + size * Math.random();
            circles = dom.canvas(patternSize, patternSize), document.body.appendChild(circles.canvas);
            for (var i = widths.length - 1; -1 < i; i--) {
                var radius = widths[i], colour = palette[i];
                circles.ctx.beginPath(), circles.ctx.fillStyle = colour, circles.ctx.drawCircle(size / 2, size / 2, radius / 2), 
                circles.ctx.fill(), circles.ctx.closePath(), con.log(i);
            }
            con.log("render"), ctx.save(), ctx.fillStyle = colourBG, ctx.rect(0, 0, sw, sh), 
            ctx.fill(), ctx.rotate(rotation), ctx.fillStyle = ctx.createPattern(circles.canvas, "repeat"), 
            ctx.fill(), ctx.restore(), progress("render:complete", bmp.canvas);
        }
    };
};

isNode ? module.exports = pattern_circles() : define("pattern_circles", pattern_circles);