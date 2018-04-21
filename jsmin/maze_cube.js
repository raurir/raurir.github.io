"use strict";

define("maze_cube", [ "linked_line" ], function(linkedLine) {
    var camera, scene, renderer, holder, blocks = 11, cubeSize = 1512, size = cubeSize / blocks, mouse = {
        x: 0,
        y: 0,
        toggle: !0
    }, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    function cube(w, h, d, colour) {
        var group = new THREE.Group(), material = new THREE.MeshPhongMaterial({
            color: colour,
            emissive: 8400896,
            specular: 10518656,
            shininess: 40
        }), geometry = new THREE.BoxGeometry(w, h, d), object = new THREE.Mesh(geometry, material);
        return object.castShadow = !0, object.receiveShadow = !0, group.add(object), group;
    }
    function render(time) {
        mouse.toggle && (holder.rotation.x += .005 * Math.PI, holder.rotation.z -= .002 * Math.PI), 
        camPos.z = 5e3, camera.position.set(camPos.x, camPos.y, camPos.z), camera.lookAt(scene.position), 
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            var mazes = [], face = function(preoccupied) {
                return linkedLine.generate(blocks, preoccupied);
            }, add = function(maze) {
                con.log("adding walls:", mazes.length, maze.wallrects.length), mazes.push(maze.wallrects), 
                progress("render:progress", mazes.length / 6);
            };
            perf.start("gen"), face().then(add).then(function() {
                return face([ {
                    x: 1,
                    y: 2
                }, {
                    x: 1,
                    y: 3
                }, {
                    x: 3,
                    y: 3
                } ]);
            }).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(function() {
                con.log("success"), perf.end("gen"), function(mazes) {
                    (scene = new THREE.Scene()).fog = new THREE.FogExp2(0, 2e-4), camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 2e4), 
                    scene.add(camera);
                    var lightAbove = new THREE.DirectionalLight(9474192, 1.5);
                    lightAbove.castShadow = !0, lightAbove.position.set(0, 200, 0), scene.add(lightAbove), 
                    (renderer = new THREE.WebGLRenderer()).setSize(sw, sh), renderer.shadowMap = {
                        type: THREE.BasicShadowMap,
                        enabled: !0
                    }, holder = new THREE.Group(), scene.add(holder);
                    var c = cube(2 * cubeSize - size, 2 * cubeSize - size, 2 * cubeSize - size, 4206624);
                    holder.add(c);
                    var makeFace = function(options) {
                        var face = new THREE.Group();
                        holder.add(face), options.maze.forEach(function(item) {
                            var x = (item.x + item.w / 2 - blocks - .5) * size, y = (item.y + item.h / 2 - blocks - .5) * size, z = cubeSize + 1, c = cube(item.w * size, item.h * size, size, 9474192);
                            c.position.set(x, y, z), face.add(c);
                        }), options.rotation.x && (face.rotation.x = options.rotation.x * Math.PI), options.rotation.y && (face.rotation.y = options.rotation.y * Math.PI), 
                        options.rotation.z && (face.rotation.z = options.rotation.z * Math.PI);
                    };
                    function toggle() {
                        mouse.toggle = !mouse.toggle;
                    }
                    makeFace({
                        maze: mazes[0],
                        rotation: {
                            x: 0
                        },
                        colour: 16711680
                    }), makeFace({
                        maze: mazes[1],
                        rotation: {
                            x: 1,
                            z: 1.5
                        },
                        colour: 65280
                    }), makeFace({
                        maze: mazes[2],
                        rotation: {
                            x: .5,
                            z: .5
                        },
                        colour: 255
                    }), makeFace({
                        maze: mazes[3],
                        rotation: {
                            x: 1.5,
                            z: 1
                        },
                        colour: 16776960
                    }), makeFace({
                        maze: mazes[4],
                        rotation: {
                            y: .5,
                            z: 1.5
                        },
                        colour: 16711935
                    }), makeFace({
                        maze: mazes[5],
                        rotation: {
                            y: 1.5,
                            z: 1
                        },
                        colour: 65535
                    }), document.body.appendChild(renderer.domElement), progress("render:complete", renderer.domElement), 
                    render(), window.addEventListener("click", toggle), window.addEventListener("touchstart", toggle);
                }(mazes);
            }).catch(function(err) {
                con.warn("fail", err);
            });
        }
    };
});