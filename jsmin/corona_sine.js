"use strict";

var isNode = "undefined" != typeof module, con = console;

if (isNode) var rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var corona_sine = function() {
    var size, sw, sh, stage, ctx, inner, colourLayers, lengthLayers, colourBG, oscillators, oscs, vector = !1, settings = {
        layers: {
            label: "Layers",
            min: 1,
            max: 30,
            cur: 0,
            type: "Number"
        },
        rays: {
            label: "Rays",
            min: 12,
            max: 312,
            cur: 0,
            type: "Number"
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !0
        }
    };
    if ("undefined" != typeof window && (sw = window.innerWidth, sh = window.innerHeight), 
    vector) stage = dom.svg("svg", {
        width: sw,
        height: sh
    }), inner = dom.svg("g"), stage.appendChild(inner), bmp = ctx = stage; else {
        var bmp = dom.canvas(100, 100);
        stage = bmp.canvas, ctx = bmp.ctx;
    }
    function renderLine(rotation, start, end, width, colour) {
        if (!(end - start < width / 4)) if (vector) {
            var d = [ "M", start, ",", -width, " L", end, -width, " C", end + 1.6 * width, ",", -width, " ", end + 1.6 * width, ",", width, " ", end, ",", width, " L", end, ",", width, " L", start, ",", width, " C", start - 1.6 * width, ",", width, " ", start - 1.6 * width, ",", -width, " ", start, ",", -width ].join(""), path = dom.svg("path", {
                d: d,
                fill: colour,
                transform: "translate(" + [ sw / 2, sh / 2 ] + ") rotate(" + 180 * rotation / Math.PI + ")"
            });
            inner.appendChild(path);
        } else ctx.save(), ctx.translate(sw / 2, sh / 2), ctx.rotate(rotation), ctx.beginPath(), 
        ctx.fillStyle = colour, ctx.moveTo(start, -width), ctx.lineTo(end, -width), ctx.arc(end, 0, width, -Math.PI / 2, Math.PI / 2, !1), 
        ctx.lineTo(end, width), ctx.lineTo(start, width), ctx.arc(start, 0, width, Math.PI / 2, -Math.PI / 2, !1), 
        ctx.fill(), ctx.closePath(), ctx.restore();
    }
    function renderRay(frac, time, innerRadius, maxRadius, lineWidth) {
        for (var layers = settings.layers.cur, rotation = frac * Math.PI * 2, oscLength = function(rotation, time) {
            for (var t = 0, o = 0; o < oscillators; o++) t += (Math.sin(oscs[o].offset + time * oscs[o].speed + rotation * oscs[o].phase) + 1) / 2;
            return t / oscillators;
        }(rotation, time), l = 0; l < layers; l++) {
            renderLine(rotation, innerRadius + oscLength * maxRadius * lengthLayers[l] + 2 * lineWidth, innerRadius + oscLength * maxRadius * lengthLayers[l + 1] - 2 * lineWidth, lineWidth, colourLayers[l]);
        }
    }
    function render(time) {
        time || (time = 0), colours.getRandomPalette(), colourBG = colours.getRandomColour();
        var layers = settings.layers.cur, rays = settings.rays.cur;
        colourLayers = [], lengthLayers = [ 0 ];
        for (var l = 0; l < layers; l++) colourLayers.push(colours.getNextColour()), lengthLayers.push(rand.random());
        lengthLayers.sort(), lengthLayers[layers] = 1, oscillators = ~~(1 + 13 * rand.random()), 
        oscs = [];
        for (var o = 0; o < oscillators; o++) oscs.push({
            offset: rand.random() * Math.PI * 2,
            phase: ~~(6 * rand.random()),
            speed: .003 * rand.random()
        });
        settings.background.cur ? (ctx.fillStyle = colourBG, ctx.fillRect(0, 0, sw, sh)) : ctx.clearRect(0, 0, sw, sh);
        var minDimension = sh < sw ? sh : sw, innerRadius = minDimension / 2 * .2, maxRadius = minDimension / 2 * 1 - innerRadius, lineWidth = innerRadius * Math.tan(1 / rays / 2 * Math.PI * 2), batchSize = 100;
        !function renderBatch(batch) {
            var start = batch * batchSize, end = start + batchSize;
            rays < end && (end = rays);
            for (var i = start; i < end; i++) renderRay(i / rays, time, innerRadius, maxRadius, lineWidth);
            end < rays ? (progress("render:progress", end / rays), setTimeout(function() {
                renderBatch(batch + 1);
            }, 100)) : progress("render:complete", stage);
        }(0);
    }
    return {
        stage: stage,
        render: render,
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, bmp.setSize(sw, sh), 
            new Date().getTime(), settings.layers.cur = ~~(1 + 4 * rand.random()), settings.rays.cur = ~~(12 + 300 * rand.random()), 
            options.settings && (settings = options.settings), progress("settings:initialised", settings), 
            render(0);
        },
        settings: settings,
        update: function(s) {
            rand.random(), rand.random(), settings = s, render();
        }
    };
};

isNode ? module.exports = corona_sine() : define("corona_sine", corona_sine);