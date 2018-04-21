"use strict";

var hitpixels, con = console, sw = window.innerWidth, sh = window.innerHeight, canvas = dom.canvas(sw, sh), hit = dom.canvas(sw, sh), ctx = canvas.ctx, circleRads = 2 * Math.PI, numInitial = 30, numCurrent = numInitial, numMax = 3 * numInitial, particles = [], zones = [];

function moveParticle(p) {
    p.dying && p.age++, p.dirFloat += (Math.random() - .5) * Math.PI * .5, p.dir -= .01 * (p.dir - p.dirFloat), 
    p.vx = Math.cos(p.dir) * p.speed, p.vy = Math.sin(p.dir) * p.speed, p.x += p.vx, 
    p.y += p.vy;
    p.x > sw + 100 && (p.x -= sw + 200, p.px = p.x), p.x < -100 && (p.x += sw + 200, 
    p.px = p.x), p.y > sh + 100 && (p.y -= sh + 200, p.py = p.y), p.y < -100 && (p.y += sh + 200, 
    p.py = p.y);
    var r = 2;
    p.dying && (r /= 1 + .01 * p.age);
    var x = p.x, y = p.y, index = 4 * (Math.floor(p.x) + Math.floor(p.y) * sw), isRed = hitpixels.data[index];
    isRed || (ctx.lineWidth = r, ctx.strokeStyle = p.palette, ctx.beginPath(), ctx.moveTo(p.px, p.py), 
    ctx.lineTo(x, y), ctx.stroke()), isRed && (p.dir = Math.random() * Math.PI * 2), 
    p.px = p.x, p.py = p.y, p.dying && 500 < p.age ? killParticle(p) : 0 == p.children && numCurrent < numMax && .99 < Math.random() && spawnParticle(p);
}

function killParticle(p) {
    var index = particles.indexOf(p);
    particles.splice(index, 1), numCurrent--;
}

function generateParticle(parent) {
    if (parent) return {
        age: 0,
        children: 0,
        dir: parent.dir,
        dirFloat: parent.dirFloat,
        dying: !1,
        palette: colours.mutateColour(parent.palette, 10),
        speed: parent.speed,
        vx: parent.vx,
        vy: parent.vy,
        x: parent.x,
        y: parent.y,
        px: parent.x,
        py: parent.y
    };
    var x = Math.random() * sw, y = Math.random() * sh;
    return {
        age: 0,
        children: 0,
        dir: Math.random() * Math.PI * 2,
        dirFloat: 0,
        dying: !1,
        palette: colours.getNextColour(),
        speed: 2.5 * Math.random() + 2.5,
        vx: 0,
        vy: 0,
        x: x,
        y: y,
        px: x,
        py: y
    };
}

function spawnParticle(parent) {
    parent.dying = !0, parent.children++, particles[numCurrent] = generateParticle(parent), 
    numCurrent++;
}

function generate() {
    zones.push({
        x: 50,
        y: 50,
        w: 100,
        h: 100
    }), zones.push({
        x: 100,
        y: 250,
        w: 20,
        h: 100
    }), zones.push({
        x: 300,
        y: 50,
        w: 100,
        h: 300
    });
    for (var j = 0; j < zones.length; j++) {
        var z = zones[j];
        hit.ctx.fillStyle = "rgba(50,0,0,1)", hit.ctx.fillRect(z.x, z.y, z.w, z.h);
    }
    hitpixels = hit.ctx.getImageData(0, 0, sw, sh);
    for (var i = 0; i < numInitial; i++) particles[i] = generateParticle();
}

function render(time) {
    ctx.fillStyle = "rgba(0,0,0,0.04)", ctx.fillRect(0, 0, sw, sh), ctx.drawImage(hit.canvas, 0, 0);
    for (var i = 0; i < numCurrent; i++) moveParticle(particles[i]);
    requestAnimationFrame(render);
}

colours.getRandomPalette(), window.addEventListener("resize", function() {
    return con.warn("resize disabled!");
}), generate(), document.body.appendChild(canvas.canvas), render(0);