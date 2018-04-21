"use strict";

var isNode = "undefined" != typeof module, meandering_polygons = function() {
    var sw = 1e3, sh = 1e3, dots = (colours.getNextColour(), 24), arrDots = [], bmp = dom.canvas(sw, sh), ctx = bmp.ctx, range = .2;
    function white() {
        var b = ~~(230 + 25 * Math.random());
        return "rgba(" + b + "," + b + "," + b + "," + Math.round(100 * (.7 + .3 * Math.random())) / 100 + ")";
    }
    var lines = [];
    function uniqueId(j, k) {
        return j * (j - 1) / 2 + k;
    }
    for (var j = 0; j < dots; j++) for (var k = 0; k < j; k++) lines[uniqueId(j, k)] = {
        points: [ j, k ],
        lineWidth: 0,
        colour: white(),
        dashes: ~~(5 * Math.random())
    };
    function render() {
        ctx.fillStyle = "rgba(180,180,200,1)", ctx.fillRect(0, 0, sw, sh);
        for (var j = 0; j < dots; j++) {
            var dot = arrDots[j];
            dot.move(), dot.draw();
            for (var k = 0; k < j; k++) {
                var lineId = uniqueId(j, k), other = arrDots[k], dx = dot.x - other.x, dy = dot.y - other.y, inRange = (d = Math.sqrt(dx * dx + dy * dy)) < range;
                (other.x < 0 || 1 < other.x || other.y < 0 || 1 < other.y) && (inRange = !1), inRange ? (dot.force(other, d, dx, dy), 
                other.force(dot, d, dx, dy), lines[lineId].lineWidth -= .01 * (lines[lineId].lineWidth - 3)) : (lines[lineId].lineWidth *= .9, 
                lines[lineId].lineWidth < .1 && (lines[lineId].lineWidth = 0));
            }
        }
        for (var m = 0, ml = lines.length; m < ml; m++) {
            var lineM = lines[m];
            if (pointsM = lineM.points, a = arrDots[pointsM[0]], b = arrDots[pointsM[1]], lineM.lineWidth) {
                for (k = 0; k < m; k++) {
                    var lineK = lines[k];
                    if (lineK.lineWidth) {
                        var pointsK = lineK.points, c = arrDots[pointsK[0]], d = arrDots[pointsK[1]], intersects = geom.intersectionBetweenPoints(a, b, c, d);
                        intersects && debugCircle(intersects, lineM.colour);
                    }
                }
                drawLine(a, b, lineM);
            }
        }
        requestAnimationFrame(render);
    }
    function drawLine(a, b, line) {
        0 < line.lineWidth && (ctx.save(), ctx.beginPath(), ctx.lineWidth = line.lineWidth, 
        ctx.strokeStyle = line.colour, 2 < line.dashes && ctx.setLineDash([ line.dashes ]), 
        ctx.lineCap = "round", ctx.moveTo(a.x * sw, a.y * sh), ctx.lineTo(b.x * sw, b.y * sh), 
        ctx.stroke(), ctx.restore());
    }
    function debugCircle(dot, colour) {
        ctx.beginPath(), ctx.fillStyle = colour, ctx.drawCircle(dot.x * sw, dot.y * sh, 3), 
        ctx.fill();
    }
    return {
        stage: bmp.canvas,
        resize: function(w, h) {
            sw = w, sh = h, bmp.canvas.width = sw, bmp.canvas.height = sh;
        },
        init: function() {
            for (var j = 0; j < dots; ) arrDots[j] = {
                x: Math.random(),
                y: Math.random(),
                fx: 0,
                fy: 0,
                vx: .001 * Math.random(),
                vy: .001 * Math.random(),
                dir: Math.random() * Math.PI * 2,
                dirFloat: 0,
                rotation: 0,
                rotationFloat: 0,
                type: ~~(2 * Math.random()),
                bmp: null,
                size: 0,
                generate: function() {
                    this.size = 6 + ~~(20 * Math.random());
                    var bmp = dom.canvas(this.size, this.size), ctx = bmp.ctx;
                    switch (this.type) {
                      case 0:
                        var lineWidth = 2 * Math.random(), radius = this.size / 2 - lineWidth;
                        ctx.beginPath(), ctx.lineWidth = lineWidth, ctx.strokeStyle = white(), ctx.drawCircle(this.size / 2, this.size / 2, radius), 
                        ctx.stroke(), radius *= Math.random(), ctx.beginPath(), ctx.fillStyle = white(), 
                        ctx.drawCircle(this.size / 2, this.size / 2, radius), ctx.fill();
                        break;

                      case 1:
                        var sides = 3 + ~~(7 * Math.random());
                        ctx.beginPath(), ctx.lineWidth = 2, ctx.strokeStyle = white(), ctx.drawCircle(this.size / 2, this.size / 2, radius - 1);
                        for (var i = 0; i < sides; i++) {
                            var angle = i / sides * Math.PI * 2, xp = this.size / 2 + this.size / 2 * .8 * Math.cos(angle), yp = this.size / 2 + this.size / 2 * .8 * Math.sin(angle);
                            0 == i ? ctx.moveTo(xp, yp) : ctx.lineTo(xp, yp);
                        }
                        ctx.closePath(), ctx.stroke();
                    }
                    this.bmp = bmp;
                },
                draw: function() {
                    null == this.bmp && this.generate(), ctx.save(), ctx.translate(this.x * sw, this.y * sh), 
                    ctx.rotate(this.rotation), ctx.drawImage(this.bmp.canvas, -this.size / 2, -this.size / 2), 
                    ctx.restore();
                },
                attraction: -1e-5,
                speed: 1e-4,
                friction: .9,
                move: function() {
                    this.rotationFloat += .5 * (.5 < Math.random() ? -1 : 1), this.rotation -= .01 * (this.rotation - this.rotationFloat), 
                    this.dirFloat += .1 * (.5 < Math.random() ? -1 : 1), this.dir -= .01 * (this.dir - this.dirFloat), 
                    this.vx += Math.sin(this.dir) * this.speed + this.fx, this.vy += Math.cos(this.dir) * this.speed + this.fy, 
                    this.vx *= this.friction, this.vy *= this.friction, this.x += this.vx, this.y += this.vy, 
                    this.x < -.2 && (this.x = 1.2), 1.2 < this.x && (this.x = -.2), this.y < -.2 && (this.y = 1.2), 
                    1.2 < this.y && (this.y = -.2);
                },
                force: function(opposite, distance, deltaX, deltaY) {
                    this.fx = deltaX / distance * this.attraction, this.fy = deltaY / distance * this.attraction;
                }
            }, j++;
            render();
            var isDown = !1, mouseTarget = null;
            addEventListener("mousedown", function(e) {
                isDown = !0;
                for (var mx = e.x / sw, my = e.y / sh, k = 0; k < dots; k++) {
                    var dot = arrDots[k], dx = dot.x - mx, dy = dot.y - my;
                    if (Math.sqrt(dx * dx + dy * dy) < .1) {
                        ctx.beginPath(), ctx.fillStyle = "red", ctx.drawCircle(dot.x * sw, dot.y * sh, 20), 
                        ctx.fill(), mouseTarget = k;
                        break;
                    }
                }
            }), addEventListener("mouseup", function(e) {
                isDown = !1, mouseTarget = null;
            }), addEventListener("mousemove", function(e) {
                if (isDown && null != mouseTarget) {
                    var mx = e.x / sw, my = e.y / sh;
                    arrDots[mouseTarget].x = mx, arrDots[mouseTarget].y = my;
                }
            });
        },
        kill: function() {}
    };
};

isNode ? module.exports = meandering_polygons() : define("meandering_polygons", meandering_polygons);