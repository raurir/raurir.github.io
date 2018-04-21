"use strict";

define("cube_fractal_zoom", function() {
    var camera, scene, renderer, holder, lightA, lightB, lightC, next, prev, cubeSize = 200, gridSize = 1.2 * cubeSize, sw = window.innerWidth, sh = window.innerHeight, destRot = {};
    function getIndex(p, num) {
        return {
            xi: p % num - num / 2 + .5,
            yi: Math.floor(p / num) % num - num / 2 + .5,
            zi: Math.floor(p / num / num) - num / 2 + .5
        };
    }
    function cubes(num) {
        var grid = [], group = new THREE.Group();
        holder.add(group);
        var material, geometry, inner = new THREE.Group();
        group.add(inner);
        for (var p = 0; p < num * num * num; p++) {
            var c = (void 0, material = new THREE.MeshPhongMaterial({
                color: 9470064,
                specular: 16777215,
                shininess: 50
            }), geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), new THREE.Mesh(geometry, material));
            inner.add(c);
            var _getIndex = getIndex(p, num), xi = _getIndex.xi, yi = _getIndex.yi, zi = _getIndex.zi, x = xi * cubeSize, y = yi * cubeSize, z = zi * cubeSize;
            c.position.set(x, y, z), grid.push(c);
        }
        return {
            group: group,
            inner: inner,
            num: num,
            grid: grid
        };
    }
    function zoomIn() {
        next.group.scale.set(.001, .001, .001);
        var scale = prev.num;
        TweenMax.to(prev.group.scale, 2.5, {
            x: scale,
            y: scale,
            z: scale,
            ease: Quad.easeInOut
        });
        var x = .5 * gridSize, y = .5 * gridSize, z = .5 * gridSize;
        TweenMax.to(prev.inner.position, 2, {
            x: x,
            y: y,
            z: z,
            ease: Quad.easeInOut
        }), prev.grid.forEach(function(c, index) {
            var _getIndex2 = getIndex(index, prev.num), xi = _getIndex2.xi, yi = _getIndex2.yi, zi = _getIndex2.zi, x = xi * gridSize, y = yi * gridSize, z = zi * gridSize;
            TweenMax.to(c.position, 1.5, {
                x: x,
                y: y,
                z: z,
                ease: Quad.easeInOut,
                delay: 1
            });
        }), destRot = {
            x: rand.getNumber(-Math.PI, Math.PI),
            y: rand.getNumber(-Math.PI, Math.PI),
            z: rand.getNumber(-Math.PI, Math.PI)
        }, TweenMax.to(prev.group.rotation, 2.5, {
            x: destRot.x,
            y: destRot.y,
            z: destRot.z,
            ease: Quad.easeInOut,
            onComplete: zoomOver
        });
    }
    function zoomOver() {
        next.group.scale.set(1, 1, 1), next.group.rotation.set(destRot.x, destRot.y, destRot.z);
        var g = 4 * gridSize;
        prev.grid.forEach(function(c, index) {
            var _getIndex3 = getIndex(index, prev.num), xi = _getIndex3.xi, yi = _getIndex3.yi, zi = _getIndex3.zi, x = xi * g, y = yi * g, z = zi * g;
            0 != index && (TweenMax.to(c.position, 2.5, {
                x: x,
                y: y,
                z: z,
                ease: Quad.easeIn
            }), TweenMax.to(c.rotation, 2.5, {
                x: rand.getNumber(-2, 2),
                y: rand.getNumber(-2, 2),
                z: rand.getNumber(-2, 2),
                ease: Quint.easeIn
            })), TweenMax.to(c.scale, 2.5, {
                x: 0,
                y: 0,
                z: 0,
                ease: Quint.easeIn
            });
        }), TweenMax.to({}, 2.5, {
            onComplete: zoomAgain
        });
    }
    function zoomAgain() {
        var temp = prev;
        prev = next, (next = temp).group.scale.set(.001, .001, .001), next.inner.position.set(0, 0, 0), 
        next.grid.forEach(function(c, index) {
            var _getIndex4 = getIndex(index, next.num), xi = _getIndex4.xi, yi = _getIndex4.yi, zi = _getIndex4.zi, x = xi * cubeSize, y = yi * cubeSize, z = zi * cubeSize;
            c.position.set(x, y, z), c.rotation.set(0, 0, 0), c.scale.set(1, 1, 1);
        }), setTimeout(zoomIn, 1e3);
    }
    function render(time) {
        function moveLight(light, x, y, z) {
            var t = time + 1e4;
            light.position.set(Math.sin(t * x * 4e-5), Math.sin(t * y * 4e-5), Math.sin(t * z * 4e-5));
        }
        moveLight(lightA, 15, 17, 12), moveLight(lightB, 14, 19, 13), moveLight(lightC, 20, 18, 16), 
        holder.rotation.z += .005, holder.rotation.x += .001, renderer.render(scene, camera), 
        requestAnimationFrame(render);
    }
    return {
        init: function() {
            scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 2e4), 
            scene.add(camera), camera.position.set(0, 0, 1500), camera.lookAt(scene.position), 
            lightA = new THREE.DirectionalLight(16711680, 1), scene.add(lightA), lightB = new THREE.DirectionalLight(12623872, 1), 
            scene.add(lightB), lightC = new THREE.DirectionalLight(16750848, 1), scene.add(lightC), 
            (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
            var lightAmbient = new THREE.AmbientLight(16769248, .2);
            scene.add(lightAmbient), prev = cubes(2), next = cubes(2), document.body.appendChild(renderer.domElement), 
            render(0), setTimeout(zoomIn, 1500);
        }
    };
});