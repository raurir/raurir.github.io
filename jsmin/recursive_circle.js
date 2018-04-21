"use strict";

define("recursive_circle", function() {
    var TAU = 2 * Math.PI, sw = 600, sh = sw, maxRecursion = 4, stage = dom.canvas(sw, sh), ctx = stage.ctx;
    function render(time) {
        var t = 3e-4 * time, proportion = 2 / 3, ringItems = 6;
        ctx.globalCompositeOperation = "source-over", ctx.clearRect(0, 0, sw, sh), function calc(recursion, cx, cy, size) {
            var angleBase = Math.sin(t) * TAU / ringItems * recursion;
            0;
            for (var outerBoundary = size / 2, innerBoundary = outerBoundary * proportion / 2, inscribedRadius = (outerBoundary - innerBoundary) / 2, centreLine = innerBoundary + inscribedRadius, i = 0; i < ringItems; i++) {
                var a = angleBase + i / ringItems * TAU, x = cx + Math.sin(a) * centreLine, y = cy + Math.cos(a) * centreLine;
                recursion < maxRecursion ? calc(recursion + 1, x, y, outerBoundary * proportion) : (ctx.fillStyle = "#fff", 
                ctx.globalCompositeOperation = "source-over", ctx.beginPath(), ctx.drawCircle(x * sw, y * sw, inscribedRadius * sw), 
                ctx.fill(), ctx.fillStyle = "#000", ctx.globalCompositeOperation = "destination-out", 
                ctx.beginPath(), ctx.drawCircle(x * sw, y * sw, inscribedRadius * proportion / 2 * sw), 
                ctx.fill());
            }
        }(1, .5, .5, 1), requestAnimationFrame(render);
    }
    return {
        resize: function(w, h) {},
        init: function() {
            render(0);
        },
        stage: stage.canvas
    };
});