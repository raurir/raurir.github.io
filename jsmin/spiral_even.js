"use strict";

var sw = 600, sh = 600, bmp = dom.canvas(sw, sh);

document.body.appendChild(bmp.canvas);

var h = 0, cx = sw / 2, cy = sh / 2, frame = 0;

function newLine() {
    bmp.ctx.clearRect(0, 0, sw, sh);
    var dotsPerRing = 10 + 4 * Math.sin(4e-4 * frame), ring = 20 + 4 * Math.sin(.001 * frame);
    function getArc(point) {
        var perc = point / dotsPerRing, angle = perc * Math.PI * 2, radius = perc * ring;
        return {
            x: cx + Math.sin(angle) * radius,
            y: cy + Math.cos(angle) * radius
        };
    }
    bmp.ctx.beginPath(), bmp.ctx.strokeStyle = "red", bmp.ctx.lineWidth = .7 * ring;
    for (var h = 0; h < 25 * dotsPerRing; h++) {
        var point = getArc(h - 1);
        0 == h ? bmp.ctx.moveTo(point.x, point.y) : bmp.ctx.lineTo(point.x, point.y);
    }
    bmp.ctx.stroke(), (frame += 1) < 50 && requestAnimationFrame(newLine);
}

newLine();