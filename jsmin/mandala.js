"use strict";

var isNode = "undefined" != typeof module, mandala = function() {
    var sw, sh, centre, spokes, settings = {
        spread: {
            type: "Number",
            label: "Spread",
            min: 1,
            max: 10,
            cur: 10
        }
    }, TAU = 2 * Math.PI, stage = dom.canvas(1, 1);
    stage.ctx;
    function init(options) {
        size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
        centre = sh / 2;
        var palette = colours.getRandomPalette();
        con.log("Mandala init", palette), spokes = 2 * rand.getInteger(2, 40), settings.spread.cur = 10, 
        options.settings && (settings = options.settings), progress("settings:initialised", settings), 
        render();
    }
    function render() {
        var spread = settings.spread.cur / settings.spread.max;
        con.log("spread", spread);
        var a = 1 / spokes * TAU, maxR = Math.sqrt(.5), r = maxR * size, bgColour = colours.getRandomColour(), masker = dom.canvas(sw, sh);
        masker.ctx.translate(2, 2), masker.ctx.lineCap = "flat", masker.ctx.beginPath(), 
        masker.ctx.moveTo(0, 0), masker.ctx.lineTo(Math.sin(0) * r, Math.cos(0) * r), masker.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r), 
        masker.ctx.lineTo(0, 0), masker.ctx.fillStyle = "red", masker.ctx.strokeStyle = "red", 
        masker.ctx.lineWidth = 2, masker.ctx.stroke();
        var pattern = dom.canvas(sw, sh);
        pattern.ctx.translate(2, 2), pattern.ctx.beginPath(), pattern.ctx.moveTo(0, 0), 
        pattern.ctx.lineTo(Math.sin(0) * r, Math.cos(0) * r), pattern.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r), 
        pattern.ctx.lineTo(0, 0), pattern.ctx.fillStyle = bgColour, pattern.ctx.strokeStyle = bgColour, 
        pattern.ctx.lineWidth = 2, pattern.ctx.stroke(), pattern.ctx.fill(), document.body.appendChild(masker.canvas), 
        document.body.appendChild(pattern.canvas);
        var max = 7;
        function sorter(a, b) {
            return a < b ? -1 : 1;
        }
        var bandSets = rand.getInteger(0, max);
        max -= bandSets;
        var regionSets = 2, circleSets = max -= regionSets;
        con.log(bandSets, regionSets, circleSets), function() {
            for (var regionSizes = {
                left: [],
                right: []
            }, i = 0; i < regionSets; i++) regionSizes.left.push(rand.random()), regionSizes.right.push(rand.random());
            for (regionSizes.left.sort(sorter), regionSizes.right.sort(sorter), i = 0; i < regionSets - 1; i++) {
                pattern.ctx.fillStyle = colours.getNextColour();
                var x0 = Math.sin(0) * regionSizes.left[i], y0 = Math.cos(0) * regionSizes.left[i], x1 = Math.sin(a) * regionSizes.right[i], y1 = Math.cos(a) * regionSizes.right[i], x2 = Math.sin(a) * regionSizes.right[i + 1], y2 = Math.cos(a) * regionSizes.right[i + 1], x3 = Math.sin(0) * regionSizes.left[i + 1], y3 = Math.cos(0) * regionSizes.left[i + 1];
                pattern.ctx.beginPath(), pattern.ctx.moveTo(x0 * r, y0 * r), pattern.ctx.lineTo(x1 * r, y1 * r), 
                pattern.ctx.lineTo(x2 * r, y2 * r), pattern.ctx.lineTo(x3 * r, y3 * r), pattern.ctx.closePath(), 
                pattern.ctx.fill(), pattern.ctx.strokeStyle = "black", pattern.ctx.stroke();
                var points = [ {
                    x: x0,
                    y: y0
                }, {
                    x: x1,
                    y: y1
                }, {
                    x: x2,
                    y: y2
                }, {
                    x: x3,
                    y: y3
                } ], insetPoints = geom.insetPoints(points, -.01);
                if (con.log("duble", points, insetPoints), insetPoints) {
                    for (pattern.ctx.beginPath(), pattern.ctx.fillStyle = colours.getNextColour(), i = 0; i < insetPoints.length; i++) {
                        var p = insetPoints[i];
                        pattern.ctx[0 == i ? "moveTo" : "lineTo"](p.x * r, p.y * r);
                    }
                    pattern.ctx.fill();
                }
            }
        }();
        for (var i = 0; i < spokes; i++) stage.ctx.save(), i % 2 == 1 ? (stage.ctx.scale(-1, 1), 
        stage.ctx.translate(-centre, centre), stage.ctx.rotate((i - 1) * a)) : (stage.ctx.translate(centre, centre), 
        stage.ctx.rotate(i * a)), stage.ctx.drawImage(pattern.canvas, -2, -2), stage.ctx.restore();
    }
    var experiment = {
        init: init,
        render: render,
        settings: settings,
        stage: stage.canvas,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
    return progress("render:complete", stage.canvas), experiment;
};

isNode ? module.exports = mandala() : define("mandala", mandala);