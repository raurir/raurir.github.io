"use strict";

var isNode = "undefined" != typeof module, experiment_template = function() {
    Math.PI;
    var sw, cx, cy, stage = dom.canvas(1, 1), ctx = stage.ctx;
    var experiment = {
        stage: stage.canvas,
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
            cx = sw / 2, cy = sh / 2, ctx.clearRect(0, 0, sw, sh), ctx.fillStyle = "#0f0", ctx.fillRect(cx - 20, cy - 20, 40, 40);
        }
    };
    return progress("render:complete", stage.canvas), experiment;
};

isNode ? module.exports = experiment_template() : define("experiment_template", experiment_template);