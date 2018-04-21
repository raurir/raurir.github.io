"use strict";define("fur",["perlin"],function(perlin){var pixel=4;var furSize=20;var w=160;var h=160;var sw=w*pixel,sh=h*pixel;var c=dom.canvas(sw,sh);var d=c.ctx;var channelX=perlin.noise(w,h);var channelY=perlin.noise(w,h);var distort=[],distortion=4;for(var i=0,il=w*h;i<il;i++){var r=rand.getInteger(125,145);var g=rand.getInteger(105,125);var b=rand.getInteger(75,95);distort.push({x:rand.getNumber(-1,1)*distortion,y:rand.getNumber(-1,1)*distortion,colour:"rgba("+r+","+g+","+b+",0.5)"})}function drawIt(time){requestAnimationFrame(drawIt);var t=time*.002;var scale=.004;var leanX=channelX.cycle(t,scale);var leanY=channelY.cycle(t,scale);d.fillStyle="black";d.fillRect(0,0,sw,sh);for(var i=0,il=w*h;i<il;i++){var xi=i%w;var yi=Math.floor(i/w);var lx=leanX[i]-.5;var ly=leanY[i]-.5;var x=(distort[i].x+xi+.5)*pixel;var y=(distort[i].y+yi+.5)*pixel;d.strokeStyle=distort[i].colour;d.beginPath();d.moveTo(x,y);d.lineTo(x+15+lx*furSize,y+5+ly*furSize);d.stroke()}}return{resize:function resize(w,h){c.setSize(w,h,true)},init:function init(){drawIt(0)},stage:c.canvas}});