"use strict";var con=console,isNode="undefined"!=typeof module;if(isNode)var rand=require("./rand.js"),dom=require("./dom.js"),colours=require("./colours.js");var rectangular_fill=function(){var block,stroke,rows=30,cols=20,populated=[],available=[],squares=[],total=0,bmp=dom.canvas(1,1);var attempts=0,lastProgress=0;function tryPosition(){var size=17;if(5e3<++attempts)size=1;else if(1e4<attempts)return render(),con.warn("bailing!",attempts);if(attempts%100==0){var currentProgress=(total-available.length)/total;lastProgress!==currentProgress&&progress("render:progress",currentProgress),lastProgress=currentProgress}!function(size){var width=Math.ceil(rand.random()*size),height=Math.ceil(rand.random()*size),colour=colours.getRandomColour(),startIndex=Math.floor(available.length*rand.random()),start=available[startIndex],y=start%rows,x=Math.floor(start/rows),ok=!0,xxe=x+width;cols<xxe&&(width=(xxe=cols)-x);var yye=y+height;rows<yye&&(height=(yye=rows)-y);for(var xx=x;xx<xxe&&ok;xx++)for(var yy=y;yy<yye&&ok;yy++)populated[xx][yy]&&(ok=!1);if(ok){for(xx=x;xx<xxe&&ok;xx++)for(yy=y;yy<yye&&ok;yy++){populated[xx][yy]=colour;var id=xx*rows+yy,availIndex=available.indexOf(id);available.splice(availIndex,1)}squares.push({colour:colour,x:x*block+stroke,y:y*block+stroke,w:width*block-2*stroke,h:height*block-2*stroke})}}(size),available.length?(attempts+1)%1e3==0?setTimeout(tryPosition,100):tryPosition():render()}function render(){bmp.ctx.setTransform(1,.2*rand.random()-.1,.2*rand.random()-.1,1,0,0);for(var s=0,sl=squares.length;s<sl;s++){var rect=squares[s];bmp.ctx.fillStyle=rect.colour,bmp.ctx.fillRect(rect.x,rect.y,rect.w,rect.h)}progress("render:complete",bmp.canvas)}return{name:"Rectangular Fill",stage:bmp.canvas,resize:function(w,h){bmp.setSize(w,h,!0)},init:function(){colours.getRandomPalette(),block=Math.round(20*(.2+.8*rand.random())),stroke=block*(.1+rand.random())*.4,bmp.setSize(block*cols,block*rows);for(var x=0;x<cols;x++){populated[x]=[];for(var y=0;y<rows;y++)populated[x][y]=0,available.push(x*rows+y)}total=cols*rows,tryPosition()},kill:function(){}}};isNode?module.exports=rectangular_fill():define("rectangular_fill",rectangular_fill);