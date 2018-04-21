"use strict";

var isNode = "undefined" != typeof module;

if (isNode) var con = console, dom = require("./dom.js"), geom = require("./geom.js"), rand = require("./rand.js");

var circle_packing_zoom_loop = function() {
    var size, current, TAU = 2 * Math.PI, cx = .5, cy = .5, bmp = dom.canvas(1, 1), zoom = {};
    function updateZoom(time) {
        zoom.amount < zoom.max || (zoom.amount = zoom.max), target = zoom.target, scale = zoom.amount;
        var distance = Math.sqrt(Math.pow(zoom.target.x, 2) + Math.pow(zoom.target.y, 2)) * zoom.max;
        scaler = zoom.amount, zoomProgress = zoom.amount / zoom.max, zoomRemaining = 1 - zoomProgress;
        var xo = (zoom.target.x, zoom.amount);
        bmp.ctx.save(), bmp.ctx.clearRect(0, 0, size, size);
        for (var i = 0, il = current.circles.length; i < il; i++) {
            var _current$circles$i = current.circles[i], x = _current$circles$i.x, y = _current$circles$i.y, r = _current$circles$i.r;
            x = .5 + (x - .5) * scaler, y = .5 + (y - .5) * scaler, r *= Math.pow(scaler, 1), 
            bmp.ctx.fillStyle = i == zoom.targetIndex ? "#f00" : "#000", bmp.ctx.beginPath(), 
            bmp.ctx.drawCircle(x * size, y * size, r * size), bmp.ctx.closePath(), bmp.ctx.fill();
        }
        bmp.ctx.fillStyle = "yellow", bmp.ctx.fillRect(cx * size - 1, 0, 2, size), bmp.ctx.fillRect(0, cy * size - 1, size, 2);
        xo = .5 + (target.x - .5) * scaler;
        var yo = .5 + (target.y - .5) * scaler;
        bmp.ctx.strokeStyle = "green", bmp.ctx.beginPath(), bmp.ctx.moveTo(cx * size, cy * size), 
        bmp.ctx.lineTo(xo * size, yo * size), bmp.ctx.stroke();
        var half = geom.lerp({
            x: cx * size,
            y: cy * size
        }, {
            x: xo * size,
            y: yo * size
        }, zoomProgress);
        bmp.ctx.fillRect(half.x, half.y, 10, 10);
    }
    return window.addEventListener("mousemove", function(e) {
        zoom.amount = 1 + e.x / size * zoom.max, updateZoom();
    }), {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size, bmp.setSize(size, size), current = function() {
                var planet = dom.canvas(size, size), gap = rand.getNumber(1e-4, .02), minRadius = rand.getNumber(.001, .01), maxRadius = rand.getNumber(minRadius + .02, .5), maxDepth = 1;
                function attemptNextCircle(parent, attempt) {
                    ++attempt < 5e3 ? attemptCircle(parent, attempt) : con.log("too many attempt");
                }
                function attemptCircle(parent, attempt, options) {
                    var depth, distance, dx, dy, other, r, radius, y, x;
                    if (parent) {
                        if (!parent.sites.length) return;
                        depth = parent.depth + 1;
                        var index = Math.floor(rand.random() * parent.sites.length);
                        if (site = parent.sites.splice(index, 1)[0], x = site.x, y = site.y, dx = parent.x - x, 
                        dy = parent.y - y, distance = Math.sqrt(dx * dx + dy * dy), radius = parent.r - distance - gap, 
                        r = rand.random() * radius, maxRadius < r ? r = maxRadius : r < minRadius && (r = minRadius), 
                        r - gap < minRadius) return attemptNextCircle(parent, attempt);
                        for (var ok = !0, i = 0, il = parent.children.length; i < il && ok; i++) {
                            other = parent.children[i], dx = x - other.x, dy = y - other.y, distance = Math.sqrt(dx * dx + dy * dy);
                            var distanceCombined = r + other.r + gap;
                            distance < distanceCombined && (r = distance - other.r - gap) < minRadius && (ok = !1);
                        }
                        if (!1 === ok) return attemptNextCircle(parent, attempt);
                    } else x = cx, y = cy, r = .5, depth = 0;
                    var grid = .01, rings = Math.ceil(r / grid);
                    grid = r / rings;
                    for (var sites = [], ring = 0; ring < rings; ring++) for (var perimeter = ring * grid * TAU, segments = Math.ceil(perimeter / grid) || 6, segment = 0; segment < segments; segment++) {
                        var siteRadius = (ring + rand.getNumber(0, 1)) * grid, siteAngle = (segment + rand.getNumber(0, 1)) / segments * TAU, siteX = x + Math.sin(siteAngle) * siteRadius, siteY = y + Math.cos(siteAngle) * siteRadius, site = {
                            x: siteX,
                            y: siteY
                        };
                        sites.push(site);
                    }
                    var circle = {
                        depth: depth,
                        x: x,
                        y: y,
                        r: r,
                        children: [],
                        sites: sites
                    };
                    if (parent && parent.children && parent.children.push(circle), depth < maxDepth) for (var i = 0, il = circle.sites.length; i < il; i++) attemptNextCircle(circle, 0);
                    return circle;
                }
                var container = attemptCircle(null, 0);
                return {
                    canvas: planet.canvas,
                    circles: container.children
                };
            }(), setTimeout(function() {
                var p0 = current;
                con.log("p0", p0);
                var targetIndex = rand.getInteger(0, p0.circles.length), target = p0.circles[targetIndex];
                zoom = {
                    amount: 1,
                    max: .5 / target.r,
                    target: target,
                    targetIndex: targetIndex
                }, con.log("zoom", zoom), updateZoom();
            }, 100);
        }
    };
};

isNode ? module.exports = circle_packing_zoom_loop() : define("circle_packing_zoom_loop", circle_packing_zoom_loop);