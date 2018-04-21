"use strict";

var linked_line = function() {
    return {
        generate: function(size, preoccupied) {
            return new Promise(function(resolve, reject) {
                if (Math.round(size / 2) === size / 2 || Math.round(size) !== size) return alert("linked_line - invalid size, needs to be odd integer - you supplied: " + size), 
                con.warn("linked_line - invalid size, needs to be odd integer - you supplied:", size);
                var first, attempts = 0, wid = size, hei = size, sw = 2 * (wid + .5), sh = 2 * (hei + .5), swZ = 2 * (wid + .5) * 4, shZ = 2 * (hei + .5) * 4, bmp = dom.canvas(sw, sh), bmpZ = dom.canvas(swZ, shZ), bmpW = dom.canvas(swZ, shZ), bmpR = dom.canvas(swZ, shZ), ctx = bmp.ctx, ctxZ = bmpZ.ctx, ctxW = bmpW.ctx, ctxR = bmpR.ctx, debug = dom.element("div"), occupied = {
                    array: [],
                    oneD: [],
                    monkeys: []
                }, backup = {}, preoccupy = function(options) {
                    var item = {
                        x: options.x,
                        y: options.y,
                        type: "NULL"
                    };
                    occupied.oneD[getIndex(item.x, item.y)] = item, occupied.array.push(item);
                }, makeItem = function(options) {
                    var x = null == options.x ? rand.random() : options.x, y = null == options.y ? rand.random() : options.y, item = {
                        x: x,
                        y: y,
                        type: "TUNNEL",
                        surrounded: !1,
                        prev: options.prev,
                        next: options.next
                    };
                    return occupied.oneD[getIndex(x, y)] = item, occupied.array.push(item), item;
                }, getIndex = function(x, y) {
                    return y * wid + x;
                }, checkDir = function(x, y, dir) {
                    switch (dir) {
                      case 0:
                        y--;
                        break;

                      case 1:
                        x++;
                        break;

                      case 2:
                        y++;
                        break;

                      case 3:
                        x--;
                    }
                    var index = getIndex(x, y);
                    return {
                        ok: 0 <= x && x < wid && 0 <= y && y < hei && -1 === occupied.oneD[index],
                        x: x,
                        y: y
                    };
                }, insertItemAnywhere = function() {
                    var index = rand.getInteger(0, occupied.array.length - 1), item = occupied.array[index];
                    item && (debug.innerHTML = "item " + occupied.array.length, function(item) {
                        for (var i = -1; i < 2; i++) for (var j = -1; j < 2; j++) {
                            var x = item.x + i, y = item.y + j;
                            if (0 <= x && x < wid && 0 <= y && y < hei) {
                                var index = getIndex(x, y);
                                if (-1 === occupied.oneD[index]) return !1;
                            }
                        }
                        return item.surrounded = !0;
                    }(item) ? occupied.array.splice(index, 1) : item && item.next && item.prev && insertItemAfter(item));
                }, insertItemAfter = function(afterItem) {
                    backup.array = occupied.array.slice(), backup.oneD = occupied.oneD.slice();
                    var prev = afterItem, next = afterItem.next, x = afterItem.x, y = afterItem.y, startDir = rand.getInteger(0, 3), nextDir = rand.getInteger(0, 3), pending0 = checkDir(x, y, startDir), pending1 = checkDir(pending0.x, pending0.y, nextDir), inline = function() {
                        for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) points[_key] = arguments[_key];
                        for (var i = 0, il = points.length - 1; i < il; i++) {
                            var p0 = points[i], p1 = points[i + 1];
                            if (0 !== Math.abs(p0.x - p1.x) && 0 !== Math.abs(p0.y - p1.y)) return !1;
                        }
                        return !(points[0].x === points[1].x && points[1].x === points[2].x || points[0].y === points[1].y && points[1].y === points[2].y);
                    }(prev, pending0, pending1, next);
                    if (pending0.ok && pending1.ok && inline) {
                        var newItem0 = makeItem({
                            x: pending0.x,
                            y: pending0.y
                        }), newItem1 = makeItem({
                            x: pending1.x,
                            y: pending1.y
                        });
                        (prev.next = newItem0).prev = prev, (newItem0.next = newItem1).prev = newItem0, 
                        (newItem1.next = next).prev = newItem1;
                    } else occupied.array = backup.array.slice(), occupied.oneD = backup.oneD.slice();
                };
                ctxZ.scale(4, 4), ctxZ.imageSmoothingEnabled = !1, ctxW.scale(4, 4), ctxW.imageSmoothingEnabled = !1;
                var arrLen = 0, done = 0, render = function render(time) {
                    attempts++, ctx.fillStyle = "#fff", ctx.fillRect(0, 0, sw, sh);
                    for (var i = 0; i < 40; i++) insertItemAnywhere();
                    ctx.beginPath(), ctx.lineWidth = .25;
                    for (var item = first; item; ) {
                        var x = 2 * (item.x + .75), y = 2 * (item.y + .75);
                        item == first ? ctx.moveTo(x - 2, y) : item.next ? ctx.lineTo(x, y) : (ctx.lineTo(x, y), 
                        ctx.lineTo(x, y + 2)), item = item.next;
                    }
                    for (ctx.stroke(), i = 0; i < occupied.array.length; i++) item = occupied.array[i], 
                    ctx.fillStyle = "NULL" == item.type ? "#f00" : "#00ff00", ctx.fillRect(2 * item.x + 1, 2 * item.y + 1, 1, 1);
                    ctxZ.drawImage(bmp.canvas, 0, 0), arrLen === occupied.array.length ? done++ : (arrLen = occupied.array.length, 
                    done = 0), done < 300 ? attempts % 50 == 0 ? (con.log("having a breather... ", done), 
                    setTimeout(render, 20)) : render() : function() {
                        var pixels = ctx.getImageData(0, 0, sw, sh).data;
                        ctxW.fillStyle = "#fff", ctxW.fillRect(0, 0, sw, sh);
                        for (var index, walls = [], i = 0, j = 0, il = pixels.length; i < il; i += 4, j++) {
                            var xy = {
                                x: (index = j) % sw,
                                y: Math.floor(index / sw)
                            };
                            255 == pixels[i] && (ctxW.fillStyle = "#f00", ctxW.fillRect(xy.x, xy.y, 1, 1), walls.push(xy));
                        }
                        var w, wallrects = [], row = -1;
                        for (i = 0, il = walls.length; i < il; i++) row != (w = walls[i]).y ? (row = w.y, 
                        wallrects.push({
                            x: w.x,
                            y: w.y,
                            w: 1,
                            h: 1
                        })) : walls[i - 1].x == w.x - 1 ? wallrects[wallrects.length - 1].w++ : wallrects.push({
                            x: w.x,
                            y: w.y,
                            w: 1,
                            h: 1
                        });
                        for (i = 0, il = wallrects.length; i < il; i++) {
                            var w0 = wallrects[i];
                            for (j = i + 1; j < il; j++) {
                                var w1 = wallrects[j];
                                w0 && w1 && w0.x == w1.x && w0.w == w1.w && w0.y + w0.h == w1.y && (wallrects[i].h++, 
                                wallrects[j] = null);
                            }
                        }
                        for (wallrects = wallrects.filter(function(item) {
                            return item;
                        }), ctxR.fillStyle = "#fff", ctxR.fillRect(0, 0, swZ, shZ), i = 0, il = wallrects.length; i < il; i++) (w = wallrects[i]) && (ctxR.beginPath(), 
                        ctxR.rect(4 * w.x + 2, 4 * w.y + 2, 4 * w.w - 4, 4 * w.h - 4), ctxR.lineWidth = 1, 
                        ctxR.lineStyle = "rgba(0,0,0,0.00)", ctxR.closePath(), ctxR.stroke());
                        resolve({
                            walls: walls,
                            wallrects: wallrects
                        });
                    }();
                };
                !function() {
                    for (var y = 0; y < hei; y++) for (var x = 0; x < wid; x++) occupied.oneD.push(-1), 
                    ctx.fillRect(2 * x - 2 + 1, 2 * y - 2 + 1, 4, 4);
                    var newItem, lastItem;
                    preoccupied && preoccupied.forEach(preoccupy);
                    for (var i = 0; i < hei; i++) i < hei / 2 ? (x = i, y = hei / 2 - .5) : (x = wid / 2 - .5, 
                    y = i), 0 == i ? (newItem = makeItem({
                        x: x,
                        y: y
                    }), first = newItem) : (newItem = makeItem({
                        x: x,
                        y: y,
                        prev: lastItem
                    }), lastItem.next = newItem), lastItem = newItem;
                    render(0);
                }();
            });
        }
    };
};

define("linked_line", linked_line);