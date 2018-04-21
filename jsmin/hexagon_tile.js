"use strict";

var con = console, isNode = "undefined" != typeof module;

if (isNode) var rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var hexagon_tile = function() {
    var spreadSeed;
    function getJitter() {
        return spreadSeed += 1.89127398, (Math.sin(spreadSeed) + Math.cos(2.12387891 * spreadSeed)) / 2 * .1;
    }
    var radiusOuter, strokeSize, radiusInner, smoothSize, randomHexes, hexagons, hexs, batches, stage, inner, size = 100, vector = !1, sw = size, sh = size, angle60 = 2 * Math.PI / 6, batchSize = 1e3, currentBatch = 0, settings = {
        spread: {
            type: "Number",
            label: "Spread",
            min: 1,
            max: 10,
            cur: 10
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !0
        }
    };
    function init(options) {
        spreadSeed = rand.getSeed(), .5 * rand.getLastRandom(), size = options.size, sw = options.sw || size, 
        sh = options.sh || size, stage.setSize(sw, sh), settings.spread.cur = 10, settings.background.cur = !0, 
        options.settings && (settings = options.settings), progress("settings:initialised", settings);
        colours.getRandomPalette();
        var backgroundColor = colours.getRandomColour();
        if (radiusOuter = (5 + 25 * rand.random()) / 1e3, strokeSize = rand.random() * rand.random() * rand.random() * radiusOuter, 
        radiusInner = radiusOuter - strokeSize + .01 * strokeSize, smoothSize = .01 + 10 * rand.random(), 
        vector) {
            for (;inner.firstChild; ) inner.removeChild(inner.firstChild);
            stage.setAttribute("style", "background-color:" + backgroundColor);
        } else settings.background.cur && (stage.ctx.fillStyle = backgroundColor, stage.ctx.fillRect(0, 0, size, size));
        for (var path = [], points = [], i = 0; i < 6; i++) {
            var angle = i * angle60, x = radiusInner * Math.cos(angle), y = radiusInner * Math.sin(angle);
            path[i] = (0 === i ? "M" : "L") + x + "," + y, points[i] = {
                x: x,
                y: y
            };
        }
        path.push("Z");
        var minHeight = radiusOuter * Math.sin(angle60), cols = Math.ceil(1 / radiusOuter / 3) + 1, rows = Math.ceil(1 / minHeight) + 1;
        hexagons = cols * rows, hexs = [];
        for (i = 0; i < hexagons; i++) {
            var hex, row = Math.floor(i / cols);
            x = (i % cols + (row % 2 == 0 ? .5 : 0)) * radiusOuter * 3, y = row * minHeight;
            if (vector) {
                var group = dom.svg("g");
                group.setAttribute("transform", "translate(" + x + "," + y + ")"), inner.appendChild(group), 
                hex = dom.svg("path", {
                    d: path.join(" ")
                }), group.appendChild(hex);
            } else hex = points;
            hexs[i] = {
                index: i,
                hex: hex,
                x: x,
                y: y,
                colour: null,
                rendered: !1
            };
        }
        randomHexes = rand.shuffle(hexs.slice()), render();
    }
    function batch() {
        var shouldRender = settings.spread.cur / settings.spread.max * 10;
        con.log("shouldRender", shouldRender);
        var loopStart = currentBatch * batchSize, loopEnd = loopStart + batchSize;
        hexagons < loopEnd && (loopEnd = hexagons);
        for (var h = loopStart; h < loopEnd; h++) {
            for (var colour, index = randomHexes[h].index, item = hexs[index], close = [], i = 0; i < hexagons; i++) if (i != h) {
                var otherItem = randomHexes[i];
                if (otherItem.rendered) {
                    var dx = item.x - otherItem.x, dy = item.y - otherItem.y;
                    Math.sqrt(dx * dx + dy * dy) < radiusOuter * smoothSize && close.push(otherItem.colour);
                }
            }
            if (colour = 0 < close.length ? colours.mixColours(close) : colours.getNextColour(), 
            vector) item.hex.setAttribute("style", "fill:" + colour); else {
                dx = item.x - .5 + getJitter(), dy = item.y - .5 + getJitter();
                if (Math.round(10 * Math.sqrt(dx * dx + dy * dy)) < shouldRender) {
                    stage.ctx.fillStyle = colour, stage.ctx.beginPath();
                    for (i = 0; i < 6; i++) {
                        var x = (item.x + item.hex[i].x) * size, y = (item.y + item.hex[i].y) * size;
                        0 === i ? stage.ctx.moveTo(x, y) : stage.ctx.lineTo(x, y);
                    }
                    stage.ctx.closePath(), stage.ctx.fill();
                }
            }
            hexs[index].rendered = !0, hexs[index].colour = colour;
        }
        ++currentBatch == batches ? progress("render:complete", experiment.stage) : (progress("render:progress", currentBatch / batches), 
        setTimeout(batch, 25));
    }
    function render() {
        batches = Math.ceil(hexagons / batchSize), currentBatch = 0, batch();
    }
    vector ? (stage = dom.svg("svg", {
        width: sw,
        height: sh
    }), inner = dom.svg("g"), stage.appendChild(inner)) : stage = dom.canvas(sw, sh);
    var experiment = {
        init: init,
        render: render,
        settings: settings,
        stage: vector ? stage : stage.canvas,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
    return experiment;
};

isNode ? module.exports = hexagon_tile() : define("hexagon_tile", hexagon_tile);