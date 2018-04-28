"use strict";define("oscillator",function(){var h,yo,sw=window.innerWidth,sh=window.innerHeight,bg=(colours.getRandomPalette(),colours.getRandomColour()),fg=colours.getNextColour(),canvas=dom.canvas(sw,sh),ctx=canvas.ctx,circleSize=1,oscRange=10,range=Math.ceil(200),xGap=sw/range,yGap=sh/range,oscs=[],oscillators=10;function getOsc(i,a,range){for(var temp=0,o=0;o<oscillators;o++)0,temp+=Math.sin(i*oscs[o][a])*range;return temp}var start=rand.getInteger(0,1e6);return{init:function(){!function(){for(var o=0;o<oscillators;o++)oscs[o]=[],oscs[o][0]=rand.getNumber(0,.1),oscs[o][1]=rand.getNumber(0,.1),oscs[o][2]=rand.getNumber(0,.1),oscs[o][3]=rand.getNumber(0,.1)}(),function(time){ctx.fillStyle=bg,ctx.fillRect(0,0,sw,sh),ctx.fillStyle=fg,h=.02*time;for(var rows=yo=0;rows<range;){for(var i=0;i<range;i++){var t=start+i,j=getOsc(t,0,oscRange),k=getOsc(t,1,oscRange),l=getOsc(t+h,2,oscRange),m=getOsc(t-h,3,oscRange),xp=l+j+xGap*i,yp=m+k+yo;ctx.beginPath(),ctx.drawCircle(xp,yp,circleSize),ctx.fill()}h+=.4,yo+=yGap,rows++}}(0)},stage:canvas.canvas}});