"use strict";

define("hex_rounded", function() {
    var camera, renderer, stageWidth = 500, stageHeight = 500;
    return {
        init: function() {
            var interaction = !1, mouse = {
                x: 0,
                y: 0
            }, scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0, 100, 5e3);
            var cameraTarget = {
                x: 0,
                y: 0,
                z: 0
            };
            (camera = new THREE.PerspectiveCamera(100, stageWidth / stageHeight, 1, 2e4)).position.x = 0, 
            camera.position.z = -5e3;
            var lightWhite = new THREE.PointLight(16777215, 1, 1e4);
            scene.add(lightWhite), lightWhite.position.set(0, 0, -5e3);
            var group = new THREE.Object3D();
            scene.add(group), (renderer = new THREE.WebGLRenderer()).setSize(stageWidth, stageHeight), 
            document.body.appendChild(renderer.domElement);
            var hexs = [], hexsTargetable = [], fireflies = [], radius = 600, numHexs = 121, xGap = 2 * radius * -Math.cos(30 * Math.PI / 180), yGap = 3 * radius * Math.sin(30 * Math.PI / 180), xOffset = 5.5 * -xGap, yOffset = 5.5 * -yGap, numFireflies = 10;
            function ran(max) {
                return (Math.random() - .5) * max;
            }
            function addHex(x, y, z, isEdge) {
                var bevelThickness = .1 * radius, innerRadius = .8 * (radius - bevelThickness), shape = new THREE.Shape();
                function polygon(i, edges) {
                    var angle = i / edges * Math.PI * 2, nextAngle = (i + 1) / edges * Math.PI * 2, nextNextAngle = (i + 2) / edges * Math.PI * 2, xp = Math.sin(angle) * innerRadius, yp = Math.cos(angle) * innerRadius, nxp = Math.sin(nextAngle) * innerRadius, nyp = Math.cos(nextAngle) * innerRadius, startStraightX = xp + .2 * (nxp - xp), startStraightY = yp + .2 * (nyp - yp), endStraightX = nxp - .2 * (nxp - xp), endStraightY = nyp - .2 * (nyp - yp), endCurveX = nxp + .2 * (Math.sin(nextNextAngle) * innerRadius - nxp), endCurveY = nyp + .2 * (Math.cos(nextNextAngle) * innerRadius - nyp);
                    0 == i && shape.moveTo(startStraightX, startStraightY), shape.lineTo(endStraightX, endStraightY), 
                    shape.quadraticCurveTo(nxp, nyp, endCurveX, endCurveY);
                }
                for (var i = 0; i < 6; i++) polygon(i, 6);
                var height = 100 + Math.random() * radius, colour = .9 * radius < height ? 9453568 : 5263440, extrudeSettings = {
                    amount: height,
                    bevelEnabled: !0,
                    bevelSegments: 1,
                    steps: 1,
                    bevelThickness: bevelThickness
                }, g = shape.extrude(extrudeSettings), m = new THREE.MeshPhongMaterial({
                    color: colour
                }), hex = new THREE.Mesh(g, m);
                return group.add(hex), hex.move = function() {
                    this.undecided += ran(.5), this.kindadecided -= .1 * (this.kindadecided - this.undecided), 
                    this.dir -= .1 * (this.dir - this.kindadecided), this.position.z += this.dir;
                }, hex.reset = function() {
                    hex.undecided = ran(.5), hex.kindadecided = ran(.5), hex.dir = hex.kindadecided, 
                    hex.position.set(x, y, z - height);
                }, hex.reset(), hex;
            }
            for (var i = 0; i < numHexs; i++) {
                var row = Math.floor(i / 11), col = i % 11 + (row % 2 == 0 ? .5 : 0), isEdge = col < 2 || 8.5 < col || row < 2 || 8.5 < row, hex = addHex(xOffset + col * xGap, yOffset + row * yGap, 0);
                hexs.push(hex), isEdge || hexsTargetable.push(hex);
            }
            function addFirefly() {
                var fly = new THREE.Object3D();
                group.add(fly);
                var below = .7 < Math.random();
                function light() {
                    return 160 + ran(96);
                }
                var colour = light() << 16 | light() << 8 | light(), light = (new THREE.BoxGeometry(200, 200, 200), 
                new THREE.MeshPhongMaterial({
                    color: colour,
                    shininess: 1,
                    shading: THREE.SmoothShading
                }), new THREE.PointLight(colour, 5, 2e3));
                return fly.add(light), fly.position.set(ran(1e3), ran(1e3), below ? 200 : -2e3 + ran(1e3)), 
                fly.v = 20 + ran(10), fly.vx = ran(10), fly.vy = ran(10), fly.vz = ran(10), fly.undecided = ran(Math.PI), 
                fly.kindadecided = ran(Math.PI), fly.dir = fly.kindadecided, fly.move = function() {
                    this.undecided += ran(.5), this.kindadecided -= .1 * (this.kindadecided - this.undecided), 
                    this.dir -= .1 * (this.dir - this.kindadecided), this.ax = Math.sin(this.dir) * this.v, 
                    this.ay = Math.cos(this.dir) * this.v, this.position.x += this.ax, this.position.y += this.ay, 
                    this.position.x < -4e3 && (this.position.x = 4e3), 4e3 < this.position.x && (this.position.x = -4e3), 
                    this.position.y < -4e3 && (this.position.y = 4e3), 4e3 < this.position.y && (this.position.y = -4e3);
                }, fly;
            }
            for (i = 0; i < numFireflies; i++) fireflies[i] = addFirefly();
            function pickOne() {
                return hexsTargetable[~~(Math.random() * hexsTargetable.length)];
            }
            var target = pickOne(), loop = 0;
            dom.on(window, [ "mousemove", "touchmove" ], function(e) {
                if (interaction) {
                    var event = e.changedTouches && e.changedTouches[0] || e;
                    event.x = event.x || event.pageX, event.y = event.y || event.pageY, mouse.x = event.x - stageWidth / 2, 
                    mouse.y = event.y - stageHeight / 2;
                }
            }), dom.on(window, [ "mousedown", "touchstart" ], function(e) {
                interaction = !0;
            }), dom.on(window, [ "mouseup", "touchend" ], function(e) {
                interaction = !1;
            }), function render(t) {
                if (requestAnimationFrame(render), loop < Math.floor(t / 4e3)) {
                    loop++, target = pickOne(), group.position.z = 2e3;
                    for (var i = 0; i < numHexs; i++) hexs[i].reset(t, i);
                }
                for (i = 0; i < numFireflies; i++) fireflies[i].move(t, i);
                for (i = 0; i < numHexs; i++) hexs[i].move(t, i);
                camera.position.x -= .02 * (camera.position.x - target.position.x), camera.position.y -= .02 * (camera.position.y - target.position.y), 
                cameraTarget.x -= .2 * (cameraTarget.x - 5 * mouse.x), cameraTarget.y -= .2 * (cameraTarget.y - 5 * mouse.y), 
                camera.lookAt(new THREE.Vector3(camera.position.x - cameraTarget.x, camera.position.y - cameraTarget.y, 0)), 
                group.position.z -= 35, target.position.z += 40, renderer.render(scene, camera);
            }(0);
        },
        resize: function(w, h) {
            stageWidth = w, stageHeight = h, renderer.setSize(w, h), camera.aspect = w / h, 
            camera.updateProjectionMatrix();
        }
    };
});