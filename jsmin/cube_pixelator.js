"use strict";

define("cube_pixelator", [], function() {
    var camera, scene, renderer, holder, pixels = 48, cubeSize = 8, gridSize = 10, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight, grid = [], rotations = [], images = [], currentImage = 0;
    function createBitmap(image, resolve) {
        var img = new Image();
        img.onload = function() {
            if (img.width != img.height) throw new Error("squares only mate!");
            var scale = pixels / img.width, ctx = dom.canvas(pixels, pixels).ctx;
            ctx.scale(scale, scale), ctx.drawImage(img, 0, 0);
            for (var grayscale = [], pixelData = ctx.getImageData(0, 0, pixels, pixels).data, p = 0; p < pixelData.length; p += 4) {
                var r = pixelData[p];
                grayscale.push({
                    rotation: r / 255
                });
            }
            images.push(grayscale), progress("render:progress", images.length / 4), setTimeout(resolve, 100);
        }, img.src = "./assets/" + image + ".jpg";
    }
    function createScene() {
        scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 2e4), 
        scene.add(camera);
        var lightAbove = new THREE.DirectionalLight(16777215, 1);
        lightAbove.position.set(0, 1, .5), scene.add(lightAbove);
        var lightLeft = new THREE.DirectionalLight(15787425, .5);
        lightLeft.position.set(-1, .5, .5), scene.add(lightLeft);
        var w, h, colour, geometry, material, lightBelow = new THREE.DirectionalLight(3158064, .2);
        lightBelow.position.set(0, -1, .25), scene.add(lightBelow), (renderer = new THREE.WebGLRenderer({
            antialias: !0
        })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
        for (var p = 0; p < pixels * pixels; p++) {
            var c = (h = w = cubeSize, colour = 16777215, void 0, geometry = new THREE.PlaneGeometry(w, h, 1), 
            material = new THREE.MeshLambertMaterial({
                color: colour
            }), new THREE.Mesh(geometry, material));
            holder.add(c);
            var xi = p % pixels - pixels / 2 + .5, yi = Math.floor(p / pixels) - pixels / 2 + .5, x = xi * gridSize, y = -yi * gridSize;
            c.position.set(x, y, 0), c.rotateSpeed = Math.random() - .5, grid.push(c);
        }
        document.body.appendChild(renderer.domElement), render(0), setInterval(toggleImage, 6e3), 
        progress("render:complete", renderer.domElement);
    }
    var toggleImage = function() {
        currentImage++, currentImage %= images.length, con.log("toggleImage", currentImage);
        for (var newRotations = images[currentImage].slice(), i = 0; i < pixels * pixels; i++) TweenMax.to(rotations[i], 3, {
            rotation: newRotations[i].rotation,
            easing: Back.easeInOut,
            delay: .001 * i
        });
    };
    function render(time) {
        grid.forEach(function(c, index) {
            c.rotation.x = Math.PI / 4 - rotations[index].rotation * Math.PI / 3;
        }), camPos.x = 0 + 50 * Math.sin(12e-5 * time), camPos.y = 0 + 50 * Math.sin(17e-5 * time), 
        camPos.z = 400 + 300 * Math.sin(1e-4 * time), camera.position.set(camPos.x, camPos.y, camPos.z), 
        camera.lookAt(scene.position), renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            for (var p = 0; p < pixels * pixels; p++) rotations.push({
                rotation: Math.random()
            });
            var fn2 = function() {
                return createBitmap("marilyn", fn3);
            }, fn3 = function() {
                return createBitmap("hicks", fn4);
            }, fn4 = function() {
                setTimeout(createScene, 200);
            };
            createBitmap("cash", fn2);
        }
    };
});