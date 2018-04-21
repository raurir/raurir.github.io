"use strict";

var Canvas, fs, isNode = "undefined" != typeof module;

isNode && (Canvas = require("canvas"), fs = require("fs"));

var con = console, dot = 1, sizeX = sizeY = isNode ? 4e3 : 400, total = 10, current = 8;

function frand(x) {
    return Math.random() * x;
}

var settings = {};

function positionPoint(index, total) {
    var dim = Math.floor(Math.sqrt(total)), x = index % dim + .5, y = Math.floor(index / dim) + .5, blockX = width / dim / dot, blockY = height / dim / dot, centreX = width / 2 / dot, centreY = height / 2 / dot, radius = index / total * centreX, angle = index / total * Math.PI * index * (.5 + frand(20));
    return [ [ frand(sizeX), frand(sizeY) ], [ centreX + Math.sin(angle) * width / 3, centreY + Math.cos(angle) * height / 3 ], [ centreX + Math.sin(angle) * radius, centreY + Math.cos(angle) * radius ], [ (x - settings.pointBias / 2 + frand(settings.pointBias)) * blockX, (y - settings.pointBias / 2 + frand(settings.pointBias)) * blockY ] ][settings.pointMethod];
}

function renderRegion(region, bounds) {
    var pattern = createPattern((bounds.width > bounds.height ? bounds.width : bounds.height) + 10), regionCanvas = createCanvas(width, height);
    regionCanvas.ctx.globalCompositeOperation = "source-over", regionCanvas.ctx.fillStyle = "red";
    for (var r = 0; r < region.length; r++) {
        var x = region[r][0], y = region[r][1];
        regionCanvas.ctx.fillRect(x * dot, y * dot, dot, dot);
    }
    regionCanvas.ctx.globalCompositeOperation = "source-in", regionCanvas.ctx.drawImage(pattern, bounds.x - 5, bounds.y - 5), 
    ctx.drawImage(regionCanvas.canvas, 0, 0);
}

function createPattern(size) {
    var half = size / 2, canvas = createCanvas(size, size), ctx = canvas.ctx;
    ctx.translate(half, half), ctx.rotate(settings.baseRotation + frand(settings.varyRotation)), 
    ctx.translate(-half, -half), settings.varyDuotone ? (colours.setColourIndex(1), 
    ctx.fillStyle = colours.getCurrentColour()) : ctx.fillStyle = colours.getRandomColour();
    var colour, padding = Math.sqrt(half * half * 2) - half;
    settings.varyPerRegion && (settings.lineScale = .5 + frand(settings.overallScale), 
    settings.lineSize = 1 + frand(10) * settings.lineScale, settings.lineGap = 2 + frand(3) * settings.lineScale), 
    settings.varyDuotone && (colour = colours.getNextColour());
    for (var y = -padding; y < size + padding; ) settings.varyPerLine && (settings.lineSize = 1 + frand(10) * settings.lineScale, 
    settings.lineGap = 2 + frand(3) * settings.lineScale), settings.varyDuotone || (colour = colours.getRandomColour()), 
    ctx.fillStyle = colour, ctx.fillRect(-padding, y, size + 2 * padding, settings.lineSize), 
    y += settings.lineSize + settings.lineGap;
    return canvas.canvas;
}

function createCanvas(w, h) {
    var c;
    return isNode ? c = new Canvas(w, h) : ((c = document.createElement("canvas")).width = w, 
    c.height = h), {
        canvas: c,
        ctx: c.getContext("2d")
    };
}

settings.overallScale = 50 + frand(150), settings.pointMethod = ~~(4 * Math.random()), 
settings.pointBias = frand(2), settings.lineScale = settings.overallScale, settings.lineSize = 1 + frand(100), 
settings.lineGap = 1 + frand(100), settings.baseRotation = 2 * Math.PI, settings.varyRotation = Math.PI * (.5 < Math.random() ? 2 : .2), 
settings.varyPerRegion = !1, settings.varyPerLine = !1, settings.varyDuotone = !1, 
settings.varyDuotone && colours.setRandomPalette(0);

var v = voronoi.init({
    dot: dot,
    sizeX: sizeX,
    sizeY: sizeY
}), width = v.width, height = v.height, canvas = createCanvas(width, height);

isNode || document.body.appendChild(canvas.canvas);

var ctx = canvas.ctx, q0 = createCanvas(width / 2, height / 2), q1 = createCanvas(width / 2, height / 2), q2 = createCanvas(width / 2, height / 2), q3 = createCanvas(width / 2, height / 2);

function drawQuarter(source, target, q) {
    var x = q % 2 * -width / 2, y = Math.floor(q / 2) * -height / 2;
    con.log("drawQuarter", q, x, y), target.canvas.width = target.canvas.width, target.ctx.drawImage(source.canvas, x, y);
    var out = fs.createWriteStream(__dirname + "/../export/shirt" + current + "_" + q + ".png"), stream = target.canvas.pngStream();
    stream.on("data", function(chunk) {
        out.write(chunk);
    }), stream.on("end", function() {
        console.log("saved png");
    });
}

function saveFile(canvas) {
    isNode ? canvas.toBuffer(function(err, buf) {
        err ? con.log(err) : fs.writeFile(__dirname + "/../export/shirt" + current + ".png", buf, function() {
            con.log("writeFile", "shirt" + current + ".png");
        });
    }) : con.warn("browser export not written");
}

function generate(num) {
    current = num, settings.sites = 16 + frand(20), settings.varyDuotone = .5 < Math.random();
    var txt = [ "sites", "overallScale", "pointMethod", "pointBias", "baseRotation", "varyRotation", "varyDuotone", "varyPerRegion", "varyPerLine", "lineScale", "lineSize", "lineGap" ].map(function(v) {
        return v + ":" + settings[v];
    }).join("\n");
    isNode && fs.writeFile(__dirname + "/../export/_shirt" + current + ".txt", txt), 
    con.log(txt), con.log("==================="), canvas.canvas.width = canvas.canvas.width, 
    voronoi.init({
        dot: dot,
        sites: settings.sites,
        sizeX: sizeX,
        sizeY: sizeY
    }), colours.setRandomPalette(), con.log("generate", current, total), voronoi.genPoints(positionPoint), 
    voronoi.genMap(), voronoi.drawRegions(renderRegion), saveFile(canvas.canvas);
}

function next() {
    if (++current < total) {
        var delay = 5e3;
        current % 5 == 0 && (delay = 5e4), con.log("delaying", delay / 1e3, "seconds"), 
        setTimeout(generate, delay);
    }
}

isNode || generate(0), "undefined" != typeof module && (module.exports = {
    generate: generate
});