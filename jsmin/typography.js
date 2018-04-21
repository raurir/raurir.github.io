"use strict";

var con = console, isNode = "undefined" != typeof module;

if (isNode) var rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var typography = function() {
    var size, sw, sh, block, settings = {
        boxes: {
            label: "Boxes",
            min: 2,
            max: 64,
            cur: 4,
            type: "Number"
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !1
        }
    }, bmp = dom.canvas(100, 100), ctx = bmp.ctx, rows = 4, cols = 4;
    function typoInteger(min, max) {
        return Math.round(rand.getNumber(min, max));
    }
    for (var numerals = [], numeralsLength = typoInteger(1, 5), n = 0; n++ < numeralsLength; ) numerals.push(typoInteger(0, 9));
    function drawBlock(x, y) {
        if (ctx.save(), ctx.translate(x * block, y * block), .6 < rand.random()) {
            var w = typoInteger(1, 3), h = typoInteger(1, 3);
            ctx.fillStyle = colours.getRandomColour(), ctx.fillRect(0, 0, block * w, block * h);
        }
        try {
            .8 < rand.random() && (border = .1 * block, ctx.fillStyle = colours.getRandomColour(), 
            ctx.fillRect(border, border, block - 2 * border, block - 2 * border));
        } catch (err) {
            con.log("err drawInnerBlock", err);
        }
        var border, angle, xo, yo, fontSize;
        try {
            .9 < rand.random() && function() {
                for (var divs = Math.pow(2, Math.ceil(3 * rand.random())), size = block / divs, i = 0; i < divs * divs; i++) {
                    var x = i % divs, y = Math.floor(i / divs);
                    ctx.fillStyle = colours.getRandomColour(), ctx.fillRect(x * size, y * size, size, size);
                }
            }();
        } catch (err) {
            con.log("err drawSubdivion", err);
        }
        try {
            .9 < rand.random() && function() {
                var rotation = Math.round(4 * rand.random()) / 4 * Math.PI, rowSize = Math.round((2 + Math.floor(8 * rand.random())) * size / 1e3), patternColoured = dom.canvas(rowSize, 2 * rowSize);
                ctx.save(), ctx.beginPath(), ctx.rect(0, 0, block, block), ctx.rotate(rotation), 
                patternColoured.ctx.fillStyle = colours.getNextColour();
                for (var py = 0; py < block / rowSize * 4; py++) patternColoured.ctx.fillRect(0, py * rowSize * 2, block * rowSize, rowSize);
                ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat"), ctx.fill(), 
                ctx.restore();
            }();
        } catch (err) {
            con.log("err drawPattern", err);
        }
        try {
            .8 < rand.random() && function() {
                ctx.save();
                var angle = Math.floor(4 * rand.random()) / 4;
                ctx.rotate(angle * Math.PI * 2);
                var majors = Math.pow(2, typoInteger(1, 4)), minors = typoInteger(1, 4), majorSize = typoInteger(5, 10) * size / 400, minorSize = majorSize * rand.getNumber(.2, .8);
                ctx.fillStyle = colours.getRandomColour();
                for (var width = 1 * size / 300, m = 0; m < majors; m++) {
                    var x = m / majors * block;
                    ctx.fillRect(x, 0, width, majorSize);
                    for (var n = 0; n < minors; n++) {
                        var xn = x + n / minors * block / majors;
                        ctx.fillRect(xn, 0, width, minorSize);
                    }
                }
                ctx.restore();
            }();
        } catch (err) {
            con.log("err drawRuler", err);
        }
        try {
            .4 < rand.random() && (angle = Math.floor(4 * rand.random()) / 4, xo = rand.random() * block, 
            yo = rand.random() * block, fontSize = Math.round(Math.pow(2, 2 + 6 * rand.random()) * size / 400), 
            ctx.rotate(angle * Math.PI * 2), ctx.translate(xo, yo), ctx.font = fontSize + "px Helvetica", 
            ctx.fillStyle = colours.getRandomColour(), ctx.fillText(function() {
                var strings = [ "Typography", numerals ], str = strings[Math.floor(rand.random() * strings.length)], ss = Math.round(rand.random() * str.length), se = ss + Math.round(rand.random() * (str.length - ss));
                switch (str = str.substr(ss, se), Math.floor(3 * rand.random())) {
                  case 0:
                    str = str.toLowerCase();
                    break;

                  case 1:
                    str = str.toUpperCase();
                }
                return str;
            }(), 0, 0));
        } catch (err) {
            con.log("err drawText", err);
        }
        ctx.restore();
    }
    function init(options) {
        size = options.size, sh = sw = size, settings.background.cur = !1, settings.boxes.cur = 4, 
        options.settings && (settings = options.settings), progress("settings:initialised", settings), 
        cols = settings.boxes.cur, rows = settings.boxes.cur, block = Math.ceil(1 / cols * size), 
        bmp.setSize(sw, sh), ctx.clearRect(0, 0, sw, sh), colours.getRandomPalette(), colours.setPaletteRange(3), 
        render();
    }
    function render() {
        settings.background.cur && (ctx.fillStyle = colours.getCurrentColour(), ctx.fillRect(0, 0, sw, sh)), 
        function renderBatch(batch) {
            var total = rows * cols;
            var x = batch % cols;
            var y = Math.floor(batch / cols);
            drawBlock(x, y);
            batch < total ? (progress("render:progress", batch / total), setTimeout(function() {
                renderBatch(batch + 1);
            }, 5)) : progress("render:complete", bmp.canvas);
        }(0);
    }
    return numerals = numerals.join(""), {
        stage: bmp.canvas,
        init: init,
        render: render,
        settings: settings,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
};

isNode ? module.exports = typography() : define("typography", typography);