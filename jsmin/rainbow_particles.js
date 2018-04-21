"use strict";

var con = console, sw = window.innerWidth, sh = window.innerHeight, bmp = document.createElement("canvas");

bmp.width = sw, bmp.height = sh, document.body.appendChild(bmp);

var ctx = bmp.getContext("2d"), circleRads = 2 * Math.PI, numInitial = 15, numCurrent = numInitial, numMax = 30, particles = [], deaths = [];

function moveParticle(p) {
    p.dying && p.age++, p.dirFloat += (Math.random() - .5) * Math.PI * .5, p.dir -= .01 * (p.dir - p.dirFloat), 
    p.vx = Math.cos(p.dir) * p.speed, p.vy = Math.sin(p.dir) * p.speed, p.x += p.vx, 
    p.y += p.vy;
    p.x > sw + 100 && (p.x -= sw + 200), p.x < -100 && (p.x += sw + 200), p.y > sh + 100 && (p.y -= sh + 200), 
    p.y < -100 && (p.y += sh + 200), p.angle = Math.atan(p.vy / p.vx);
    var a = -p.angle;
    p.vx <= 0 && (a += Math.PI);
    for (var j = 0; j < p.lines; j++) {
        ctx.fillStyle = p.palette[j];
        var r = 3;
        p.dying && (r /= 1 + .01 * p.age);
        var d = (j - p.lines / 2 + .5) * r * 2, x = p.x + Math.sin(a) * d, y = p.y + Math.cos(a) * d;
        ctx.beginPath(), ctx.arc(x, y, r, 0, circleRads, !1), ctx.closePath(), ctx.fill();
    }
    p.dying && 500 < p.age ? killParticle(p) : 0 == p.children && numCurrent < numMax && .99 < Math.random() && spawnParticle(p);
}

function killParticle(p) {
    var index = particles.indexOf(p);
    particles.splice(index, 1), numCurrent--, deaths.push({
        anim: 0,
        lines: p.lines,
        x: p.x,
        y: p.y
    });
}

function animateDeath(death) {
    death.anim++;
    if (50 < death.anim) {
        var index = deaths.indexOf(death);
        deaths.splice(index, 1);
    } else for (var d = .4 * death.anim, perc = (50 - death.anim) / 50, j = 0; j < death.lines; j++) {
        var a = j / death.lines * Math.PI * 2, x = death.x + Math.sin(a) * d, y = death.y + Math.cos(a) * d, r = perc + .01;
        ctx.fillStyle = "rgba(255,255,255," + perc + ")", ctx.beginPath(), ctx.arc(x, y, r, 0, circleRads, !1), 
        ctx.closePath(), ctx.fill();
    }
}

function generateParticle(parent) {
    if (parent) return {
        age: 0,
        children: 0,
        dir: parent.dir,
        dirFloat: parent.dirFloat,
        dying: !1,
        lines: parent.lines,
        palette: parent.palette,
        speed: parent.speed,
        vx: parent.vx,
        vy: parent.vy,
        x: parent.x,
        y: parent.y
    };
    for (var lines = 3 + parseInt(6 * Math.random()), palette = [], i = 0; i < lines; i++) palette.push("hsl(" + i / lines * 360 + ",50%,50%)");
    return {
        age: 0,
        children: 0,
        dir: Math.random() * Math.PI * 2,
        dirFloat: 0,
        dying: !1,
        lines: lines,
        palette: palette,
        speed: 1.5 * Math.random() + .5,
        vx: 0,
        vy: 0,
        x: Math.random() * sw,
        y: Math.random() * sh
    };
}

function spawnParticle(parent) {
    parent.dying = !0, parent.children++, particles[numCurrent] = generateParticle(parent), 
    numCurrent++;
}

function generate() {
    for (var i = 0; i < numInitial; i++) particles[i] = generateParticle();
}

function render(time) {
    ctx.fillStyle = "rgba(0,0,0,0.04)", ctx.fillRect(0, 0, sw, sh);
    for (var i = 0; i < deaths.length; i++) animateDeath(deaths[i]);
    for (i = 0; i < numCurrent; i++) moveParticle(particles[i]);
    requestAnimationFrame(render);
}

window.addEventListener("resize", function() {
    bmp.width = sw = window.innerWidth, bmp.height = sh = window.innerHeight;
}), generate(), render(0);