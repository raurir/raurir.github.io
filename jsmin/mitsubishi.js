"use strict";

var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
}, con = console, dom = require("./dom.js"), fs = require("fs"), size = 300, centre = size / 2, gridY = 12, gridX = 4 * gridY, thirty = Math.PI / 6, sinThirty = Math.sin(thirty), cosThirty = Math.cos(thirty), c = dom.canvas(size, size), ctx = c.ctx, unit = 90, saveFile = function(canvas, frame, cb) {
    var filename = "/../export/" + (1 == String(frame).length ? "0" : "") + frame + ".png";
    canvas.toBuffer(function(err, buf) {
        err ? con.log("saveFile err", err) : fs.writeFile(__dirname + filename, buf, function() {
            con.log("saveFile success", void 0 === buf ? "undefined" : _typeof(buf), __dirname + filename), 
            cb();
        });
    });
}, draw = function(x, y) {
    var drawLeaf = function(angle) {
        ctx.save(), ctx.translate(x, y), ctx.rotate(angle), ctx.beginPath(), ctx.moveTo(0, 0), 
        ctx.lineTo(sinThirty * unit, cosThirty * unit), ctx.lineTo(0, cosThirty * unit * 2), 
        ctx.lineTo(-sinThirty * unit, cosThirty * unit), ctx.closePath(), ctx.fill(), ctx.restore();
    };
    drawLeaf(1 * thirty), drawLeaf(5 * thirty), drawLeaf(9 * thirty);
}, frames = 32, loops = 3, render = function render(frame) {
    var scale = Math.sin(frame / frames * Math.PI * 2 - Math.PI / 2) + 1.98;
    unit = 51;
    var angle = Math.floor(frame / frames) * Math.PI * 2 / 3 / 4;
    ctx.fillStyle = "#000", ctx.fillRect(0, 0, size, size), ctx.fillStyle = "#d11", 
    ctx.save(), ctx.translate(centre, centre), ctx.rotate(angle), ctx.translate(-centre, -centre);
    for (var gx = 0; gx++ < gridX; ) for (var gy = 0; gy++ < gridY; ) {
        draw(centre + (gx - gridX / 2) * cosThirty * unit * scale, centre + (gx % 2 * 3 + 6 * (gy - gridY / 2)) * sinThirty * unit * scale);
    }
    ctx.restore(), saveFile(c.canvas, frame, function() {
        ++frame < frames * loops && render(frame);
    });
};

render(0);