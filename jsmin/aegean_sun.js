"use strict";

define("aegean_sun", [ "perlin" ], function(perlin) {
    var sw = window.innerWidth, sh = window.innerHeight, w = 400, h = 400, channelX = perlin.noise(w, h), channelY = perlin.noise(w, h), cols = (rand.getInteger(100, 300), 
    rand.getInteger(4, 10), Math.floor(sw * sh / 200), colours.getRandomPalette()), canvas = dom.canvas(sw, sh), ctx = canvas.ctx;
    return {
        init: function() {
            var bg = colours.getRandomColour();
            cols.splice(cols.indexOf(bg), 1), ctx.fillStyle = bg, ctx.fillRect(0, 0, sw, sh), 
            ctx.strokeStyle = colours.getNextColour(), function(t) {
                var noiseX = channelX.cycle(100 * Math.random(), .005), noiseY = channelY.cycle(100 * Math.random(), .004), segments = 20;
                function recurse(line, offset) {
                    for (var segments = line.length, nextLine = [], i = 0; i < segments; i++) {
                        var p = {
                            x: line[i].x + offset.x,
                            y: line[i].y + offset.y
                        }, noiseIndex = Math.floor(p.y * w + p.x), x = 2 * (noiseX[noiseIndex] - .5), y = 0 * (noiseY[noiseIndex] - .5);
                        p.x += x, p.y += y, nextLine.push(p);
                    }
                    return renderLine(nextLine), nextLine;
                }
                function renderLine(line) {
                    var segments = line.length;
                    ctx.beginPath();
                    for (var i = 0; i < segments; i++) {
                        var p = line[i];
                        0 == i ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
                    }
                    ctx.stroke();
                }
                for (var line = function() {
                    for (var p0 = {
                        x: rand.getNumber(.4, .6) * w,
                        y: 0 * h
                    }, p1 = {
                        x: rand.getNumber(.4, .6) * w,
                        y: 1 * h
                    }, line = [], i = 0; i < segments; i++) {
                        var p = geom.lerp(p0, p1, i / segments);
                        line.push(p);
                    }
                    return renderLine(line), line;
                }(), next = line, prev = line, i = 0; i < 40; i++) next = recurse(next, {
                    x: 4,
                    y: 0
                }), prev = recurse(prev, {
                    x: -4,
                    y: 0
                });
            }();
        },
        stage: canvas.canvas
    };
});