(function() {
  var canvas, centre, con, container, createSlider, ctx, d, draw, init, redraw, rotMod, settings, size;

  con = console;

  d = document;

  container = null;

  canvas = null;

  size = 800;

  centre = size / 2;

  ctx = null;

  rotMod = Math.PI / 4;

  settings = {};

  createSlider = function(prop, min, max, ini, granularity) {
    var change, changeText, div, input, label, range;
    if (granularity == null) {
      granularity = 1;
    }
    div = d.createElement("div");
    div.style.display = "flex";
    label = d.createElement("label");
    label.innerHTML = "" + prop + ":";
    label.style.color = "#ccc";
    label.style.width = "200px";
    input = d.createElement("input");
    input.type = "text";
    input.value = ini;
    range = d.createElement("input");
    range.type = "range";
    range.min = min / granularity;
    range.max = max / granularity;
    range.name = prop;
    range.value = ini / granularity;
    div.appendChild(label);
    div.appendChild(range);
    div.appendChild(input);
    container.appendChild(div);
    change = function(e) {
      var v;
      v = e.target.value * granularity;
      settings[prop] = Number(v);
      input.value = v;
      return redraw();
    };
    changeText = function(e) {
      var v;
      v = e.target.value;
      settings[prop] = Number(v);
      range.value = v / granularity;
      return redraw();
    };
    input.addEventListener("change", changeText);
    range.addEventListener("change", change);
    range.addEventListener("input", change);
    return settings[prop] = ini;
  };

  redraw = function() {
    canvas.width = canvas.width;
    return draw(centre, 50, 0, 0);
  };

  draw = function(x, y, branchAngle, level) {
    var angleSpiral, angleSpread, branchScale, h, half, items, j, lineThickness, maxRecursion, newX, newY, rgb, rotation, scale, w, _i, _results;
    level++;
    items = settings.items;
    maxRecursion = settings.maxRecursion;
    angleSpiral = settings.angleSpiral;
    angleSpread = settings.angleSpread;
    lineThickness = settings.lineThickness;
    rgb = 55 + (1 - level / maxRecursion) * 200;
    _results = [];
    for (j = _i = 0; 0 <= items ? _i < items : _i > items; j = 0 <= items ? ++_i : --_i) {
      half = (items - 1) / 2;
      branchScale = 1 - (j - half) / half * settings.symmetry;
      scale = settings.scale / level * branchScale;
      w = 30 * scale * lineThickness;
      h = 100 * scale;
      rotation = angleSpread * (j - half) + branchAngle * angleSpiral;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = "rgb(" + rgb + "," + rgb + "," + rgb + ")";
      ctx.fillRect(-w * 1 / 2, 0, w * 1, h * 1);
      ctx.restore();
      newX = x + h * -Math.sin(rotation);
      newY = y + h * Math.cos(rotation);
      if (level < maxRecursion) {
        _results.push(draw(newX, newY, rotation, level, j));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  init = function() {
    container = d.createElement("div");
    d.body.appendChild(container);
    createSlider("items", 1, 10, 2);
    createSlider("maxRecursion", 1, 10, 5);
    createSlider("angleSpiral", 0, 2, 1, 0.01);
    createSlider("angleSpread", 0, 2, Math.PI / 2, 0.01);
    createSlider("symmetry", -1, 1, 0, 0.01);
    createSlider("scale", 0, 10, 1, 0.01);
    createSlider("lineThickness", 0.1, 1, 1, 0.01);
    canvas = d.createElement("canvas");
    canvas.style.border = "1px solid #333";
    canvas.width = canvas.height = size;
    container.appendChild(canvas);
    ctx = canvas.getContext("2d");
    return redraw();
  };

  init();

}).call(this);
