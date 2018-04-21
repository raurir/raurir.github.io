"use strict";

var perlin_leaves = function(perlin) {
    !function(c) {
        var t = {}, f = function() {
            return new Date().getTime();
        };
    }(console);
    var pixel = 10, w = 40, h = 40, c = (Math.random, document.createElement("canvas"));
    c.width = w * pixel, c.height = h * pixel;
    var ctx = c.getContext("2d"), logger = document.createElement("div");
    document.body.appendChild(logger);
    var channelRed = perlin.noise(w, h), seed = 1e3 * Math.random();
    function drawIt(time) {
        for (var red = channelRed.cycle(seed + .01 * time, .01), i = 0, il = w * h; i < il; i++) {
            var xp = i % w, yp = Math.floor(i / w), dx = xp - w / 2, dy = yp - h / 2, d = w / 2 - Math.sqrt(dx * dx + dy * dy), r = ~~(255 * red[i] * d);
            ctx.fillStyle = "rgb(" + r + "," + r + "," + r + ")", ctx.fillRect(xp * pixel, yp * pixel, pixel, pixel);
        }
        requestAnimationFrame(drawIt);
    }
    return {
        init: function() {
            drawIt(0);
        },
        stage: c
    };
};

define("perlin_leaves", [ "perlin" ], perlin_leaves);