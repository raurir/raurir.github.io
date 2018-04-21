"use strict";

var patternMonochrome, patternColoured, widths, pallete, palettePreview, preview, title, sw = window.innerWidth, sh = window.innerHeight, bmp = dom.canvas(sw, sh), ctx = bmp.ctx, dot = 2, rotation = 0, container = dom.element("div", {
    className: "container",
    style: {
        width: sw + "px",
        height: sh + "px"
    }
});

function newSize() {
    size = 10 * Math.ceil(10 * Math.random());
}

function newStripes() {
    var lines = 2 + ~~(5 * Math.random());
    for (widths = [ 0 ]; widths.length < lines; ) widths.push(2 * Math.ceil(1 + Math.random() * (size - 1) / 2));
    widths.push(size);
    var noDuplicates = [];
    widths.map(function(a, i) {
        widths.indexOf(a) == i && noDuplicates.push(a);
    }), widths = noDuplicates.sort(function(a, b) {
        return a < b ? -1 : 1;
    });
}

function newPalette() {
    colours.getRandomPalette(), palettePreview && (container.removeChild(palettePreview), 
    palettePreview.removeEventListener("click", changePalette)), (palettePreview = colours.showPalette()).addEventListener("click", changePalette), 
    container.appendChild(palettePreview);
}

function newColours() {
    palette = [];
    for (var attempts = 0; palette.length < widths.length - 1; ) {
        var newColour = colours.getRandomColour();
        (-1 == palette.indexOf(newColour) || 100 < attempts) && palette.push(newColour), 
        attempts++;
    }
}

function reset() {
    newSize(), newStripes(), newPalette(), newColours(), render();
}

function changeStripes() {
    newStripes(), newColours(), render();
}

function changeSize(size) {
    dot = size, render();
}

function changeRotation() {
    rotation += Math.PI / 4, render();
}

function changePalette() {
    newPalette(), newColours(), render();
}

function render() {
    patternColoured = dom.canvas(size * dot, size * dot), patternMonochrome && patternDetails.removeChild(patternMonochrome.canvas), 
    patternMonochrome = dom.canvas(size * dot, size * dot);
    for (var colourMonochrome = [ [ "#666", "#aaa" ], [ "#333", "#888" ] ], i = 0; i < widths.length - 1; i++) for (var x = widths[i], w = widths[i + 1] - x, colourColumn = palette[i], monoColumn = colourMonochrome[0][i % 2], j = 0; j < widths.length - 1; j++) for (var y = widths[j], h = widths[j + 1] - y, colourRow = palette[j], monoRow = colourMonochrome[1][j % 2], px = 0; px < w; px++) for (var py = 0; py < h; py++) patternColoured.ctx.fillStyle = (px + py) % 2 == 0 ? colourColumn : colourRow, 
    patternColoured.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot), patternMonochrome.ctx.fillStyle = (px + py) % 2 == 0 ? monoColumn : monoRow, 
    patternMonochrome.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot);
    patternDetails.appendChild(patternMonochrome.canvas), ctx.save(), ctx.rect(0, 0, sw, sh), 
    ctx.rotate(rotation), ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat"), 
    ctx.fill(), ctx.restore();
}

document.body.appendChild(container), container.appendChild(bmp.canvas);

var buttonsTop = dom.element("div", {
    className: "buttons top"
});

container.appendChild(buttonsTop);

var buttonsBottom = dom.element("div", {
    className: "buttons bottom"
});

container.appendChild(buttonsBottom);

var patternDetails = dom.element("div", {
    className: "pattern"
});

container.appendChild(patternDetails), patternDetails.addEventListener("click", changeStripes);

var buttonExport = dom.button("get css", {
    className: "button export"
});

function save(canvas, type) {
    var dataURL = canvas.toDataURL("image/jpeg"), filename = "check_" + type + "_" + (1e9 * Math.random() << 0).toString(16) + "-.jpg";
    dom.element("a", {
        href: dataURL,
        download: filename
    }).click();
}

buttonExport.addEventListener("click", function(e) {
    var img = patternColoured.canvas.toDataURL("image/jpeg");
    if (void 0 === preview) {
        preview = dom.element("div", {
            className: "preview"
        });
        var title = dom.element("div", {
            className: "title",
            innerHTML: "And the CSS..."
        });
        preview.appendChild(title);
        var close = dom.button("close", {
            className: "close"
        });
        close.addEventListener("click", function(e) {
            container.removeChild(preview);
        }), preview.appendChild(close), preview.css = dom.element("div", {
            className: "css"
        }), preview.appendChild(preview.css);
    }
    container.appendChild(preview);
    var r = "rotate(" + rotation + "rad)", cssArr = [ "background-image: url(" + img + ");", "background-repeat: repeat;", "-webkit-transform: " + r + ";", "-moz-transform: " + r + ";", "-ms-transform: " + r + ";", "-o-transform: " + r + ";", "transform: " + r + ";" ];
    preview.css.innerHTML = cssArr.join("<br>");
}), buttonsTop.appendChild(buttonExport);

var buttonSaveOne = dom.button("pattern image", {
    className: "button"
});

buttonSaveOne.addEventListener("click", function(e) {
    save(patternColoured.canvas, "pattern");
}), buttonsTop.appendChild(buttonSaveOne);

var buttonSaveTiled = dom.button("tiled image", {
    className: "button"
});

buttonSaveTiled.addEventListener("click", function(e) {
    save(bmp.canvas, "tiled");
}), buttonsTop.appendChild(buttonSaveTiled);

var sizes = [ 1, 2, 3, 4 ];

for (var s in sizes) {
    var size = sizes[s], buttonSize = dom.button(size + "x", {
        className: "button",
        size: size
    });
    buttonSize.addEventListener("click", function() {
        changeSize(this.size);
    }), buttonsBottom.appendChild(buttonSize);
}

var buttonRotation = dom.button("rotation", {
    className: "button"
});

buttonRotation.addEventListener("click", function() {
    changeRotation();
}), buttonsBottom.appendChild(buttonRotation), bmp.canvas.addEventListener("click", reset), 
window.addEventListener("resize", function() {
    bmp.canvas.width = sw = window.innerWidth, bmp.canvas.height = sh = window.innerHeight, 
    container.setSize(sw, sh), render();
}), reset();