"use strict";

define("attractor", function() {
    var xn, yn, sw = window.innerWidth, sh = window.innerHeight, canvas = (colours.getRandomPalette(), 
    dom.canvas(sw, sh)), ctx = canvas.ctx, a = .19, c = 1.3, xn1 = 5, yn1 = 0, scale = 40, iterations = 2e4, mouse = {
        x: 0,
        y: 0
    };
    function f(x) {
        return (x + .1 + x * (a - c) * x) / (1.1 + a * (c * c + a * a) * x * x) * 1.3;
    }
    function onLoop(time) {
        requestAnimationFrame(onLoop), ctx.fillStyle = "white", ctx.fillRect(0, 0, sw, sh), 
        c = mouse.x / 9e3;
        for (var i = yn1 = xn1 = 0; i < iterations; i++) xn1 = -(xn = xn1) - a + c + f(yn = yn1), 
        yn1 = -xn + c * f(xn * yn), ctx.fillStyle = "rgba(0,0,0,0.3)", ctx.fillRect(380 + xn1 * scale, 450 + yn1 * scale, 1, 1);
    }
    return dom.on(window, [ "mousemove", "touchmove" ], function(e) {
        var event = e.changedTouches && e.changedTouches[0] || e;
        event.x = event.x || event.pageX, event.y = event.y || event.pageY, mouse.x = event.x - sw / 2, 
        mouse.y = event.y - sh / 2;
    }), {
        init: function() {
            onLoop();
        },
        stage: canvas.canvas
    };
});