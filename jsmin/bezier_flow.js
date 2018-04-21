"use strict";

var con = console, isNode = "undefined" != typeof module;

if (isNode) var rand = require("./rand.js"), geom = require("./geom.js"), dom = require("./dom.js"), colours = require("./colours.js");

var bezier_flow = function() {
    var sw, sh, size, lines, sections, points, lineStyles, exponential, scalePerLine, settings = {
        renderlimit: {
            min: 1,
            max: Number.POSITIVE_INFINITY,
            cur: 1
        }
    }, bmp = dom.canvas(100, 100), ctx = bmp.ctx;
    function getPoint(d) {
        return points[(sections + d) % sections];
    }
    function createPoint(origin) {
        for (var cx = origin.cx || rand.random(), cy = origin.cy || rand.random(), gapScale = .7 * rand.random() / lines, gaps = [], total = 0, i = 0; i < lines; i++) {
            var gap = (.1 + rand.random()) * gapScale;
            gaps[i] = total, total += gap * (exponential ? .1 * Math.pow(2, 1 + .2 * i) : 1);
        }
        points.push({
            index: origin.index,
            cx: cx,
            cy: cy,
            a: null,
            total: total,
            gaps: gaps,
            angle: function() {
                var prev = getPoint(this.index - 1), next = getPoint(this.index + 1), dx = next.cx - prev.cx, dy = next.cy - prev.cy;
                this.a = -Math.atan(dy / dx) - (dx < 0 ? 0 : Math.PI);
            },
            move: function() {
                this.angle();
            },
            lines: function(i) {
                var r = gaps[i] - .2;
                return [ cx - Math.sin(this.a) * r, cy - Math.cos(this.a) * r ];
            }
        });
    }
    function render() {
        ctx.clearRect(0, 0, sw, sh), con.log("render ========================", settings.renderlimit.cur);
        for (var j = 0; j < settings.renderlimit.cur; j++) for (var i = 0, il = points.length; i < il; i++) {
            var p1 = getPoint(i - 1), p2 = getPoint(i);
            p2.move();
            var m1 = -Math.tan(p1.a), m2 = -Math.tan(p2.a), p1l = p1.lines(j), p2l = p2.lines(j), x1 = p1l[0], y1 = p1l[1], x2 = p2l[0], y2 = p2l[1], c1 = y1 - m1 * x1, c2 = y2 - m2 * x2, y1a = -.1 * m1 + c1, y1b = 1.1 * m1 + c1, y2a = -.1 * m2 + c2, y2b = 1.1 * m2 + c2, inter = geom.intersectionAnywhere({
                x: -.1,
                y: y1a
            }, {
                x: 1.1,
                y: y1b
            }, {
                x: -.1,
                y: y2a
            }, {
                x: 1.1,
                y: y2b
            });
            ctx.strokeStyle = lineStyles[j].strokeStyle, ctx.lineWidth = lineStyles[j].lineWidth * (scalePerLine ? .1 * (j + 1) : 1), 
            ctx.beginPath(), ctx.moveTo(x1 * size, y1 * size), ctx.quadraticCurveTo(inter.x * size, inter.y * size, x2 * size, y2 * size), 
            ctx.stroke();
        }
        con.log("render complete called"), progress("render:complete", bmp.canvas);
    }
    return {
        stage: bmp.canvas,
        init: function(options) {
            function baseLineWidth() {
                return 1 + 3 * rand.random();
            }
            con.log("init called", rand.getSeed()), size = options.size, sh = sw = size, bmp.setSize(sw, sh), 
            lines = rand.getInteger(100, 500), settings.renderlimit.max = lines, settings.renderlimit.cur = lines, 
            sections = rand.getInteger(3, 6), con.log("sections", sections), exponential = .5 < rand.random(), 
            scalePerLine = .5 < rand.random(), constantBaseLine = .5 < rand.random(), points = [], 
            lineStyles = [], colours.getRandomPalette();
            for (var fixedConstantBaseLine = baseLineWidth(), l = 0; l < lines; l++) lineStyles[l] = {
                strokeStyle: colours.getRandomColour(),
                lineWidth: constantBaseLine ? fixedConstantBaseLine : baseLineWidth()
            };
            for (var baseAngle = 1e-4 + rand.random() * Math.PI, angleVariance = 1 / sections * .1, p = 0; p < sections; p++) {
                var radius = .3 + .1 * rand.random(), a = baseAngle + (p / sections + rand.getNumber(-angleVariance, angleVariance)) * Math.PI * 2;
                createPoint({
                    index: p,
                    cx: .5 + Math.sin(a) * radius,
                    cy: .5 + Math.cos(a) * radius
                });
            }
            for (p = 0; p < sections; p++) points[p].angle();
            ctx.clearRect(0, 0, size, size), ctx.lineCap = "round", render();
        },
        settings: settings,
        render: render
    };
};

isNode ? module.exports = bezier_flow() : define("bezier_flow", bezier_flow);