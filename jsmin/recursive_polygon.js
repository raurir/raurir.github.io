"use strict";var isNode="undefined"!=typeof module;if(isNode)var dom=require("./dom.js");function splitPolygon(array,start,end){var copy=array.slice(),chunk1=copy.slice(0,start+1),chunk3=copy.splice(end,array.length-end),chunk2=array.slice().splice(start,end-start+1);return[chunk1.concat(chunk3),chunk2]}var recursive_polygon=function(){var insetDistance,mutateThreshold,mutateAmount,maxDepth,sides,splitLongest,splitEdgeRatioLocked,insetLocked,insetLockedValue,insetThreshold,wonky,sw=700,sh=700,bmp=dom.canvas(sw,sh);var iterations=0;function drawNext(parent){!function(){var depth=parent.depth+1;if(maxDepth<depth)return;if(1e4<++iterations)return;var slicerStart,slicerEnd,copied=parent.points.slice(),len=copied.length;if(3<len){var offset=rand.getInteger(0,len),shifted=copied.splice(0,offset);copied=copied.concat(shifted),slicerStart=0,slicerEnd=rand.getInteger(2,len-2)}else{var newPoint,edge=splitLongest?function(points){function getLength(p0,p1){var dx=p0.x-p1.x,dy=p0.y-p1.y;return Math.sqrt(dx*dx+dy*dy)}for(var len=0,edgeIndex=null,i=0,il=points.length;i<il;i++){var p0=points[i],p1=points[(i+1)%il],p0p1Len=getLength(p0,p1);len<p0p1Len&&(len=p0p1Len,edgeIndex=i)}return edgeIndex}(copied):rand.getInteger(0,2),splitRatio=splitEdgeRatioLocked||rand.getNumber(.1,.9);switch(edge){case 0:newPoint=geom.lerp(copied[0],copied[1],splitRatio),copied.splice(1,0,newPoint),slicerStart=1,slicerEnd=3;break;case 1:newPoint=geom.lerp(copied[1],copied[2],splitRatio),copied.splice(2,0,newPoint),slicerStart=0,slicerEnd=2;break;case 2:newPoint=geom.lerp(copied[2],copied[0],splitRatio),copied.push(newPoint),slicerStart=1,slicerEnd=3}}var newArrays=splitPolygon(copied,slicerStart,slicerEnd);drawSplit(parent,newArrays[0],depth),drawSplit(parent,newArrays[1],depth)}()}function drawSplit(parent,points,depth){var colour=mutateThreshold&&rand.random()<mutateThreshold?colours.mutateColour(parent.colour,mutateAmount):colours.getNextColour();if(insetLocked?insetLockedValue:rand.random()>insetThreshold){var insetPoints=geom.insetPoints(points,insetDistance);insetPoints&&(drawPolygon(points,{fillStyle:colour,strokeStyle:colour,lineWidth:1}),bmp.ctx.globalCompositeOperation="destination-out",drawPolygon(insetPoints,{fillStyle:"black"}),bmp.ctx.globalCompositeOperation="source-over",drawNext({points:points,colour:colour,depth:depth}))}else drawPolygon(points,{fillStyle:colour,strokeStyle:colour,lineWidth:1}),.5<rand.random()&&drawNext({points:points,colour:colour,depth:depth})}function fillAndStroke(options){options.lineWidth&&options.strokeStyle&&(bmp.ctx.strokeStyle=options.strokeStyle,bmp.ctx.lineWidth=options.lineWidth,bmp.ctx.stroke()),options.fillStyle&&(bmp.ctx.fillStyle=options.fillStyle,bmp.ctx.fill())}function drawPolygon(points,options){bmp.ctx.beginPath();for(var i=0;i<points.length;i++){var p=points[i];bmp.ctx[0==i?"moveTo":"lineTo"](p.x,p.y)}bmp.ctx.closePath(),fillAndStroke(options)}return{stage:bmp.canvas,init:function(){(sides=3+Math.round(rand.random()*rand.random()*rand.random()*28))<5&&(wonky=.8<rand.random()),insetDistance=rand.getNumber(2,25),mutateThreshold=rand.getNumber(0,1),mutateAmount=rand.getNumber(5,30),maxDepth=rand.getInteger(1,10),splitLongest=.5<rand.random(),splitEdgeRatioLocked=.5<rand.random()&&.5,(insetLocked=.5<rand.random())?insetLockedValue=.5<rand.random():insetThreshold=.5*rand.random(),con.log("sides",sides),con.log("wonky",wonky),con.log("insetDistance",insetDistance),con.log("mutateThreshold",mutateThreshold),con.log("mutateAmount",mutateAmount),con.log("maxDepth",maxDepth),con.log("splitLongest",splitLongest),con.log("splitEdgeRatioLocked",splitEdgeRatioLocked),con.log("insetLocked",insetLocked),con.log("insetLockedValue",insetLockedValue),con.log("insetThreshold",insetThreshold),colours.getRandomPalette(),function(){for(var colour=colours.getNextColour(),i=0,points=[],angles=[];angles.length<sides;)angles.push(i/sides),i++;for(angles.sort(),i=0;i<angles.length;i++){var angle=angles[i]*Math.PI*2,radius=wonky?rand.getNumber(.4,.45):.45,x=.5+Math.sin(angle)*radius,y=.5+Math.cos(angle)*radius;points.push({x:x*sw,y:y*sh})}drawNext({points:points,colour:colour,depth:0})}(),progress("render:complete",bmp.canvas)},settings:{}}};isNode?module.exports=recursive_polygon():define("recursive_polygon",recursive_polygon);