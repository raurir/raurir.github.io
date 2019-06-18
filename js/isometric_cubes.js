"use strict";var sw=400,sh=400,bmp=dom.canvas(sw,sh),ctx=bmp.ctx,cx=sw/2,cy=sh/2,frame=0;function newLine(){ctx.clearRect(0,0,sw,sh);var gap,rotation,dot=70,anim=frame%400,phase=Math.floor(anim/100);switch(anim=(anim-100*phase)/100,phase){case 0:gap=1-anim,rotation=1;break;case 1:gap=0,rotation=1-anim;break;case 2:gap=anim,rotation=0;break;case 3:gap=1,rotation=anim}var angle=30*rotation/360*Math.PI*2,cos=dot*Math.cos(angle),sin=dot*Math.sin(angle);function drawCube(x,y,face){var ax=x,ay=y,bx=x+cos*rotation,by=y-sin,cx=x+cos+cos*rotation,cy=y,dx=cx,dy=y+dot,ex=x+cos,ey=y+sin+dot,fx=x,fy=y+dot,gx=ex,gy=y+sin;switch(ctx.beginPath(),face){case 0:ctx.fillStyle="#444",ctx.moveTo(ax,ay),ctx.lineTo(gx,gy),ctx.lineTo(ex,ey),ctx.lineTo(fx,fy);break;case 1:ctx.fillStyle="#666",ctx.moveTo(gx,gy),ctx.lineTo(cx,cy),ctx.lineTo(dx,dy),ctx.lineTo(ex,ey);break;case 2:ctx.fillStyle="#888",ctx.moveTo(ax,ay),ctx.lineTo(gx,gy),ctx.lineTo(cx,cy),ctx.lineTo(bx,by)}ctx.closePath(),ctx.fill()}for(var gapX=.4+.6*gap,gapY=gapX,i=0;i<9;i++)for(var x=i*cos*2*gapX-10,j=12;-1<j;j--){var y=j*dot*2*gapY-300+i*sin*2*gapY;drawCube(x,y,1),drawCube(x,y,2),drawCube(x,y,0)}frame+=.5,requestAnimationFrame(newLine)}document.body.appendChild(bmp.canvas),newLine();