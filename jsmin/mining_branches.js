"use strict";

var mining_branches = function() {
    var bmp, fgColour = colours.getRandomColour(), bgColour = colours.getNextColour(), planets = 200, size = 400;
    var canvases = dom.element("div");
    return {
        stage: canvases,
        resize: function(sw, sh) {},
        init: function() {
            for (;canvases.childNodes.length; ) canvases.removeChild(canvases.childNodes[0]);
            seed = ~~(1e9 * rand.random()), colours.getRandomPalette(), fgColour = colours.getRandomColour(), 
            bgColour = colours.getNextColour(), function(scale) {
                var sw = size * scale, sh = sw;
                (bmp = dom.canvas(sw, sh)).canvas.setSize(sw / scale, sh / scale);
                var i, j, lastPlanet, ctx = bmp.ctx, cx = (Math.PI, .5), cy = .5, arrPlanets = [], arrRings = [ [] ], ringIndex = 0, diameter = .01, ringSize = .01, rotation = 0, attempts = 0, settings = {
                    increaseMutation: .5 < rand.random(),
                    drawNodes: .5 < rand.random(),
                    straight: .5 < rand.random(),
                    megaNodes: .5 < rand.random(),
                    megaSubNodes: .5 < rand.random(),
                    constantMegaNodeSize: .5 < rand.random(),
                    constantMegaSubNodeSize: .5 < rand.random()
                };
                function createPlanet(index, planet) {
                    planet.index = index, lastPlanet = planet, arrPlanets[index] = planet, arrRings[ringIndex].push(planet);
                }
                function newPlanet(index) {
                    var planet = {
                        x: cx + Math.sin(rotation) * diameter + .05 * (rand.random() - .5),
                        y: cy + Math.cos(rotation) * diameter + .05 * (rand.random() - .5),
                        rotation: rotation,
                        distance: diameter
                    }, ok = !0, lastDistance = 1e7;
                    for (i = arrPlanets.length - 1; -1 < i && ok; ) {
                        var other = arrPlanets[i], dx = planet.x - other.x, dy = planet.y - other.y, distance = Math.sqrt(dx * dx + dy * dy);
                        distance < .04 ? ok = !1 : (lastDistance = Math.min(distance, lastDistance)) == distance && (planet.closest = arrPlanets[i]), 
                        i--;
                    }
                    planet.x == lastPlanet.x && planet.y == lastPlanet.y && (ok = !1), ok ? (attempts = 0, 
                    settings.increaseMutation ? planet.mutationRate = 1.04 * planet.closest.mutationRate : planet.mutationRate = .9 * planet.closest.mutationRate, 
                    planet.colour = colours.mutateColour(planet.closest.colour, planet.mutationRate), 
                    createPlanet(index, planet)) : (attempts < 40 ? rotation += 20 * rand.random() + Math.atan(1 / diameter) : (arrRings[++ringIndex] = [], 
                    diameter += rand.random() * ringSize + .0025), attempts++, newPlanet(index));
                }
                function drawNode(planet, xp, yp) {
                    var closest = planet.closest, colour = closest ? closest.colour : planet.colour, size = 1 - planet.distance;
                    if (settings.drawNodes) {
                        var radius = size * scale * 5;
                        ctx.beginPath(), ctx.fillStyle = colour, ctx.drawCircle(planet.x * sw, planet.y * sh, radius), 
                        ctx.fill();
                    }
                    if (closest) {
                        if (ctx.beginPath(), ctx.lineWidth = Math.pow(1.1, 6 * size) * scale, ctx.strokeStyle = colour, 
                        ctx.lineCap = "round", ctx.moveTo(xp * sw, yp * sh), settings.straight) ctx.lineTo(closest.x * sw, closest.y * sh); else if (closest.closest) {
                            var phx = closest.x + (closest.closest.x - closest.x) / 2, phy = closest.y + (closest.closest.y - closest.y) / 2, nx = closest.x + (closest.x - phx), ny = closest.y + (closest.y - phy);
                            ctx.quadraticCurveTo(nx * sw, ny * sh, closest.x * sw, closest.y * sh);
                        } else {
                            var hx = closest.x + (xp - closest.x) / 2, hy = closest.y + (yp - closest.y) / 2;
                            ctx.quadraticCurveTo(hx * sw, hy * sh, closest.x * sw, closest.y * sh);
                        }
                        ctx.stroke();
                    }
                }
                function drawInnerNode(planet, xp, yp) {
                    var radius = (1 - planet.distance) * scale * 5;
                    settings.megaNodes && (ctx.beginPath(), ctx.fillStyle = bgColour, ctx.drawCircle(planet.x * sw, planet.y * sh, .7 * radius * (settings.constantMegaNodeSize ? 1 : rand.random())), 
                    ctx.fill(), settings.megaSubNodes && .5 < rand.random() && (ctx.beginPath(), ctx.fillStyle = planet.colour, 
                    ctx.drawCircle(planet.x * sw, planet.y * sh, .9 * radius * (settings.constantMegaSubNodeSize ? 1 : rand.random())), 
                    ctx.fill()));
                }
                for (createPlanet(0, {
                    x: cx,
                    y: cy,
                    distance: 0,
                    rotation: 0,
                    colour: fgColour,
                    mutationRate: 10
                }), j = 1; j < planets; ) newPlanet(j), j++;
                !function() {
                    ctx.fillStyle = bgColour, ctx.fillRect(0, 0, sw, sh);
                    for (var j = arrPlanets.length - 1; -1 < j; ) drawNode(planet = arrPlanets[j], planet.x, planet.y), 
                    j--;
                    if (settings.megaNodes) for (j = arrPlanets.length - 1; -1 < j; ) {
                        var planet;
                        drawInnerNode(planet = arrPlanets[j], planet.x, planet.y), j--;
                    }
                }(), canvases.appendChild(bmp.canvas);
            }(1);
        }
    };
};

isNode ? module.exports = mining_branches() : define("mining_branches", mining_branches);