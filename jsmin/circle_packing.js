"use strict";

var isNode = "undefined" != typeof module;

if (isNode) var con = console, rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var circle_packing = function() {
    var sw, sh, TAU = 2 * Math.PI, cx = .5, cy = .5, bmp = dom.canvas(1, 1);
    var experiment = {
        stage: bmp.canvas,
        init: function(options) {
            console.time("process time");
            var size = options.size;
            sh = sw = size, bmp.setSize(sw, sh), colours.getRandomPalette(), bmp.ctx.clearRect(0, 0, sw, sh);
            var threads = 0, iterations = 0, circles = 0, gap = rand.getNumber(.001, .02);
            con.log("gap", gap);
            var minRadius = rand.getNumber(.001, .01), maxRadius = rand.getNumber(minRadius + .02, .5), maxDepth = rand.getInteger(1, 10), limitMaxRadius = rand.getInteger(0, 2), powerMaxRadius = rand.getNumber(.8, 3), limitMinRadius = rand.getInteger(0, 1);
            con.log("limitMaxRadius", limitMaxRadius), con.log("powerMaxRadius", powerMaxRadius), 
            con.log("limitMinRadius", limitMinRadius);
            var banding = .7 < rand.getNumber(), bandScale = rand.getInteger(4, 20), bandModulo = rand.getInteger(2, 10), alternatePunchOut = .7 < rand.getNumber(), progressTicker = 0, fakeProgress = .1;
            function attemptNextCircle(parent, attempt) {
                if (threads++, attempt++, progressTicker++, threadOutput.ctx.fillRect(progressTicker / 500, 0, 1, threads / 50), 
                circles % 100 == 0 && (fakeProgress -= .02 * (fakeProgress - 1), progress("render:progress", fakeProgress)), 
                attempt < 5e3) {
                    var delay = iterations % 100 ? 0 : 200;
                    delay ? setTimeout(function() {
                        attemptCircle(parent, attempt);
                    }, delay) : attemptCircle(parent, attempt);
                } else con.log("too many attempt");
            }
            function attemptCircle(parent, attempt, options) {
                var colour, depth, distance, dx, dy, other, r, radius, y, x;
                if (threads--, iterations++, parent) {
                    if (!parent.sites.length) return;
                    depth = parent.depth + 1;
                    var index = Math.floor(rand.random() * parent.sites.length);
                    switch (site = parent.sites.splice(index, 1)[0], x = site.x, y = site.y, dx = parent.x - x, 
                    dy = parent.y - y, distance = Math.sqrt(dx * dx + dy * dy), radius = parent.r - distance - gap, 
                    limitMaxRadius) {
                      case 1:
                        maxRadius = .01 + Math.pow(.5 - distance, powerMaxRadius);
                        break;

                      case 2:
                        maxRadius = .01 + Math.pow(distance, powerMaxRadius);
                    }
                    switch (limitMinRadius) {
                      case 1:
                        minRadius = .1 * maxRadius;
                    }
                    if (r = rand.random() * radius, maxRadius < r ? r = maxRadius : r < minRadius && (r = minRadius), 
                    options && (options.r && (r = options.r), options.x && (x = options.x), options.y && (y = options.y)), 
                    r - gap < minRadius) return attemptNextCircle(parent, attempt);
                    for (var ok = !0, i = 0, il = parent.children.length; i < il && ok; i++) {
                        other = parent.children[i], dx = x - other.x, dy = y - other.y, distance = Math.sqrt(dx * dx + dy * dy);
                        var distanceCombined = r + other.r + gap;
                        distance < distanceCombined && (r = distance - other.r - gap) < minRadius && (ok = !1);
                    }
                    if (!1 === ok) return attemptNextCircle(parent, attempt);
                } else x = cx, y = cy, r = .5, depth = 0;
                if (options && options.colour) colour = options.colour; else for (colour = colours.getRandomColour(); parent && parent.colour == colour; ) colour = colours.getNextColour();
                alternatePunchOut && (bmp.ctx.globalCompositeOperation = (depth + 1) % 2 ? "destination-out" : "source-over"), 
                bmp.ctx.beginPath(), bmp.ctx.fillStyle = colour, bmp.ctx.drawCircle(x * sw, y * sh, r * sw), 
                bmp.ctx.closePath(), bmp.ctx.fill();
                var grid = .01, rings = Math.ceil(r / grid);
                grid = r / rings;
                for (var sites = [], ring = 0; ring < rings; ring++) for (var perimeter = ring * grid * TAU, segments = Math.ceil(perimeter / grid) || 6, segment = 0; segment < segments; segment++) {
                    var siteRadius = (ring + rand.getNumber(0, 1)) * grid, siteAngle = (segment + rand.getNumber(0, 1)) / segments * TAU, siteX = x + Math.sin(siteAngle) * siteRadius, siteY = y + Math.cos(siteAngle) * siteRadius, site = {
                        x: siteX,
                        y: siteY
                    };
                    banding ? parseInt(siteRadius * bandScale) % bandModulo == 0 && sites.push(site) : sites.push(site);
                }
                var circle = {
                    colour: colour,
                    depth: depth,
                    x: x,
                    y: y,
                    r: r,
                    children: [],
                    sites: sites
                };
                if (circles++, parent && parent.children && parent.children.push(circle), depth < maxDepth) for (var i = 0, il = circle.sites.length; i < il; i++) attemptNextCircle(circle, 0);
            }
            !function progressChecker() {
                -1 == threads ? (con.log("progressChecker", threads), progress("render:complete", bmp.canvas), 
                !0) : setTimeout(progressChecker, 250);
            }();
            attemptCircle(null, 0, {
                colour: "transparent"
            });
        },
        settings: {}
    }, threadOutput = dom.canvas(800, 300);
    return experiment;
};

isNode ? module.exports = circle_packing() : define("circle_packing", circle_packing);