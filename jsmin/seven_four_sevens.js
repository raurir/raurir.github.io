"use strict";

define("seven_four_sevens", function() {
    var sw = 900, sh = 600, canvas = dom.canvas(sw, sh), images = [], planes = [], text = dom.element("div", {
        innerText: "Click to make a new waypoint, shift click to add multiple",
        style: {
            color: "white"
        }
    }), button = dom.button("Add planes", {
        className: "button"
    });
    document.body.appendChild(text), document.body.appendChild(button), dom.on(canvas.canvas, [ "click" ], function(e) {
        e.shiftKey || (_root.holdingpattern = []), _root.holdingpattern.push({
            _x: e.x,
            _y: e.y
        });
    }), dom.on(button, [ "click" ], function(e) {
        planes.push(Plane());
    });
    var _root = {
        holdingpattern: [ {
            _x: rand.getNumber(0, sw),
            _y: rand.getNumber(0, sh)
        }, {
            _x: rand.getNumber(0, sw),
            _y: rand.getNumber(0, sh)
        }, {
            _x: rand.getNumber(0, sw),
            _y: rand.getNumber(0, sh)
        } ],
        createSmoke: function() {}
    };
    function Plane() {
        var xdelta, ydelta, angle, targetangle, distance, deltaangle, cf, PI = Math.PI, PI2 = 2 * Math.PI, arrow = {}, tAngle = 0, count = 0, shape = {
            gotoAndStop: function(frame) {
                shape._currentframe = frame;
            },
            _currentframe: 1,
            _rotation: 0
        }, _x = Math.random() * sw, _y = Math.random() * sh, dir = Math.random() * PI2, speed = .4 * Math.random() + 2, scale = (speed - 1) / 2;
        con.log(speed, scale);
        var turnMax, turnRate = (turnMax = .03 * Math.random() + .01) / 20, holdingpatternpos = Math.floor(Math.random() * _root.holdingpattern.length), targ = _root.holdingpattern[holdingpatternpos];
        return function() {
            targ || (holdingpatternpos = Math.floor(Math.random() * _root.holdingpattern.length), 
            targ = _root.holdingpattern[holdingpatternpos]), xdelta = _x - targ._x, ydelta = _y - targ._y, 
            (distance = Math.sqrt(Math.pow(xdelta, 2) + Math.pow(ydelta, 2))) < 75 && (++holdingpatternpos >= _root.holdingpattern.length && (holdingpatternpos = 0), 
            targ = _root.holdingpattern[holdingpatternpos]), arrow._xscale = arrow._yscale = distance / 5, 
            angle = Math.atan(ydelta / xdelta), deltaangle = dir - (targetangle = xdelta < 0 ? .5 * PI - angle : 1.5 * PI - angle), 
            Math.abs(deltaangle) > PI && (deltaangle < 0 ? (deltaangle = deltaangle % PI + PI, 
            dir += PI2) : (deltaangle = deltaangle % PI - PI, dir -= PI2)), cf = shape._currentframe, 
            .1 < deltaangle ? (tAngle < turnMax ? tAngle += turnRate : tAngle = turnMax, shape.gotoAndStop(58 - (Math.round(tAngle / turnMax * 29) + 28))) : deltaangle < -.1 ? (-turnMax < tAngle ? tAngle -= turnRate : tAngle = -turnMax, 
            shape.gotoAndStop(58 - (Math.round(tAngle / turnMax * 29) + 28))) : (tAngle = deltaangle / 50, 
            cf < 28 ? shape.gotoAndStop(cf + 1) : 28 < cf && shape.gotoAndStop(cf - 1)), dir -= tAngle, 
            arrow._rotation = 180 * -targetangle / PI, shape._rotation = -dir, _x += Math.sin(dir) * speed, 
            _y += Math.cos(dir) * speed, canvas.ctx.save(), canvas.ctx.translate(_x, _y), canvas.ctx.rotate(shape._rotation);
            var flipX = !1, cfFrame = Math.floor(shape._currentframe / 3.1);
            9 < cfFrame && (flipX = !0, cfFrame = 19 - cfFrame);
            var img = images[cfFrame].masked.canvas;
            canvas.ctx.scale((flipX ? -1 : 1) * scale, scale), canvas.ctx.translate(-img.width / 2, -img.height / 2), 
            canvas.ctx.drawImage(img, 0, 0), canvas.ctx.restore(), 3 < ++count && (count = 0, 
            _root.createSmoke(this));
        };
    }
    return {
        init: function() {
            var frames = 10, loaded = 0;
            function loadComplete() {
                if (++loaded == 2 * frames) {
                    for (var f = 0; f < frames; f++) {
                        var mask, maskImage = images[f].mask;
                        (mask = dom.canvas(maskImage.width, maskImage.height)).ctx.drawImage(maskImage, 0, 0);
                        for (var data = mask.ctx.getImageData(0, 0, maskImage.width, maskImage.height), i = 0; i < data.data.length; ) {
                            var rgb = data.data[i++] + data.data[i++] + data.data[i++];
                            data.data[i++] = 255 - rgb / 3;
                        }
                        mask.ctx.putImageData(data, 0, 0);
                        var masked = dom.canvas(maskImage.width, maskImage.height);
                        masked.ctx.drawImage(images[f].plane, 0, 0), masked.ctx.globalCompositeOperation = "destination-out", 
                        masked.ctx.drawImage(mask.canvas, 0, 0), masked.ctx.globalCompositeOperation = "source-over", 
                        images[f].masked = masked;
                    }
                    planes = [ Plane() ], function update() {
                        requestAnimationFrame(update), canvas.ctx.fillStyle = "#1a4859", canvas.ctx.fillRect(0, 0, sw, sh);
                        for (var i = 0; i < _root.holdingpattern.length; i++) {
                            var waypoint = _root.holdingpattern[i];
                            canvas.ctx.beginPath(), canvas.ctx.drawCircle(waypoint._x, waypoint._y, 20), canvas.ctx.closePath(), 
                            canvas.ctx.fillStyle = "#259bc6", canvas.ctx.fill(), canvas.ctx.beginPath(), canvas.ctx.fillStyle = "white", 
                            canvas.ctx.font = "18px Helvetica", canvas.ctx.fillText(i + 1, waypoint._x - 5, waypoint._y + 5), 
                            canvas.ctx.fill();
                        }
                        for (i = 0; i < planes.length; i++) {
                            var p = planes[i];
                            p();
                        }
                    }();
                }
            }
            for (var i = 0; i < frames; i++) {
                var plane = new Image();
                plane.onload = loadComplete, plane.src = "/assets/seven_four_sevens/Image " + (i + 1) + " at frame 0.jpg";
                var mask = new Image();
                mask.onload = loadComplete, mask.src = "/assets/seven_four_sevens/Image " + (i + 1) + " alpha channel at frame 0.png", 
                images[i] = {
                    plane: plane,
                    mask: mask,
                    masked: null
                };
            }
        },
        stage: canvas.canvas
    };
});