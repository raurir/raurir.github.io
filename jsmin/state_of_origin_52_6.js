"use strict";

var con = console, isNode = "undefined" != typeof module;

if (isNode) var rand = require("./rand.js"), dom = require("./dom.js");

var state_of_origin_52_6 = function() {
    var overScale, QLD = "QLD", NSW = "NSW", font = "180px helvetica", red = "#f00", bmpSize = 200, output = dom.canvas(1, 1), machines = {}, progressions = {
        NSW: 0,
        QLD: 0
    }, complete = {
        NSW: !1,
        QLD: !1
    };
    function initState(state, score, x, y, maxGlyphs) {
        var count = 0, countMax = 150 * maxGlyphs, testCanvas = dom.canvas(bmpSize, bmpSize), progressCanvas = dom.canvas(bmpSize, bmpSize);
        function newPosition() {
            var c, padX = 0 * bmpSize, padY = .1 * bmpSize;
            return {
                x: padX + rand.random() * (bmpSize - 2 * padX),
                y: padY + rand.random() * (bmpSize - 2 * padY),
                size: (c = count, .75 + 4 * rand.random() * (.001 + countMax - c) / countMax)
            };
        }
        function drawShape(target, props, fx, renderOuput) {
            var fillStyle, renderScale = renderOuput ? overScale / 2 : 1, scale = 2 * props.size / bmpSize * renderScale, x = (props.x - props.size) * renderScale, y = (props.y - props.size) * renderScale;
            if (renderOuput) {
                x += bmpSize * renderScale / 2, state === NSW && (y += bmpSize * renderScale * .8);
                var grey = rand.getInteger(200, 254);
                fillStyle = "rgb(" + grey + "," + grey + "," + grey + ")";
            } else fillStyle = red;
            target.save(), target.translate(x, y), target.scale(scale, scale), target.font = font, 
            target.fillStyle = fillStyle, target.fillText(state, 0, 0), target.restore();
        }
        function generate() {
            var proposed = newPosition();
            (function(point) {
                testCanvas.ctx.globalCompositeOperation = "source-over", testCanvas.ctx.drawImage(progressCanvas.canvas, 0, 0), 
                testCanvas.ctx.globalCompositeOperation = "source-in", drawShape(testCanvas.ctx, point, 0, !1);
                var width = 2 * Math.ceil(point.size + 20), height = Math.ceil(point.size + 20), xs = Math.floor(point.x - width), ys = Math.floor(point.y - 2 * height);
                width *= 2, height *= 2;
                for (var pixels = testCanvas.ctx.getImageData(xs, ys, width, height).data, ok = !0, x = 0; x < width && ok; x++) for (var y = 0; y < height && ok; y++) ok = 0 === pixels[4 * (y * width + x)];
                return testCanvas.ctx.globalCompositeOperation = "source-over", testCanvas.ctx.fillStyle = ok ? "rgba(0, 0, 255, 0.25)" : "rgba(255, 0, 0, 0.25)", 
                testCanvas.ctx.fillRect(xs, ys, width, height), ok;
            })(proposed) && (count++, drawShape(output.ctx, proposed, 0, !0), drawShape(progressCanvas.ctx, proposed, 0, !1));
        }
        progressCanvas.ctx.clearRect(0, 0, bmpSize, bmpSize), progressCanvas.ctx.fillStyle = red, 
        progressCanvas.ctx.fillRect(0, 0, bmpSize, bmpSize), progressCanvas.ctx.globalCompositeOperation = "destination-out", 
        progressCanvas.ctx.save(), progressCanvas.ctx.translate(bmpSize * x, bmpSize * y), 
        progressCanvas.ctx.font = font, progressCanvas.ctx.fillText(score, 0, 0), progressCanvas.ctx.restore(), 
        progressCanvas.ctx.globalCompositeOperation = "source-over", machines[state] = function() {
            if (count < countMax) {
                for (var i = 0; i < 100 && count < countMax; i++) generate(), generate();
                progressions[state] = count / countMax;
            } else complete[state] = !0;
        };
    }
    function loop() {
        machines.NSW(), machines.QLD(), complete.NSW && complete.QLD ? progress("render:complete", output.canvas) : (progress("render:progress", (progressions.NSW + progressions.QLD) / 2), 
        setTimeout(loop, 1));
    }
    return {
        stage: output.canvas,
        init: function(options) {
            overScale = options.size / bmpSize, con.log("state of origin init", options, overScale), 
            output.setSize(bmpSize * overScale, bmpSize * overScale), initState(QLD, 52, -.02, .9, 3), 
            initState(NSW, 6, .23, .9, 2), loop();
        }
    };
};

isNode ? module.exports = state_of_origin_52_6() : define("state_of_origin_52_6", state_of_origin_52_6);