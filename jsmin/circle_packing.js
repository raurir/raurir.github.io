"use strict";var isNode=typeof module!=="undefined";if(isNode){var con=console;var rand=require("./rand.js");var dom=require("./dom.js");var colours=require("./colours.js")}var circle_packing=function circle_packing(){var TAU=Math.PI*2;var sw,sh;var cx=.5,cy=.5;var bmp=dom.canvas(1,1);function error(site,depth,err){return;bmp.ctx.fillStyle=err||"green";var siteSize=err?1:7;bmp.ctx.fillRect(site.x*sw-siteSize/2,site.y*sh-siteSize/2,siteSize,siteSize)}var experiment={stage:bmp.canvas,init:init,settings:{}};var threadOutput=dom.canvas(800,300);function init(options){console.time("process time");var size=options.size;sw=size;sh=size;bmp.setSize(sw,sh);colours.getRandomPalette();bmp.ctx.clearRect(0,0,sw,sh);var threads=0;var iterations=0;var circles=0,circlesLast=0,circlesSame=0;var gap=rand.getNumber(.001,.02);con.log("gap",gap);var minRadius=rand.getNumber(.001,.01);var maxRadius=rand.getNumber(minRadius+.02,.5);var maxDepth=rand.getInteger(1,10);var limitMaxRadius=rand.getInteger(0,2);var powerMaxRadius=rand.getNumber(.8,3);var limitMinRadius=rand.getInteger(0,1);con.log("limitMaxRadius",limitMaxRadius);con.log("powerMaxRadius",powerMaxRadius);con.log("limitMinRadius",limitMinRadius);var banding=rand.getNumber()>.7;var bandScale=rand.getInteger(4,20);var bandModulo=rand.getInteger(2,10);var alternatePunchOut=rand.getNumber()>.7;var bailed=false;var progressTicker=0;var fakeProgress=.1;var progressChecker=function progressChecker(){if(threads==-1){con.log("progressChecker",threads);progress("render:complete",bmp.canvas);bailed=true}else{setTimeout(progressChecker,250)}};progressChecker();function attemptNextCircle(parent,attempt){threads++;attempt++;progressTicker++;threadOutput.ctx.fillRect(progressTicker/500,0,1,threads/50);if(circles%100==0){fakeProgress-=(fakeProgress-1)*.02;progress("render:progress",fakeProgress)}if(attempt<5e3){var delay=iterations%100?0:200;if(delay){setTimeout(function(){attemptCircle(parent,attempt)},delay)}else{attemptCircle(parent,attempt)}}else{con.log("too many attempt")}}function attemptCircle(parent,attempt,options){threads--;iterations++;var colour,depth,distance,dx,dy,other,r,radius,site,y,x;if(parent){if(!parent.sites.length){return}depth=parent.depth+1;var index=Math.floor(rand.random()*parent.sites.length);site=parent.sites.splice(index,1)[0];x=site.x;y=site.y;dx=parent.x-x;dy=parent.y-y;distance=Math.sqrt(dx*dx+dy*dy);radius=parent.r-distance-gap;switch(limitMaxRadius){case 1:maxRadius=.01+Math.pow(.5-distance,powerMaxRadius);break;case 2:maxRadius=.01+Math.pow(distance,powerMaxRadius);break}switch(limitMinRadius){case 1:minRadius=maxRadius*.1;break}r=rand.random()*radius;if(r>maxRadius){r=maxRadius}else if(r<minRadius){r=minRadius}if(options){if(options.r){r=options.r}if(options.x){x=options.x}if(options.y){y=options.y}}if(r-gap<minRadius){error(site,depth,"blue");return attemptNextCircle(parent,attempt)}var ok=true;for(var i=0,il=parent.children.length;i<il&&ok;i++){other=parent.children[i];dx=x-other.x;dy=y-other.y;distance=Math.sqrt(dx*dx+dy*dy);var distanceCombined=r+other.r+gap;if(distanceCombined>distance){r=distance-other.r-gap;if(r<minRadius){ok=false}}}if(ok===false){error(site,depth,"yellow");return attemptNextCircle(parent,attempt)}}else{x=cx;y=cy;r=.5;depth=0}if(options&&options.colour){colour=options.colour}else{colour=colours.getRandomColour();while(parent&&parent.colour==colour){colour=colours.getNextColour()}}if(alternatePunchOut){bmp.ctx.globalCompositeOperation=(depth+1)%2?"destination-out":"source-over"}bmp.ctx.beginPath();bmp.ctx.fillStyle=colour;bmp.ctx.drawCircle(x*sw,y*sh,r*sw);bmp.ctx.closePath();bmp.ctx.fill();var grid=.01;var rings=Math.ceil(r/grid);grid=r/rings;var sites=[];for(var ring=0;ring<rings;ring++){var perimeter=ring*grid*TAU;var segments=Math.ceil(perimeter/grid)||6;for(var segment=0;segment<segments;segment++){var siteRadius=(ring+rand.getNumber(0,1))*grid,siteAngle=(segment+rand.getNumber(0,1))/segments*TAU,siteX=x+Math.sin(siteAngle)*siteRadius,siteY=y+Math.cos(siteAngle)*siteRadius,site={x:siteX,y:siteY};if(banding){if(parseInt(siteRadius*bandScale)%bandModulo==0){sites.push(site)}}else{sites.push(site)}}}if(site){error(site,depth,false)}var circle={colour:colour,depth:depth,x:x,y:y,r:r,children:[],sites:sites};circles++;if(parent&&parent.children){parent.children.push(circle)}if(depth<maxDepth){for(var i=0,il=circle.sites.length;i<il;i++){attemptNextCircle(circle,0)}}}var container=attemptCircle(null,0,{colour:"transparent"})}return experiment};if(isNode){module.exports=circle_packing()}else{define("circle_packing",circle_packing)}