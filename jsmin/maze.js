(function() {
    var borderIndex, can, carve, check, con, ctx, d, draw, e, entry, exits, field, fill, frontier, harden, init, iterations, iterativeDraw, keepDrawing, logShape, maze, random, row, x, y, y1, _i, _j, _k, _l, _m;
    for (con = console, d = document, ctx = null, can = d.createElement("canvas"), 0, 
    16, Math.random(), random = {
        randint: function(min, max) {
            return parseInt(min + Math.random() * (max - min));
        },
        shuffle: function(array) {
            var i, m, t;
            for (m = array.length; m; ) i = Math.floor(Math.random() * m--), t = array[m], array[m] = array[i], 
            array[i] = t;
            return array;
        }
    }, logShape = function() {
        var s, x, y, _i, _j;
        for (s = "", y = _i = 0; _i < 16; y = ++_i) {
            for (x = _j = 0; _j < 16; x = ++_j) s += field[y][x];
            s += "\n";
        }
        return con.log(s);
    }, field = [], y = _i = 0; _i < 16; y = ++_i) {
        for (row = [], x = _j = 0; _j < 16; x = ++_j) row.push("?");
        field.push(row);
    }
    for (frontier = [], carve = function(y, x) {
        var extra, i, _k, _len, _results;
        for (extra = [], field[y][x] = ".", 0 < x && "?" === field[y][x - 1] && (field[y][x - 1] = ",", 
        extra.push([ y, x - 1 ])), x < 15 && "?" === field[y][x + 1] && (field[y][x + 1] = ",", 
        extra.push([ y, x + 1 ])), 0 < y && "?" === field[y - 1][x] && (field[y - 1][x] = ",", 
        extra.push([ y - 1, x ])), y < 15 && "?" === field[y + 1][x] && (field[y + 1][x] = ",", 
        extra.push([ y + 1, x ])), _results = [], _k = 0, _len = (extra = random.shuffle(extra)).length; _k < _len; _k++) i = extra[_k], 
        _results.push(frontier.push(i));
        return _results;
    }, harden = function(y, x) {
        return field[y][x] = "#";
    }, check = function(y, x, nodiagonals) {
        var edgestate;
        if (null == nodiagonals && (nodiagonals = !0), (edgestate = 0) < x && "." === field[y][x - 1] && (edgestate += 1), 
        x < 15 && "." === field[y][x + 1] && (edgestate += 2), 0 < y && "." === field[y - 1][x] && (edgestate += 4), 
        y < 15 && "." === field[y + 1][x] && (edgestate += 8), nodiagonals) {
            if (1 === edgestate) {
                if (x < 15) {
                    if (0 < y && "." === field[y - 1][x + 1]) return !1;
                    if (y < 15 && "." === field[y + 1][x + 1]) return !1;
                }
                return !0;
            }
            if (2 === edgestate) {
                if (0 < x) {
                    if (0 < y && "." === field[y - 1][x - 1]) return !1;
                    if (y < 15 && "." === field[y + 1][x - 1]) return !1;
                }
                return !0;
            }
            if (4 === edgestate) {
                if (y < 15) {
                    if (0 < x && "." === field[y + 1][x - 1]) return !1;
                    if (x < 15 && "." === field[y + 1][x + 1]) return !1;
                }
                return !0;
            }
            if (8 === edgestate) {
                if (0 < y) {
                    if (0 < x && "." === field[y - 1][x - 1]) return !1;
                    if (x < 15 && "." === field[y - 1][x + 1]) return !1;
                }
                return !0;
            }
            return !1;
        }
        return -1 !== [ 1, 2, 4, 8 ].indexOf(edgestate);
    }, 60, exits = [], exits = [ 8, 52 ], y = _k = borderIndex = 0; _k < 16; y = ++_k) for (x = _l = 0; _l < 16; x = ++_l) if (0 === x || 0 === y || 15 === x || 15 === y) {
        if (-1 === exits.indexOf(borderIndex)) harden(y, x); else for (0, carve(y, x), d = 0 === y ? 1 : -1, 
        entry = _m = 1; _m <= 4; entry = ++_m) harden(y1 = y + entry * d, x - 2), harden(y1, x - 1), 
        harden(y1, x + 1), harden(y1, x + 2);
        borderIndex++;
    }
    logShape(), e = Math.E, iterations = 0, init = function(cb, _xwide, _yhigh) {
        return can.width = 256, can.height = 256, ctx = can.getContext("2d"), draw(cb);
    }, keepDrawing = function() {
        return 2 < frontier.length && iterations < 1e10;
    }, iterativeDraw = function() {
        var choice, index, pos;
        return keepDrawing() && (pos = Math.random(), (1 <= (pos = Math.pow(pos, Math.pow(e, -10))) || pos < 0) && console.log(pos), 
        index = Math.floor(pos * frontier.length), choice = frontier[index], check(choice[0], choice[1]) ? carve(choice[0], choice[1]) : harden(choice[0], choice[1]), 
        frontier.splice(index, 1)), iterations++;
    }, fill = function() {
        var f, rgb, _n, _results;
        for (_results = [], y = _n = 0; _n < 16; y = ++_n) _results.push(function() {
            var _o, _results1;
            for (_results1 = [], x = _o = 0; _o < 16; x = ++_o) f = field[y][x], rgb = {
                "#": 50,
                ".": 150,
                "?": 200,
                ",": 200
            }[f], ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1)", _results1.push(ctx.fillRect(16 * x, 16 * y, 16, 16));
            return _results1;
        }());
        return _results;
    }, draw = function(cb) {
        var f, _n, _o, _p;
        for (.5, d = _n = 0; _n < 1; d = ++_n) iterativeDraw();
        if (keepDrawing()) console.log("drawing"), requestAnimationFrame(draw); else for (console.log("done"), 
        y = _o = 0; _o < 16; y = ++_o) for (x = _p = 0; _p < 16; x = ++_p) "?" !== (f = field[y][x]) && "," !== f || (field[y][x] = "#");
        return fill();
    }, maze = {
        getMaze: function() {
            return field;
        },
        init: init,
        stage: can,
        resize: function() {
            return console.log("resize maze not implemented!");
        },
        kill: function() {
            return console.log("kill maze not implemented!");
        }
    }, window.maze = maze, define("maze", window.maze);
}).call(this);