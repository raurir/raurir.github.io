"use strict";var vertexShader="varying vec2 vUv;\nvoid main()\n{\n  vUv = uv;\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = projectionMatrix * mvPosition;\n}",fragmentShader="\nuniform float r;\nuniform float g;\nuniform float b;\nuniform float distance;\nuniform float pulse;\nuniform float rows;\nuniform float cols;\nvarying vec2 vUv;\nfloat checkerRows = 1.5;\nfloat checkerCols = 2.0;\nvoid main( void ) {\n  vec2 position = abs(-1.0 + 2.0 * vUv);\n\n  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 1.0);\n\n  float perc = 0.25 + distance * edging * 0.75;\n  vec2 checkPosition = vUv;\n  \n  float checkerX = mod(checkPosition.x, 1.0 / rows) * rows; // loop of 0 to 1 per row: /|/|/|//\n  checkerX = abs(checkerX - 0.5) * 2.0; // make up and down: /// \n  checkerX = pow(checkerX, 3.0); // power to sharpen edges: __/__/\n\n  float checkerY = mod(checkPosition.y, 1.0 / cols) * cols;\n  checkerY = abs(checkerY - 0.5) * 2.0;\n  checkerY = pow(checkerY, 3.0);\n\n  float checkerMod = 0.0;\n  if (rows > 1.0 && floor(checkPosition.x * rows) == checkerMod) {\n    perc = 2.0;\n  }\n  if (cols > 1.0 && floor(checkPosition.y * cols) == checkerMod) {\n    perc = 2.0;\n  }\n\n  // float checker = (checkerX * checkerY) * 2.0;\n  float checker = (checkerX + checkerY) * 0.5;\n  float r1 = r * checker + 0.1;\n  float g1 = g * checker + 0.05;\n  float b1 = b * checker + 0.2;\n  float red = r1 * perc + pulse;\n  float green = g1 * perc + pulse;\n  float blue = b1 * perc + pulse + 0.05;\n\n  // float red = r;\n  // float green = g;\n  // float blue = b;\n\n  gl_FragColor = vec4(red, green, blue, 1.0);\n}",perlin_grid=function(noise){var camera,renderer,stage=document.createElement("div"),mouse={x:0,y:0},sw=window.innerWidth,sh=window.innerHeight;Math.random();function listen(eventNames,callback){for(var i=0;i<eventNames.length;i++)window.addEventListener(eventNames[i],callback)}return listen(["resize"],function(e){sw=window.innerWidth,sh=window.innerHeight,camera.aspect=sw/sh,camera.updateProjectionMatrix(),renderer.setSize(sw,sh)}),listen(["mousedown","touchstart"],function(e){e.preventDefault(),isMouseDown=!0}),listen(["mousemove","touchmove"],function(e){e.preventDefault(),e.changedTouches&&e.changedTouches[0]&&(e=e.changedTouches[0]),mouse.x=e.clientX/sw*2-1,mouse.y=-e.clientY/sh*2+1}),listen(["mouseup","touchend"],function(e){e.preventDefault(),isMouseDown=!1}),{init:function(){},stage:stage}};define("perlin_grid",["noise"],perlin_grid);