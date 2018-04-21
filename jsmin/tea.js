"use strict";

var Canvas, fs, isNode = "undefined" != typeof module;

isNode && (Canvas = require("canvas"));

var con = console, w = 500, sum = 1e3, v0 = 0, v1 = 0;

function createCanvas(w, h) {
    var c;
    return isNode ? c = new Canvas(w, h) : ((c = document.createElement("canvas")).width = w, 
    c.height = h), {
        canvas: c,
        ctx: c.getContext("2d")
    };
}

var bmp = createCanvas(w, w), pixels = bmp.ctx.getImageData(0, 0, w, w);

document.body.appendChild(bmp.canvas);

for (var i = 0; i < w * w; i++) {
    v1 += 2911926141 + ((v0 += 2738958700 + (v1 << 4) ^ v1 + (sum += 2654435769) ^ 3355524772 + (v1 >> 5)) << 4) ^ v0 + sum ^ 2123724318 + (v0 >> 5);
    var index = 4 * i, r = Math.abs(v0) % 255, g = 0, b = Math.abs(v1) % 255;
    pixels.data[index + 0] = r, pixels.data[index + 1] = g, pixels.data[index + 3] = b, 
    pixels.data[index + 4] = 255;
}

bmp.ctx.putImageData(pixels, 0, 0), "undefined" != typeof module && (module.exports = {
    generate: generate
});