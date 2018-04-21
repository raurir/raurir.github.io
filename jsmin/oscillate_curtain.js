"use strict";

var sw = 600, sh = 600;

function genRan(min, max) {
    return Math.random() * (max - min) + min;
}

var o, oscs = [], oscillators = 15;

for (o = 0; o < oscillators; o++) oscs[o] = [], oscs[o][0] = genRan(0, .1), oscs[o][1] = genRan(0, .1), 
oscs[o][2] = genRan(0, .1), oscs[o][3] = genRan(0, .1);

function getOsc(i, a, range) {
    var temp = 0;
    for (o = 0; o < oscillators; o++) temp += Math.sin(i * oscs[o][a]) * range;
    return temp /= oscillators;
}

var bmp = dom.canvas(sw, sh);

document.body.appendChild(bmp.canvas);

var h = 0, xRange = 30, yRange = 30, xGap = sw / xRange * 1, yGap = sh / yRange * 1, xHalf = xRange / 2, yHalf = yRange / 2, frame = 0;

function newLine() {
    bmp.ctx.clearRect(0, 0, sw, sh);
    for (var h = 0; h < yRange; h++) for (var v = 0; v < xRange; v++) {
        0;
        var xyIndex = v + h, xy = frame + xyIndex, xpos = (v + .5) * xGap + getOsc(xy, 2, 15), ypos = (h + .5) * yGap + getOsc(xy, 3, 15);
        bmp.ctx.fillStyle = "#000", bmp.ctx.fillText(Math.round(xyIndex), xpos - 2, ypos - 2);
    }
    (frame += 1) < 5e9 && requestAnimationFrame(newLine);
}

newLine();