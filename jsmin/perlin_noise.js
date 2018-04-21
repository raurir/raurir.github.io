"use strict";

var perlin_noise = function(perlin) {
    !function(c) {
        var t = {}, f = function() {
            return new Date().getTime();
        };
    }(console);
    var pixel = 10, w = 60, h = 60, M = Math, c = (M.random, document.createElement("canvas"));
    c.width = w * pixel, c.height = h * pixel;
    var d = c.getContext("2d"), logger = document.createElement("div");
    document.body.appendChild(logger);
    var channelRed = perlin.noise(w, h), channelGreen = perlin.noise(w, h), channelBlue = perlin.noise(w, h), min = 1e3, max = -1e3;
    function drawIt(time) {
        for (var t = .005 * time, red = channelRed.cycle(t, .01), green = channelGreen.cycle(t, .01), blue = channelBlue.cycle(t, .01), i = 0, il = w * h; i < il; i++) {
            var xp = i % w, yp = Math.floor(i / w), r = ~~(255 * red[i]), g = ~~(255 * green[i]), b = ~~(255 * blue[i]);
            d.fillStyle = "rgb(" + r + "," + g + "," + b + ")", d.fillRect(xp * pixel, yp * pixel, pixel, pixel), 
            min = M.min(r, min), max = M.max(r, max), min = M.min(g, min), max = M.max(g, max), 
            min = M.min(b, min), max = M.max(b, max);
        }
        logger.innerHTML = min + "<br>" + max, requestAnimationFrame(drawIt);
    }
    return {
        init: function() {
            drawIt(0);
        },
        stage: c
    };
};

define("perlin_noise", [ "perlin" ], perlin_noise);