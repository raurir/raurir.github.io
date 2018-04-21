"use strict";

define("frame_inverse", function() {
    var sw = window.innerWidth, sh = window.innerHeight, maxSize = rand.getInteger(100, 300), minSize = rand.getInteger(4, 10), maxBoxes = Math.floor(sw * sh / 200), cols = colours.getRandomPalette(), canvas = dom.canvas(sw, sh), ctx = canvas.ctx, pixels = [], boxes = 0, renders = 0, f = rand.getNumber(0, 1), force = null, VERTICAL = 1, HORIZONTAL = 2, SQUARE = 3;
    .9 < f ? force = VERTICAL : .8 < f ? force = HORIZONTAL : .7 < f && (force = SQUARE);
    for (var i = 0; i < sw; ) {
        pixels[i] = [];
        for (var j = 0; j < sh; ) pixels[i][j] = 0, j++;
        i++;
    }
    function getPixel(x, y) {
        return pixels[x][y];
    }
    function go() {
        if (boxes < maxBoxes) if (renders % 20) {
            requestAnimationFrame(go);
            for (var t = 0; t < 2e3; t++) hitit();
        } else progress("render:progress", boxes / maxBoxes), setTimeout(go, 200); else progress("render:complete", canvas.canvas);
        renders++;
    }
    function hitit() {
        var i = rand.getInteger(0, sw - 1), j = rand.getInteger(0, sh - 1), targColor = getPixel(i, j), dimLarge = rand.getNumber(minSize, maxSize), dimSmall = rand.getNumber(1, minSize), sizeX = dimLarge, sizeY = dimSmall;
        switch (force) {
          case HORIZONTAL:
            break;

          case VERTICAL:
            sizeX = dimSmall, sizeY = dimLarge;
            break;

          case SQUARE:
            sizeY = sizeX = dimLarge;
            break;

          default:
            .5 < rand.getNumber(0, 1) && (sizeX = dimSmall, sizeY = dimLarge);
        }
        if (!(sw < i + sizeX || sh < j + sizeY)) {
            for (var k = i; k < i + sizeX; ) {
                for (var l = j; l < j + sizeY; ) {
                    if (getPixel(k, l) != targColor) return !1;
                    l++;
                }
                k++;
            }
            if (sizeY -= 2, 1 <= (sizeX -= 2) && 1 <= sizeY) (function(x, y, w, h, colour) {
                ctx.fillStyle = colour, ctx.fillRect(x, y, w, h);
                for (var iw = x + w, jh = y + h, i = x; i < iw; ) {
                    for (var j = y; j < jh; ) pixels[i][j] = colour, j++;
                    i++;
                }
                boxes++;
            })(i + 1, j + 1, sizeX, sizeY, cols[parseInt(5 * Math.random())]);
        }
    }
    return {
        init: function() {
            var bg = colours.getRandomColour();
            cols.splice(cols.indexOf(bg), 1), ctx.fillStyle = bg, ctx.fillRect(0, 0, sw, sh), 
            go();
        },
        stage: canvas.canvas
    };
});