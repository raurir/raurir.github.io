"use strict";var focalLength=1200;make3DPoint=function make3DPoint(x,y,z){var point={};point.x=x;point.y=y;point.z=z;return point};make2DPoint=function make2DPoint(x,y,z){var point={};point.x=x+sw/2;point.y=y+sh/2;point.z=z;return point};cubeAxisRotations=make3DPoint(0,0,0);function calc2D(points,axisRotations){var t=[];var sx=Math.sin(axisRotations.x);var cx=Math.cos(axisRotations.x);var sy=Math.sin(axisRotations.y);var cy=Math.cos(axisRotations.y);var sz=Math.sin(axisRotations.z);var cz=Math.cos(axisRotations.z);var x,y,z,xy,xz,yx,yz,zx,zy,scaleRatio;for(var i=0,il=points.length;i<il;i++){x=points[i].x;y=points[i].y;z=points[i].z;xy=cx*y-sx*z;xz=sx*y+cx*z;yz=cy*xz-sy*x;yx=sy*xz+cy*x;zx=cz*yx-sz*xy;zy=sz*yx+cz*xy;scaleRatio=focalLength/(focalLength+yz);x=zx*scaleRatio;y=zy*scaleRatio;t[i]=make2DPoint(x,y,yz)}return t}function calcNormal(p1,p2,p3){var u={};u.x=p2.x-p1.x;u.y=p2.y-p1.y;u.z=p2.z-p1.z;var v={};v.x=p3.x-p1.x;v.y=p3.y-p1.y;v.z=p3.z-p1.z;var n={};n.x=u.y*v.z-u.z*v.y;n.y=u.z*v.x-u.x*v.z;n.z=u.x*v.y-u.y*v.x;return n}renderPlanes=function renderPlanes(group,planesArray,options){var list=[];for(var i=0,il=planesArray.length;i<il;i++){var screenPoints=calc2D(planesArray[i],cubeAxisRotations);var minX=1e6,minY=1e6,minZ=1e6,maxX=0,maxY=0,maxZ=0;var vertices=[];var av={x:0,y:0};var vil=screenPoints.length;for(var vi=0;vi<vil;vi++){var v=screenPoints[vi];vertices.push({x:v.x,y:v.y});if(v.x<minX)minX=v.x;if(v.x>maxX)maxX=v.x;if(v.y<minY)minY=v.y;if(v.y>maxY)maxY=v.y;if(v.z<minZ)minZ=v.z;if(v.z>maxZ)maxZ=v.z;av.x=av.x+v.x;av.y=av.y+v.y}av.x=av.x/vil;av.y=av.y/vil;var zIndex=minZ+(maxZ-minZ)/2;var normal3D=calcNormal(screenPoints[0],screenPoints[1],screenPoints[2]);var normalLength=Math.sqrt(normal3D.x*normal3D.x+normal3D.y*normal3D.y+normal3D.z*normal3D.z);var normalised3D={x:normal3D.x/normalLength,y:normal3D.y/normalLength,z:normal3D.z/normalLength};var fillStyle;var face={z:zIndex,o:vertices};if(options){var slope={x:Math.acos(normalised3D.x),y:Math.asin(normal3D.y/normalLength),z:Math.acos(normalised3D.z)};var params={slope:slope,bounds:[minX,minY,maxX,maxY],vertices:vil};face.params=params}list[i]=face}list.sort(function(a,b){return a.z<b.z?1:-1});for(var i=0,il=list.length;i<il;i++){var vertices=list[i].o;if(options.fillColor)group.fillStyle=options.fillColor(list[i].params);group.beginPath();for(var v=0,vl=vertices.length;v<vl;v++){var x=vertices[v].x,y=vertices[v].y;if(v==0){group.moveTo(x,y)}else{group.lineTo(x,y)}}group.closePath();group.fill()}};