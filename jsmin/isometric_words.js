"use strict";

define("isometric_words", [], function() {
    var camera, scene, renderer, pic = "\n   █████        █████     ████████     ██████████\n █████████    █████████   ██████████   ██████████\n████   ████  ████   ████  ████   ████  ████\n████         ████   ████  ████   ████  ████\n████         ████   ████  ████   ████  ██████████\n████         ████   ████  ████   ████  ██████████\n████         ████   ████  ████   ████  ████\n████   ████  ████   ████  ████   ████  ████\n █████████    █████████   ██████████   ██████████\n   █████        █████     ████████     ██████████\n\n", cubeSize = 10;
    var direction, d, holder, camPos = {
        x: -(direction = 1) * (d = 1e3 * direction),
        y: 1 * d,
        z: 1 * d
    }, sw = window.innerWidth, sh = window.innerHeight;
    function randomRotate() {
        return 1 * (Math.random() - .5);
    }
    var weird = !0;
    function morph() {
        var rotateMod = (weird = !weird) ? 1 : 0;
        TweenMax.to(holder.rotation, 5, {
            x: rotateMod * randomRotate(),
            y: rotateMod * randomRotate(),
            z: rotateMod * randomRotate(),
            ease: Quint.easeInOut,
            onComplete: morph
        });
    }
    function render(time) {
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            colours.getRandomPalette(), scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(sw / -2, sw / 2, sh / 2, sh / -2, 1, 2e4), 
            scene.add(camera), camera.position.set(camPos.x, camPos.y, camPos.z), camera.lookAt(scene.position);
            var lightAbove = new THREE.DirectionalLight(16765136, 1);
            lightAbove.position.set(0, 1, 0), scene.add(lightAbove);
            var lightLeft = new THREE.DirectionalLight(13696976, 1);
            lightLeft.position.set(1, 0, 0), scene.add(lightLeft);
            var lightBelow = new THREE.DirectionalLight(13684991, 1);
            lightBelow.position.set(0, 0, 1), scene.add(lightBelow);
            var light = new THREE.AmbientLight(6316128);
            scene.add(light), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder), holder.rotation.set(randomRotate(), randomRotate(), randomRotate());
            var lines = pic.split("\n"), width = lines.reduce(function(a, b) {
                return Math.max(a, b.length);
            }, 0), height = lines.length;
            lines.forEach(function(line, y) {
                line.split("").forEach(function(pixel, x) {
                    if ("█" === pixel) {
                        var c = (colour = colours.getNextColour(), material = new THREE.MeshLambertMaterial({
                            color: colour
                        }), geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), new THREE.Mesh(geometry, material));
                        holder.add(c);
                        var magicOffset = rand.getInteger(-10, 10);
                        c.position.set((x - width / 2 + magicOffset) * cubeSize, (height / 2 - y - magicOffset) * cubeSize, -magicOffset * cubeSize);
                    }
                    var colour, material, geometry;
                });
            }), document.body.appendChild(renderer.domElement), render(), morph();
        }
    };
});