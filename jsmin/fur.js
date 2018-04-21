"use strict";

define("fur", [ "perlin" ], function(perlin) {
    for (var pixel = 4, furSize = 20, w = 160, h = 160, sw = w * pixel, sh = h * pixel, c = dom.canvas(sw, sh), d = c.ctx, channelX = perlin.noise(w, h), channelY = perlin.noise(w, h), distort = [], i = 0, il = w * h; i < il; i++) {
        var r = rand.getInteger(125, 145), g = rand.getInteger(105, 125), b = rand.getInteger(75, 95);
        distort.push({
            x: 4 * rand.getNumber(-1, 1),
            y: 4 * rand.getNumber(-1, 1),
            colour: "rgba(" + r + "," + g + "," + b + ",0.5)"
        });
    }
    function drawIt(time) {
        requestAnimationFrame(drawIt);
        var t = .002 * time, leanX = channelX.cycle(t, .004), leanY = channelY.cycle(t, .004);
        d.fillStyle = "black", d.fillRect(0, 0, sw, sh);
        for (var i = 0, il = w * h; i < il; i++) {
            var xi = i % w, yi = Math.floor(i / w), lx = leanX[i] - .5, ly = leanY[i] - .5, x = (distort[i].x + xi + .5) * pixel, y = (distort[i].y + yi + .5) * pixel;
            d.strokeStyle = distort[i].colour, d.beginPath(), d.moveTo(x, y), d.lineTo(x + 15 + lx * furSize, y + 5 + ly * furSize), 
            d.stroke();
        }
    }
    return {
        resize: function(w, h) {
            c.setSize(w, h, !0);
        },
        init: function() {
            drawIt(0);
        },
        stage: c.canvas
    };
});