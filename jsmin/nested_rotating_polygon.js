"use strict";

var posJump, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
}, isNode = "undefined" != typeof module;

isNode ? (con = console, dom = require("./dom.js"), geom = require("./geom.js"), 
rand = require("./rand.js"), Ease = require("../lib/robertpenner/ease.js"), progress = function() {
    return fs = require("fs");
}, saveFile = function(canvas, frame, cb) {
    var filename = "/../export/" + (1 == String(frame).length ? "0" : "") + frame + ".png";
    canvas.toBuffer(function(err, buf) {
        err ? con.log("saveFile err", err) : fs.writeFile(__dirname + filename, buf, function() {
            con.log("saveFile success", void 0 === buf ? "undefined" : _typeof(buf), __dirname + filename), 
            cb();
        });
    });
}, posJump = .02) : posJump = .005;

var nested_rotating_polygon = function() {
    var size, sides, depthMax, TAU = 2 * Math.PI, bmp = dom.canvas(1, 1), ctx = bmp.ctx, pos = 0, half = 0, BLACK = "#000", WHITE = "#fff", frame = 0;
    function render() {
        frame++, ctx.fillStyle = depthMax % 2 ? BLACK : WHITE, ctx.fillRect(0, 0, size, size), 
        function create(parent) {
            var depth = parent.depth + 1;
            var points = [];
            if (parent.points) {
                var progress = Ease.easeInOutQuart(pos, 0, 1, 1) + half;
                for (i = 0; i < sides; i++) {
                    var point0 = parent.points[i], point1 = parent.points[(i + 1) % sides], p = geom.lerp({
                        x: point0.x,
                        y: point0.y
                    }, {
                        x: point1.x,
                        y: point1.y
                    }, progress / 2), xp = p.x, yp = p.y;
                    points.push(p);
                }
            } else for (i = 0; i < sides; i++) {
                var angle = i / sides * TAU + TAU / 4, xp = size / 2 + size / 2 * .98 * Math.cos(angle), yp = size / 2 + size / 2 * .98 * Math.sin(angle);
                points.push({
                    x: xp,
                    y: yp
                });
            }
            ctx.fillStyle = depth % 2 ? BLACK : WHITE;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.strokeStyle = "0";
            for (var i = 0; i < sides; i++) {
                var xp = points[i].x, yp = points[i].y;
                0 == i ? ctx.moveTo(xp, yp) : ctx.lineTo(xp, yp);
            }
            ctx.closePath();
            depth === depthMax && ctx.stroke();
            ctx.fill();
            depth < depthMax && create({
                depth: depth,
                points: points
            });
        }({
            depth: 0
        }), 1 <= (pos += posJump) && (pos = 0, half++, half %= 2), isNode ? saveFile(bmp.canvas, frame, function() {
            frame < 1 / posJump * 2 ? render() : con.log("stopping - frame:", frame, "pos:", pos);
        }) : requestAnimationFrame(render);
    }
    return {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size, bmp.setSize(size, size), sides = 3, depthMax = 6, progress("render:complete", bmp.canvas), 
            render();
        }
    };
};

isNode ? (module.exports = exp = nested_rotating_polygon(), con.log(exp), exp.init({
    size: 700
})) : define("nested_rotating_polygon", nested_rotating_polygon);