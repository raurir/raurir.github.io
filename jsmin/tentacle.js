"use strict";

define("tentacle", function() {
    var sw, sh, cx, cy, TAU = 2 * Math.PI, bmp = dom.canvas(1, 1), ctx = bmp.ctx, numLines = 7, lines = [], lineLength = 30;
    function createJoint(j, i) {
        var pos = 0, x = 0, y = 20 * i, rot = 0, rad = 2 + .3 * (lineLength - i);
        return {
            pos: pos,
            rot: rot,
            x: x,
            y: y,
            move: function(px, py) {
                return pos += .01, rot = j / numLines * TAU + .24 * Math.sin(pos) * (i + 1), x = px + 10 * Math.sin(rot), 
                y = py + 10 * Math.cos(rot), ctx.fillStyle = "rgba(200, 160, 130, 0.3)", ctx.beginPath(), 
                ctx.drawCircle(cx + x, cy + y, rad), ctx.fill(), {
                    x: x,
                    y: y
                };
            }
        };
    }
    function render(time) {
        time < 1e4 && requestAnimationFrame(render), ctx.fillStyle = "black", ctx.rect(0, 0, sw, sh), 
        ctx.fill();
        for (var j = 0; j < numLines; j++) for (var p = {
            x: 0,
            y: 0
        }, i = 0; i < lineLength; i++) {
            p = lines[j][i].move(p.x, p.y);
        }
    }
    return {
        stage: bmp.canvas,
        init: function(options) {
            cx = (sw = 400) / 2, cy = (sh = 400) / 2, bmp.setSize(sw, sh);
            for (var j = 0; j < numLines; j++) {
                for (var line = [], i = 0; i < lineLength; i++) line.push(createJoint(j, i));
                lines.push(line);
            }
            render(0);
        }
    };
});