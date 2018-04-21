"use strict";

define("infinite_scrolling_cogs", function() {
    var sw = window.innerWidth, sh = window.innerHeight;
    function makeCanvas(w, h) {
        var can = document.createElement("canvas");
        return can.width = w, can.height = h, can;
    }
    var stage = makeCanvas(sw, sh);
    return {
        init: function() {
            var prevCog, context = stage.getContext("2d"), padding = 5, cogs = [], pi = 3.14159265, pi2 = 2 * pi, dir = -1, cx = .5 * sw, cy = 0, tr = 0, ang = 0, speed = .02, cogNumber = 0, holeStyle = {
                fillStyle: "#000",
                lineWidth: 0
            }, curvature = 1.7;
            function number(min, max) {
                return Math.random() * (max - min) + min;
            }
            function integer(min, max) {
                return ~~number(min, max + 1);
            }
            function colourGrey(options) {
                var defaults = {
                    darkest: 0,
                    lightest: 255,
                    alpha: 1
                };
                for (var p in options) defaults[p] = options[p];
                var white = defaults.white ? defaults.white : integer(defaults.darkest, defaults.lightest);
                return "rgba(" + white + "," + white + "," + white + "," + defaults.alpha + ")";
            }
            function drawCircle(c, x, y, r, style, antiClockwise, renderNow) {
                c.moveTo(x + r, y), null == antiClockwise && (antiClockwise = !1);
                var defaults = {
                    fillStyle: "#fff",
                    lineWidth: 0,
                    strokeStyle: "#000"
                };
                for (var p in style) defaults[p] = style[p];
                c.fillStyle = defaults.fillStyle, c.lineWidth = defaults.lineWidth, c.strokeStyle = defaults.strokeStyle, 
                renderNow && c.beginPath(), c.arc(x, y, r, 0, pi2, antiClockwise), renderNow && (c.closePath(), 
                defaults.fillStyle && c.fill(), defaults.lineWidth && c.stroke());
            }
            function createCog(forceX, forceY) {
                var ctx, size;
                if (prevCog = cogs[cogNumber - 1], forceX && forceY && prevCog) {
                    var dy = forceY - prevCog.yp, dx = forceX - prevCog.xp;
                    ang = Math.atan(dy / dx), ang += dx < 0 ? pi : 0, dx = Math.abs(dx), dy = Math.abs(dy), 
                    dx -= Math.abs(prevCog.size), dy -= Math.abs(prevCog.size), size = Math.sqrt(dx * dx + dy * dy);
                } else ang = number(0, pi2), size = number(60, 100);
                if (!(size < 50 || 400 < size)) {
                    var teeth = ~~(size / 10);
                    dir *= -1, cogNumber && (cx += (tr += size - 10) * Math.cos(ang), cy += tr * Math.sin(ang)), 
                    tr = size - 10;
                    for (var realX, realY, minRad = size - 25, maxRad = size, verts = [], step = pi2 / (4 * teeth), mod = 0, oddEven = 0, halfRadius = (maxRad - minRad) / curvature + minRad, j = 0; j < 4 * teeth; j++) {
                        var i = j * step, topBottomLand = ~~mod % 2, r = topBottomLand * (maxRad - minRad) + minRad;
                        mod += .5, oddEven += 1;
                        var angle = i - step / 2;
                        realX = r * Math.cos(angle), realY = r * Math.sin(angle);
                        var v = void 0;
                        v = oddEven % 2 == 0 ? {
                            tb: topBottomLand,
                            ex: realX,
                            ey: realY
                        } : {
                            tb: topBottomLand,
                            mp: !0,
                            ex: realX,
                            ey: realY,
                            mx: halfRadius * Math.cos(i - step),
                            my: halfRadius * Math.sin(i - step)
                        }, verts.push(v);
                    }
                    var cog = {
                        index: cogNumber,
                        size: size,
                        rotation: number(0, pi2),
                        teeth: teeth,
                        dir: dir,
                        xp: cx,
                        yp: cy,
                        canvas: null
                    };
                    cogNumber && (prevCog = cogs[cogNumber - 1], cog.rotation = prevCog.teeth / cog.teeth * -prevCog.rotation + ang * (prevCog.teeth + cog.teeth) / cog.teeth, 
                    cog.teeth % 2 == 0 && (cog.rotation += pi2 / (2 * cog.teeth))), cog.render = function() {
                        var dims = 2 * (this.size + padding);
                        this.canvas = makeCanvas(dims, dims), (ctx = this.canvas.getContext("2d")).save(), 
                        ctx.translate(this.size + padding, this.size + padding), ctx.shadowBlur = 2, ctx.shadowColor = "#000", 
                        ctx.beginPath(), v = verts[0], ctx.moveTo(v.ex, v.ey);
                        for (var i = 1; i < verts.length; i++) {
                            var v = verts[i];
                            v.mp ? ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey) : ctx.lineTo(v.ex, v.ey);
                        }
                        v = verts[0], ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey);
                        var axleSize = .2 * minRad;
                        drawCircle(ctx, 0, 0, .2 * minRad, holeStyle, !0), drawCutouts(axleSize + .1 * minRad, .9 * minRad), 
                        ctx.closePath(), ctx.fillStyle = colourGrey({
                            darkest: 70,
                            lightest: 200,
                            alpha: 1
                        }), ctx.fill(), ctx.stroke(), .5 < Math.random() && drawCircle(ctx, 0, 0, .16 * minRad, holeStyle, !0, !0), 
                        ctx.globalCompositeOperation = "source-atop", drawBand(axleSize, axleSize + .1 * minRad), 
                        drawBand(.9 * minRad, minRad);
                    }, cog.draw = function() {
                        cog.canvas || cog.render(), context.save(), context.translate(this.xp, this.yp), 
                        context.rotate(this.rotation), context.drawImage(this.canvas, -this.size - padding, -this.size - padding), 
                        context.restore();
                    }, cog.rotate = function() {
                        this.rotation += pi2 / this.teeth * this.dir * speed, this.draw();
                    }, cogs[cogNumber] = cog, cogNumber++;
                }
                function drawBand(minRadius, maxRadius) {
                    if (!(number(0, 1) < .3)) {
                        var bandSize = maxRadius - minRadius;
                        drawCircle(ctx, 0, 0, (maxRadius + minRadius) / 2, {
                            fillStyle: null,
                            strokeStyle: colourGrey({
                                darkest: 0,
                                lightest: 40,
                                alpha: .5
                            }),
                            lineWidth: bandSize
                        }, !1, !0);
                    }
                }
                function drawCutouts(minRadius, maxRadius) {
                    var midRadius = (maxRadius + minRadius) / 2, bandSize = maxRadius - minRadius;
                    0 == integer(0, 1) ? function(midRadius, bandSize) {
                        var holeSize = bandSize / 2 * number(.6, .9), holes = ~~(number(.5, .9) * pi2 * midRadius / holeSize / 2);
                        holeSize *= number(.5, .9);
                        for (var i = 0; i < holes; i++) {
                            var angle = i / holes * pi2;
                            drawCircle(ctx, midRadius * Math.cos(angle), midRadius * Math.sin(angle), holeSize, holeStyle, !0);
                        }
                    }(midRadius, bandSize) : function(midRadius, bandSize) {
                        for (var capped = 0 == integer(0, 1), segments = 1 + ~~Math.pow(teeth, 1 / integer(2, capped ? 4 : 3)), holeSize = number(.5, .8) * bandSize, segmentSize = (pi2 / segments - (Math.asin(holeSize / midRadius) * capped ? 1 : .5)) * number(.5, .9), innerRadius = midRadius - holeSize / 2, outerRadius = midRadius + holeSize / 2, i = 0; i < segments; i++) {
                            var startAngle = i / segments * pi2, endAngle = startAngle + segmentSize;
                            ctx.moveTo(Math.cos(startAngle) * innerRadius, Math.sin(startAngle) * innerRadius), 
                            ctx.arc(0, 0, innerRadius, startAngle, endAngle, !1), capped ? ctx.arc(Math.cos(endAngle) * midRadius, Math.sin(endAngle) * midRadius, holeSize / 2, endAngle + pi, endAngle, !0) : ctx.lineTo(Math.cos(endAngle) * outerRadius, Math.sin(endAngle) * outerRadius), 
                            ctx.arc(0, 0, outerRadius, endAngle, startAngle, !0), capped ? ctx.arc(Math.cos(startAngle) * midRadius, Math.sin(startAngle) * midRadius, holeSize / 2, startAngle, startAngle + pi, !0) : ctx.lineTo(Math.cos(startAngle) * innerRadius, Math.sin(startAngle) * innerRadius);
                        }
                    }(midRadius, bandSize);
                }
            }
            var scrollY = 0, y = 0;
            function incrementCog() {
                var newX = (cx < sw / 2 ? number(0, 3) : number(-3, 0)) * sw / 12;
                createCog(cx + newX, y), y = cy + number(0, 200);
            }
            for (var i = 0; i < 5; i++) incrementCog();
            document.body.appendChild(stage), function onLoop() {
                requestAnimationFrame(onLoop), --scrollY - sh - 200 < -cy && incrementCog(), context.fillStyle = "#ddd", 
                context.fillRect(0, 0, sw, sh), context.save(), context.translate(0, scrollY);
                for (var i = 0; i < cogs.length; i++) cogs[i].rotate();
                context.restore();
            }();
        },
        stage: stage
    };
});