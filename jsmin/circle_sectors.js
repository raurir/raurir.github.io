"use strict";

var isNode = "undefined" != typeof module;

if (isNode) var con = console, rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var circle_sectors = function() {
    var size, TAU = 2 * Math.PI, QUADRANT = Math.PI / 2, centre = .5, bmp = dom.canvas(1, 1);
    return {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size, bmp.setSize(size, size), colours.getRandomPalette();
            var rings = rand.getInteger(4, 24), ringStart = rand.getInteger(0, rings - 1), sectorsStart = rand.getInteger(2, 16), sectorsPower = rand.getInteger(2, 3), padding = rand.getNumber(0, .01), sectorsMin = rand.getNumber(.02, .2), dotty = .8 < rand.getNumber(0, 1), howDotty = rand.getNumber(.1, .8), colourCycle = function() {
                var mode = rand.getInteger(0, 2);
                con.log("colourCycle - mode:", mode);
                var ringLast = -1, ringRegularCycle = .6 < rand.getNumber(0, 1);
                switch (mode) {
                  case 0:
                    return function(ring, sector) {
                        return colours.getRandomColour();
                    };

                  case 1:
                    return function(ring, sector) {
                        return colours.getNextColour(ring);
                    };

                  case 2:
                    return function(ring, sector) {
                        return ring != ringLast ? (ringLast = ring, colours.getNextColour(ringRegularCycle || rand.getInteger(0, 4))) : colours.getCurrentColour();
                    };
                }
            }();
            bmp.ctx.lineWidth = padding * size;
            for (var i = ringStart; i < rings; i++) if (!(dotty && rand.getNumber(0, 1) > howDotty)) {
                for (var ringRadiusInner = i / rings * centre, ringRadiusOuter = (i + 1) / rings * centre, perimeter = TAU * ringRadiusInner, sectors = sectorsStart; sectorsMin < perimeter / sectors; ) sectors *= sectorsPower;
                for (var j = 0; j < sectors; j++) {
                    var drawSector = function() {
                        bmp.ctx.beginPath(), bmp.ctx.moveTo(x0 * size, y0 * size), bmp.ctx.lineTo(x1 * size, y1 * size), 
                        bmp.ctx.arc(centre * size, centre * size, ringRadiusOuter * size, QUADRANT - angle0, QUADRANT - angle1, !0), 
                        bmp.ctx.lineTo(x3 * size, y3 * size), bmp.ctx.arc(centre * size, centre * size, ringRadiusInner * size, QUADRANT - angle1, QUADRANT - angle0, !1), 
                        bmp.ctx.closePath();
                    };
                    if (!(dotty && rand.getNumber(0, 1) > howDotty)) {
                        var angle0 = j / sectors * TAU, angle1 = (j + 1) / sectors * TAU, x0 = centre + Math.sin(angle0) * ringRadiusInner, y0 = centre + Math.cos(angle0) * ringRadiusInner, x1 = centre + Math.sin(angle0) * ringRadiusOuter, y1 = centre + Math.cos(angle0) * ringRadiusOuter, x3 = (Math.sin(angle1), 
                        Math.cos(angle1), centre + Math.sin(angle1) * ringRadiusInner), y3 = centre + Math.cos(angle1) * ringRadiusInner;
                        bmp.ctx.globalCompositeOperation = "source-over", bmp.ctx.fillStyle = colourCycle(i, j), 
                        drawSector(), bmp.ctx.fill(), bmp.ctx.globalCompositeOperation = "destination-out", 
                        drawSector(), bmp.ctx.stroke();
                    }
                }
            }
        }
    };
};

isNode ? module.exports = circle_sectors() : define("circle_sectors", circle_sectors);