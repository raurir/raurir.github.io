"use strict";

define("ball_and_chain", [ "lib/schteppe/cannon.0.6.2.min.js", "cannon_demo" ], function(cn, CannonDemo) {
    function go() {
        var demo = new CannonDemo();
        demo.create(function() {
            var world = function(demo) {
                var world = demo.getWorld();
                world.gravity.set(0, 0, -40), world.broadphase = new CANNON.NaiveBroadphase(), world.solver.iterations = 10;
                var groundShape = new CANNON.Plane(), groundBody = new CANNON.Body({
                    mass: 0
                });
                return groundBody.addShape(groundShape), groundBody.position.set(0, 0, 1), world.addBody(groundBody), 
                demo.addVisual(groundBody), world.quatNormalizeFast = !1, world.quatNormalizeSkip = 0, 
                world;
            }(demo);
            world.gravity.set(0, 0, -20);
            var last, width = 1, pitch = 1, chainShape0 = new CANNON.Box(new CANNON.Vec3(width, .3, pitch)), chainShape1 = new CANNON.Box(new CANNON.Vec3(.3, width, pitch)), space = .3;
            function join(body0, body1, offset) {
                var cnX = .1 * width, cnY = pitch + space + offset, c1 = new CANNON.PointToPointConstraint(body0, new CANNON.Vec3(-cnX, 0, cnY), body1, new CANNON.Vec3(-cnX, 0, -cnY)), c2 = new CANNON.PointToPointConstraint(body0, new CANNON.Vec3(cnX, 0, cnY), body1, new CANNON.Vec3(cnX, 0, -cnY));
                world.addConstraint(c1), world.addConstraint(c2);
            }
            for (var i = 0; i < 10; i++) {
                var firstChainLink = 1 === i, lastBody = 9 === i, py = (10 - i) * (2 * pitch + 2 * space) + 2 * pitch + space;
                if (0 === i) {
                    var sphereShape = new CANNON.Sphere(4), spherebody = new CANNON.Body({
                        mass: 3
                    });
                    spherebody.addShape(sphereShape), spherebody.position.set(0, 0, py), last = spherebody;
                } else if (lastBody) {
                    var cylinderShape = new CANNON.Cylinder(2, 2, 3, 12), cylinderBody = new CANNON.Body({
                        mass: .5
                    });
                    cylinderBody.addShape(cylinderShape), cylinderBody.position.set(0, 0, py), join(cylinderBody, last, 0), 
                    last = cylinderBody;
                } else {
                    var chainLinkBody = new CANNON.Body({
                        mass: .1
                    });
                    chainLinkBody.addShape(i % 2 ? chainShape0 : chainShape1), chainLinkBody.position.set(0, 0, py), 
                    chainLinkBody.custom = !0, chainLinkBody.customType = "CHAIN_LINK", join(chainLinkBody, last, firstChainLink ? 1.8 : 0), 
                    last = chainLinkBody;
                }
                world.add(last), demo.addVisual(last), last.velocity.set(Math.random() - .5, Math.random() - .5, Math.random() - .5), 
                last.linearDamping = .1, last.angularDamping = .1;
            }
        }), demo.start();
    }
    !function check() {
        con.log("check"), "undefined" == typeof THREE ? setTimeout(check, 10) : go();
    }();
});