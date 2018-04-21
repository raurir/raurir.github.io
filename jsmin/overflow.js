"use strict";

var isNode = "undefined" != typeof module, overflow = function() {
    var sw, TAU = 2 * Math.PI, stage = dom.canvas(1, 1), ctx = stage.ctx, polys = [];
    function createPolygon() {
        for (var poly = {
            colour: colours.getRandomColour(),
            points: []
        }, sides = rand.getInteger(3, 17), radius = rand.getNumber(.1, .4), cx = rand.getNumber(0, 1), cy = rand.getNumber(0, 1), i = 0; i < sides; i++) {
            var angle = i / sides * TAU, x = cx + Math.sin(angle) * radius, y = cy + Math.cos(angle) * radius;
            poly.points.push({
                x: x,
                y: y
            });
        }
        polys.push(poly);
    }
    var experiment = {
        stage: stage.canvas,
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
            colours.getRandomPalette(), createPolygon(), createPolygon(), polys.forEach(function(poly) {
                ctx.strokeStyle = poly.colour, ctx.beginPath(), poly.points.forEach(function(_ref, i) {
                    var x = _ref.x, y = _ref.y, xs = x * sw, ys = y * sh;
                    i ? ctx.lineTo(xs, ys) : ctx.moveTo(xs, ys), con.log(xs, ys);
                }), ctx.closePath(), ctx.stroke();
            });
        }
    };
    return progress("render:complete", stage.canvas), experiment;
};

isNode ? module.exports = overflow() : define("overflow", overflow);