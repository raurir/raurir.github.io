(function() {
    var canvas, createSlider, ctx, d, draw, redraw, settings;
    console, d = document, ctx = canvas = null, Math.PI, settings = {}, (createSlider = function(prop, min, max, ini, granularity) {
        var change, changeText, div, input, label, range;
        return null == granularity && (granularity = 1), div = d.createElement("div"), (label = d.createElement("label")).innerHTML = prop + ":", 
        (input = d.createElement("input")).type = "text", input.value = ini, (range = d.createElement("input")).type = "range", 
        range.min = min / granularity, range.max = max / granularity, range.name = prop, 
        range.value = ini / granularity, div.appendChild(label), div.appendChild(range), 
        div.appendChild(input), d.body.appendChild(div), change = function(e) {
            var v;
            return v = e.target.value * granularity, settings[prop] = Number(v), input.value = v, 
            redraw();
        }, changeText = function(e) {
            var v;
            return v = e.target.value, settings[prop] = Number(v), range.value = v / granularity, 
            redraw();
        }, input.addEventListener("change", changeText), range.addEventListener("change", change), 
        range.addEventListener("input", change), settings[prop] = ini;
    })("items", 1, 10, 2), createSlider("maxRecursion", 1, 10, 5), createSlider("angleSpiral", 0, 2, 1, .01), 
    createSlider("angleSpread", 0, 2, Math.PI / 2, .01), createSlider("symmetry", -1, 1, 0, .01), 
    createSlider("scale", 0, 10, 1, .01), redraw = function() {
        return canvas.width = canvas.width, draw(300, 50, 0, 0);
    }, draw = function(x, y, branchAngle, level) {
        var alpha, angleSpiral, angleSpread, branchScale, h, half, items, j, maxRecursion, newX, newY, rotation, scale, w, _i, _results;
        for (level++, items = settings.items, maxRecursion = settings.maxRecursion, angleSpiral = settings.angleSpiral, 
        angleSpread = settings.angleSpread, alpha = 1 - level / maxRecursion, _results = [], 
        j = _i = 0; 0 <= items ? _i < items : items < _i; j = 0 <= items ? ++_i : --_i) branchScale = 1 - (j - (half = (items - 1) / 2)) / half * settings.symmetry, 
        w = 30 * (scale = settings.scale / level * branchScale), h = 100 * scale, rotation = angleSpread * (j - half) + branchAngle * angleSpiral, 
        ctx.save(), ctx.translate(x, y), ctx.rotate(rotation), 0, ctx.fillStyle = "rgba(0,0,0," + alpha + ")", 
        ctx.fillRect(1 * -w / 2, 0, 1 * w, 1 * h), ctx.restore(), newX = x + h * -Math.sin(rotation), 
        newY = y + h * Math.cos(rotation), level < maxRecursion ? _results.push(draw(newX, newY, rotation, level, j)) : _results.push(void 0);
        return _results;
    }, function() {
        (canvas = d.createElement("canvas")).width = canvas.height = 600, d.body.appendChild(canvas), 
        ctx = canvas.getContext("2d"), redraw();
    }();
}).call(this);