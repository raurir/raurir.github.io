(function() {
    var can, con, ctx, d, draw, init, seeds, time;
    con = console, d = document, can = ctx = null, time = 0, seeds = [], init = function() {
        var i, _i;
        for ((can = d.createElement("canvas")).width = can.height = 400, d.body.appendChild(can), 
        ctx = can.getContext("2d"), i = _i = 0; _i < 4; i = _i += 1) seeds[i] = Math.pow(2, i + 1) + 10 * (2 * Math.random() - 1);
        return con.log(seeds), draw();
    }, draw = function() {
        var i, v, x, y, _i, _j;
        for (can.width = can.width, time += 1, x = _i = 0; _i < 200; x = _i += 1) {
            for (i = _j = v = 0; _j < 4; i = _j += 1) v += Math.sin((time + x) * seeds[i] * .01) / Math.pow(2, i + 1);
            y = 200 + 200 * v / 4, 100, ctx.fillStyle = "rgba(100,100,100,0.4)", ctx.fillRect(2 * x, y, 10, 10);
        }
        return requestAnimationFrame(draw);
    }, init();
}).call(this);