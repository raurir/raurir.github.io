"use strict";var con=console;var isNode=typeof module!=="undefined";if(isNode){var rand=require("./rand.js");var dom=require("./dom.js");var colours=require("./colours.js")}var rectangular_fill=function rectangular_fill(){var size=800,sw=size,sh=size;var block,stroke;var rows=30;var cols=20;var populated=[];var available=[];var squares=[];var total=0;var bmp=dom.canvas(1,1);function setBlock(size){var width=Math.ceil(rand.random()*size);var height=Math.ceil(rand.random()*size);var colour=colours.getRandomColour();var startIndex=Math.floor(available.length*rand.random());var start=available[startIndex];var y=start%rows;var x=Math.floor(start/rows);var ok=true;var xxe=x+width;if(xxe>cols){xxe=cols;width=cols-x}var yye=y+height;if(yye>rows){yye=rows;height=rows-y}for(var xx=x;xx<xxe&&ok;xx++){for(var yy=y;yy<yye&&ok;yy++){if(populated[xx][yy])ok=false}}if(ok){for(var xx=x;xx<xxe&&ok;xx++){for(var yy=y;yy<yye&&ok;yy++){populated[xx][yy]=colour;var id=xx*rows+yy;var availIndex=available.indexOf(id);available.splice(availIndex,1)}}squares.push({colour:colour,x:x*block+stroke,y:y*block+stroke,w:width*block-2*stroke,h:height*block-2*stroke})}}var attempts=0;var lastProgress=0;function tryPosition(){attempts++;var size=17;if(attempts>1e4/2){size=1}else if(attempts>1e4){render();return con.warn("bailing!",attempts)}if(attempts%100==0){var currentProgress=(total-available.length)/total;if(lastProgress!==currentProgress)progress("render:progress",currentProgress);lastProgress=currentProgress}setBlock(size);if(available.length){if((attempts+1)%1e3==0){setTimeout(tryPosition,100)}else{tryPosition()}}else{render()}}function init(){colours.getRandomPalette();block=Math.round(20*(.2+rand.random()*.8));stroke=block*(.1+rand.random())*.4;bmp.setSize(block*cols,block*rows);for(var x=0;x<cols;x++){populated[x]=[];for(var y=0;y<rows;y++){populated[x][y]=0;available.push(x*rows+y)}}total=cols*rows;tryPosition()}function render(){bmp.ctx.setTransform(1,rand.random()*.2-.1,rand.random()*.2-.1,1,0,0);for(var s=0,sl=squares.length;s<sl;s++){var rect=squares[s];bmp.ctx.fillStyle=rect.colour;bmp.ctx.fillRect(rect.x,rect.y,rect.w,rect.h)}progress("render:complete",bmp.canvas)}return{name:"Rectangular Fill",stage:bmp.canvas,resize:function resize(w,h){bmp.setSize(w,h,true)},init:init,kill:function kill(){}}};if(isNode){module.exports=rectangular_fill()}else{define("rectangular_fill",rectangular_fill)}