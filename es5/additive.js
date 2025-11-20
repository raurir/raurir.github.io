(function() {
  var bits, can, centre, ctx, d, draw, gap, init, oscs, seeds, size;

  d = document;

  bits = 200;

  gap = 2;

  size = bits * gap;

  centre = size / 2;

  ctx = null;

  can = null;

  oscs = 4;

  seeds = [];

  init = function() {
    var i, _i;
    can = d.createElement("canvas");
    can.width = can.height = size;
    d.body.appendChild(can);
    ctx = can.getContext("2d");
    for (i = _i = 0; _i < oscs; i = _i += 1) {
      seeds[i] = Math.pow(2, i + 1) + (Math.random() * 2 - 1) * 10;
    }
    return draw();
  };

  draw = function(time) {
    var b, i, o, r, v, vs, x, y, _i, _j, _k;
    can.width = can.width;
    vs = [];
    for (x = _i = 0; _i < bits; x = _i += 1) {
      v = 0;
      for (i = _j = 0; _j < oscs; i = _j += 1) {
        o = Math.sin((time / 10 + x) * seeds[i] * 0.01) / Math.pow(2, i + 1);
        y = centre + o * 100;
        r = 100 + 50 * i;
        b = 200 - 50 * i;
        ctx.fillStyle = "rgba(" + r + ",0," + b + ",0.5)";
        ctx.fillRect(x * gap, y, 2, 2);
        v += o;
      }
      vs.push(v);
    }
    for (x = _k = 0; _k < bits; x = _k += 1) {
      v = vs[x];
      y = centre + v * centre / oscs;
      r = x * 255 / bits;
      b = 255 - r;
      ctx.fillStyle = "rgb(" + r + ",0," + b + ")";
      ctx.fillRect(x * gap, y, 10, 10);
    }
    return requestAnimationFrame(draw);
  };

  init();

}).call(this);
