"use strict";

var isNode = "undefined" != typeof module, experiment_template_babel = function() {
    var stage = dom.canvas(1, 1), canvas = stage.canvas, ctx = stage.ctx, sw = void 0, sh = void 0, size = void 0, init = function(options) {
        size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
        colours.getRandomPalette(), render();
    }, render = function() {
        ctx.fillRect(0, 0, sw, sh);
        for (var points = []; points.length < 4; ) points.push({
            x: rand.getNumber(.1, .9),
            y: rand.getNumber(.1, .9)
        });
        var intersects = geom.intersectionBetweenPoints.apply(null, points);
        intersects && points.push(intersects), points.forEach(function(p) {
            ctx.fillStyle = colours.getNextColour(), ctx.beginPath(), ctx.drawCircle(p.x * sw, p.y * sh, 15), 
            ctx.fill();
        });
    };
    return progress("render:complete", canvas), {
        init: init,
        render: render,
        settings: {},
        stage: canvas,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
};

isNode ? module.exports = experiment_template_babel() : define("experiment_template_babel", experiment_template_babel);