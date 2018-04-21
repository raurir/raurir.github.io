"use strict";

var con = console, isNode = "undefined" != typeof module;

if (isNode) var rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var text_grid = function() {
    var size, sw, sh, blockW, blockH, rows, cols, phrase, settings = {
        boxes: {
            label: "Boxes",
            min: 2,
            max: 64,
            cur: 7,
            type: "Number"
        },
        phrase: {
            label: "Phrase",
            cur: "D Q36RUCN    FGVNFVGQax6q2 b",
            type: "String"
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !0
        }
    }, bmp = dom.canvas(100, 100), ctx = bmp.ctx, widthOnHeight = .6;
    function drawBlock(index, x, y) {
        ctx.save(), ctx.translate(x * blockW, y * blockH);
        try {
            !function(index) {
                var str = phrase[index], xo = 0, yo = .8 * blockH, fontSize = .2 * size;
                ctx.font = fontSize + "px Helvetica";
                var gradient = ctx.createLinearGradient(0, -blockH, 0, 0);
                gradient.addColorStop(0, colours.getRandomColour()), gradient.addColorStop(1, colours.getRandomColour()), 
                ctx.fillStyle = gradient;
                var textDimensions = ctx.measureText(str).width;
                xo = (blockW - textDimensions) / 2, ctx.translate(xo, yo), ctx.fillText(str, 0, 0);
            }(index);
        } catch (err) {
            con.log("err drawText", err);
        }
        ctx.restore();
    }
    function init(options) {
        size = options.size, sh = sw = size, options.settings && (settings = options.settings), 
        progress("settings:initialised", settings), phrase = settings.phrase.cur, cols = settings.boxes.cur, 
        rows = Math.floor(phrase.length / cols), blockW = Math.ceil(1 / cols * size), blockH = Math.ceil(blockW / widthOnHeight), 
        bmp.setSize(sw, sh), ctx.clearRect(0, 0, sw, sh), colours.getRandomPalette(), colours.setPaletteRange(3), 
        render();
    }
    function render() {
        settings.background.cur, function renderBatch(batch) {
            var total = rows * cols;
            var x = batch % cols;
            var y = Math.floor(batch / cols);
            drawBlock(batch, x, y);
            batch < total - 1 ? (progress("render:progress", batch / total), setTimeout(function() {
                renderBatch(batch + 1);
            }, 1)) : progress("render:complete", bmp.canvas);
        }(0);
    }
    return {
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

isNode ? module.exports = text_grid() : define("text_grid", text_grid);