"use strict";

var race_lines_three = function() {
    var camera, scene, renderer, isMouseDown = !1, emptySlot = "emptySlot", planeTop = "planeTop", planeBottom = "planeBottom", mouse = {
        x: 0,
        y: 0
    }, camPos = {
        x: 0,
        y: 0,
        z: 10
    }, sw = window.innerWidth, sh = window.innerHeight, cols = 20, rows = 16, gap = 20, size = {
        width: 100,
        height: 30,
        depth: 150
    }, planeOffset = 250, allRowsDepth = rows * (size.depth + gap), allColsWidth = cols * (size.depth + gap), speedNormal = 4, speedFast = 34, speed = speedNormal, boxes = {
        planeBottom: [],
        planeTop: []
    }, boxes1d = [];
    function num(min, max) {
        return Math.random() * (max - min) + min;
    }
    function move(x, y, z) {
        var box = boxes[y][z][x];
        if (box !== emptySlot && (box.position.x = box.offset.x, box.position.z = box.offset.z + box.posZ, 
        0 < box.position.z && (box.posZ -= allRowsDepth), !box.isWarping && .999 < Math.random())) {
            var dir = Math.floor(5 * Math.random()), xn = x, zn = z, yn = y, yi = 0, xo = 0, zo = 0;
            switch (dir) {
              case 0:
                xn++, xo = 1;
                break;

              case 1:
                xn--, xo = -1;
                break;

              case 2:
                zn++, zo = 1;
                break;

              case 3:
                zn--, zo = -1;
                break;

              case 4:
                yn = y === planeTop ? planeBottom : planeTop, yi = y === planeTop ? -1 : 1;
            }
            boxes[yn][zn] && boxes[yn][zn][xn] === emptySlot && (boxes[y][z][x] = emptySlot, 
            box.isWarping = !0, boxes[yn][zn][xn] = box, 4 === dir ? TweenMax.to(box.position, .5, {
                y: yi * planeOffset
            }) : TweenMax.to(box.offset, .5, {
                x: box.offset.x + xo * (size.width + gap),
                z: box.offset.z + zo * (size.depth + gap)
            }), TweenMax.to(box.offset, .6, {
                onComplete: function() {
                    box.isWarping = !1;
                }
            }));
        }
    }
    function render(time) {
        var box;
        speed -= .05 * (speed - (isMouseDown ? speedFast : speedNormal));
        for (var b = 0, bl = boxes1d.length; b < bl; b++) {
            (box = boxes1d[b]).posZ += speed;
            var distanceZ = 1 - ((allRowsDepth - box.posZ) / allRowsDepth - 1);
            box.material.uniforms.distanceZ.value = distanceZ;
            var distanceX = 1 - Math.abs(box.position.x) / (allColsWidth / 3);
            box.material.uniforms.distanceX.value = distanceX;
            var colour = isMouseDown ? box.colours.fast : box.colours.slow;
            box.material.uniforms.r.value -= .1 * (box.material.uniforms.r.value - colour.r), 
            box.material.uniforms.g.value -= .1 * (box.material.uniforms.g.value - colour.g), 
            box.material.uniforms.b.value -= .1 * (box.material.uniforms.b.value - colour.b);
            var currentSpeed = (speed - speedNormal) / (speedFast - speedNormal);
            box.material.uniforms.speed.value = currentSpeed, Math.random() > .99995 - .005 * currentSpeed && (box.material.uniforms.pulse.value = 1), 
            box.material.uniforms.pulse.value -= .1 * box.material.uniforms.pulse.value / (currentSpeed + 1);
        }
        for (var j = 0, jl = rows; j < jl; j++) for (var i = 0, il = cols; i < il; i++) move(i, planeBottom, j), 
        move(i, planeTop, j);
        camPos.x -= .02 * (camPos.x - 400 * mouse.x), camPos.y -= .05 * (camPos.y - 150 * mouse.y), 
        camPos.z = -100, camera.position.set(camPos.x, camPos.y, camPos.z), camera.rotation.y = camPos.x / -1e3, 
        camera.rotation.x = camPos.y / 1e3, camera.rotation.z = (camPos.x - 400 * mouse.x) / 2e3, 
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    var vertexShader = [ "varying vec2 vUv;", "void main()", "{", "  vUv = uv;", "  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "  gl_Position = projectionMatrix * mvPosition;", "}" ].join(""), fragmentShader = [ "uniform float r;", "uniform float g;", "uniform float b;", "uniform float distanceZ;", "uniform float distanceX;", "uniform float pulse;", "uniform float speed;", "varying vec2 vUv;", "void main( void ) {", "  vec2 position = abs(-1.0 + 2.0 * vUv);", "  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 2.0);", "  float perc = (0.2 * pow(speed + 1.0, 2.0) + edging * 0.8) * distanceZ * distanceX;", "  float red = r * perc + pulse;", "  float green = g * perc + pulse;", "  float blue = b * perc + pulse;", "  gl_FragColor = vec4(red, green, blue, 1.0);", "}" ].join("");
    return {
        init: function() {
            scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 1e4), 
            scene.add(camera), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh);
            for (var j = 0, jl = rows; j < jl; j++) {
                boxes.planeBottom[j] = [], boxes.planeTop[j] = [];
                for (var i = 0, il = cols; i < il; i++) boxes.planeBottom[j][i] = emptySlot, boxes.planeTop[j][i] = emptySlot;
            }
            function createBox() {
                var props, colours, uniforms, material, geometry, object, xi = Math.floor(Math.random() * cols), xai = xi, yi = .5 < Math.random() ? 1 : -1, yai = -1 === yi ? planeBottom : planeTop, zi = Math.floor(Math.random() * rows), zai = zi, x = (xi - cols / 2) * (size.width + gap), y = yi * planeOffset, z = zi * (size.depth + gap);
                if (boxes[yai][zai][xai] === emptySlot) {
                    var box = (props = size, colours = {
                        slow: {
                            r: num(0, .2),
                            g: num(.5, .9),
                            b: num(.3, .7)
                        },
                        fast: {
                            r: num(.9, 1),
                            g: num(.1, .7),
                            b: num(.2, .5)
                        }
                    }, uniforms = {
                        r: {
                            type: "f",
                            value: colours.slow.r
                        },
                        g: {
                            type: "f",
                            value: colours.slow.g
                        },
                        b: {
                            type: "f",
                            value: colours.slow.b
                        },
                        distanceX: {
                            type: "f",
                            value: 1
                        },
                        distanceZ: {
                            type: "f",
                            value: 1
                        },
                        pulse: {
                            type: "f",
                            value: 0
                        },
                        speed: {
                            type: "f",
                            value: speed
                        }
                    }, material = new THREE.ShaderMaterial({
                        uniforms: uniforms,
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader
                    }), geometry = new THREE.BoxGeometry(props.width, props.height, props.depth), (object = new THREE.Mesh(geometry, material)).colours = colours, 
                    object);
                    box.position.y = y, box.isWarping = !1, box.offset = {
                        x: x,
                        z: 0
                    }, box.posZ = z, boxes[yai][zai][xai] = box, boxes1d.push(box), scene.add(box);
                }
            }
            for (i = 0, il = rows * cols; i < il; i++) createBox();
            function listen(eventNames, callback) {
                for (var i = 0; i < eventNames.length; i++) window.addEventListener(eventNames[i], callback);
            }
            document.body.appendChild(renderer.domElement), listen([ "resize" ], function(e) {
                sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
                renderer.setSize(sw, sh);
            }), listen([ "mousedown", "touchstart" ], function(e) {
                e.preventDefault(), isMouseDown = !0;
            }), listen([ "mousemove", "touchmove" ], function(e) {
                e.preventDefault(), e.changedTouches && e.changedTouches[0] && (e = e.changedTouches[0]), 
                mouse.x = e.clientX / sw * 2 - 1, mouse.y = -e.clientY / sh * 2 + 1;
            }), listen([ "mouseup", "touchend" ], function(e) {
                e.preventDefault(), isMouseDown = !1;
            }), render();
        },
        resize: function() {}
    };
};

define("race_lines_three", race_lines_three);