(function() {
    var ctx, d, drawRing, init, time;
    console, d = document, ctx = null, time = 0, init = function() {
        var can;
        return (can = d.createElement("canvas")).width = can.height = 640, d.body.appendChild(can), 
        ctx = can.getContext("2d"), setInterval(function() {
            var i, _i, _results;
            for (time += 1, time %= 2e3, ctx.clearRect(0, 0, 640, 640), _results = [], i = _i = 0; _i < 20; i = _i += 1) _results.push(drawRing(i));
            return _results;
        }, 1e3 / 60);
    }, drawRing = function(i) {
        var j, perside, s, timeEnd, timeStart, x, y, _i, _j, _results;
        for (perside = 2 * i, _results = [], s = _i = 0; _i < 4; s = _i += 1) {
            for (ctx.save(), ctx.translate(320, 320), ctx.rotate(s * Math.PI / 2), j = _j = 0; _j <= perside; j = _j += 1) x = 16 * (-i - .5), 
            y = 16 * (-j + i - .5) + function(t, b, c, d) {
                var ts;
                return b + c * (-2 * ((ts = (t /= d) * t) * t) + 3 * ts);
            }((timeEnd = (timeStart = 20 * (i + 1)) + 300) < time ? 1 : timeStart < time ? (time - timeStart) / (timeEnd - timeStart) : 0, 0, 16, 1), 
            0, ctx.fillStyle = "rgba(0,0,0,1)", 6, ctx.fillRect(x - 3, y - 3, 6, 6);
            _results.push(ctx.restore());
        }
        return _results;
    }, init();
}).call(this);