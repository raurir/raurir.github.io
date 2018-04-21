"use strict";

define("lego_stack", [ "lib/schteppe/cannon.0.6.2.min.js", "cannon_demo" ], function(cn, CannonDemo) {
    !function check() {
        con.log("check"), "undefined" == typeof THREE ? setTimeout(check, 10) : function() {
            var demo = new CannonDemo({
                trackballControls: !0
            }), world = function(demo) {
                var world = demo.getWorld();
                world.gravity.set(0, 0, -40), world.broadphase = new CANNON.NaiveBroadphase(), world.solver.iterations = 10;
                var groundShape = new CANNON.Plane(), groundBody = new CANNON.Body({
                    mass: 0
                });
                return groundBody.addShape(groundShape), groundBody.position.set(0, 0, 1), world.addBody(groundBody), 
                demo.addVisual(groundBody), world.quatNormalizeFast = !1, world.quatNormalizeSkip = 0, 
                world;
            }(demo);
            world.gravity.set(0, 0, -10);
            var blocks = [];
            function createBlock() {
                var length = 2 * rand.getInteger(1, 4), height = rand.getInteger(1, 2), knob = new CANNON.Cylinder(.5, .5, .5, 12), roof = new CANNON.Box(new CANNON.Vec3(2, length, .2)), bodyT = new CANNON.Box(new CANNON.Vec3(2, .2, height)), bodyR = new CANNON.Box(new CANNON.Vec3(.2, length, height)), bodyB = new CANNON.Box(new CANNON.Vec3(2, .2, height)), bodyL = new CANNON.Box(new CANNON.Vec3(.2, length, height)), block = new CANNON.Body({
                    mass: .1
                });
                block.addShape(roof, new CANNON.Vec3(0, 0, height)), block.addShape(bodyT, new CANNON.Vec3(0, length - .2, 0)), 
                block.addShape(bodyR, new CANNON.Vec3(1.8, 0, 0)), block.addShape(bodyB, new CANNON.Vec3(0, .2 - length, 0)), 
                block.addShape(bodyL, new CANNON.Vec3(-1.8, 0, 0));
                for (var w = 0; w < 2; w++) for (var l = 0; l < length; l++) {
                    var knobPosition = new CANNON.Vec3(2 * (w - 1 + .5), 2 * (l - length / 2 + .5), height + .25);
                    block.addShape(knob, knobPosition);
                }
                block.position.set(0, 0, 10 + 5 * blocks.length);
                var colour = [ 14483456, 17408, 16759552, 2237166 ][rand.getInteger(0, 3)];
                world.add(block), demo.addVisual(block, new THREE.MeshPhongMaterial({
                    color: colour
                })), block.linearDamping = .1, block.angularDamping = .1, blocks.push(block);
            }
            function update(time) {
                requestAnimationFrame(update), blocks.length < 100 && blocks.length < Math.floor(time / 1e3) && createBlock();
            }
            demo.create(function() {
                createBlock(), update();
            }), demo.start();
        }();
    }();
});