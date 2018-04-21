"use strict";

var tetris_cube = function() {
    var camera, scene, renderer, holder, stage = document.createElement("div"), mouse = {
        x: 0,
        y: 0
    }, sw = window.innerWidth, sh = window.innerHeight, theta = 0, gamma = 0, dim = 4, size = 40, cubes = [], groups = [], available = [];
    function onDocumentMouseMove(event) {
        event.preventDefault(), mouse.x = event.clientX / sw * 2 - 1, mouse.y = -event.clientY / sh * 2 + 1;
    }
    function render() {
        gamma += 4 * mouse.y, holder.rotation.x = .1 * gamma, holder.rotation.y = .1 * theta, 
        camera.lookAt(scene.position), renderer.render(scene, camera);
    }
    function animate() {
        requestAnimationFrame(animate), render();
    }
    return {
        stage: stage,
        init: function() {
            var light, material, geometry;
            function p(index) {
                return (index - dim / 2 + .5) * size;
            }
            function getPositionFromIndex(index) {
                return {
                    x: index % dim,
                    y: Math.floor(index / dim) % dim,
                    z: Math.floor(index / (dim * dim))
                };
            }
            scene = new THREE.Scene(), (camera = new THREE.PerspectiveCamera(70, sw / sh, 1, 1e4)).position.set(0, 100, 500), 
            scene.add(camera), (light = new THREE.DirectionalLight(16777215, 2)).position.set(1, 1, 1).normalize(), 
            scene.add(light), (light = new THREE.DirectionalLight(16711935, 2)).position.set(-1, 0, 0).normalize(), 
            scene.add(light), (renderer = new THREE.WebGLRenderer()).setSize(sw, sh), holder = new THREE.Group(), 
            scene.add(holder);
            for (var i = 0; i < dim * dim * dim; i++) {
                var c = (material = new THREE.MeshLambertMaterial({
                    color: 0
                }), geometry = new THREE.BoxGeometry(size, size, size), new THREE.Mesh(geometry, material)), _getPositionFromIndex = getPositionFromIndex(i), x = _getPositionFromIndex.x, y = _getPositionFromIndex.y, z = _getPositionFromIndex.z;
                available.push(i), c.position.set(p(x), p(y), p(z)), c.groupId = 0, cubes.push(c), 
                holder.add(c);
            }
            var globalGroupId = 1, loners = [], MODE_GROUP_EXPAND = "MODE_GROUP_EXPAND", MODE_LONER_UNITE = "MODE_LONER_UNITE", checkMode = MODE_GROUP_EXPAND;
            function checkNeighbours(sourceIndex) {
                function checkNeighbour(targetPosition) {
                    var _ref, x, y, z, targetIndex = (x = (_ref = targetPosition).x, y = _ref.y, z = _ref.z, 
                    x + y * dim + z * dim * dim);
                    checkMode === MODE_GROUP_EXPAND && 0 === cubes[targetIndex].groupId ? (setGroup(targetIndex, cubes[sourceIndex].groupId), 
                    count++) : checkMode === MODE_LONER_UNITE && 0 < cubes[targetIndex].groupId && (setGroup(sourceIndex, cubes[targetIndex].groupId), 
                    count++);
                }
                var availableIndex, _getPositionFromIndex2 = getPositionFromIndex(sourceIndex), x = _getPositionFromIndex2.x, y = _getPositionFromIndex2.y, z = _getPositionFromIndex2.z, count = 0, queue = [];
                function queueCheck(pos) {
                    queue.push(pos);
                }
                0 === x ? queueCheck({
                    x: x + 1,
                    y: y,
                    z: z
                }) : x === dim - 1 ? queueCheck({
                    x: x - 1,
                    y: y,
                    z: z
                }) : (queueCheck({
                    x: x - 1,
                    y: y,
                    z: z
                }), queueCheck({
                    x: x + 1,
                    y: y,
                    z: z
                })), 0 === y ? queueCheck({
                    x: x,
                    y: y + 1,
                    z: z
                }) : y === dim - 1 ? queueCheck({
                    x: x,
                    y: y - 1,
                    z: z
                }) : (queueCheck({
                    x: x,
                    y: y - 1,
                    z: z
                }), queueCheck({
                    x: x,
                    y: y + 1,
                    z: z
                })), 0 === z ? queueCheck({
                    x: x,
                    y: y,
                    z: z + 1
                }) : z === dim - 1 ? queueCheck({
                    x: x,
                    y: y,
                    z: z - 1
                }) : (queueCheck({
                    x: x,
                    y: y,
                    z: z - 1
                }), queueCheck({
                    x: x,
                    y: y,
                    z: z + 1
                })), rand.shuffle(queue);
                for (var q = 0; q < queue.length; q++) checkNeighbour(queue[q]);
                0 === count && loners.push(sourceIndex), checkMode === MODE_GROUP_EXPAND && (availableIndex = Math.floor(available.length * Math.random()), 
                available.length ? (setGroup(availableIndex = available[availableIndex], ++globalGroupId), 
                checkNeighbours(availableIndex)) : (con.log("all done...", groups), setTimeout(function() {
                    groups.forEach(function(group, groupIndex) {
                        var average = {
                            x: (groupIndex % 4 - 2) * size * 4,
                            y: Math.floor(groupIndex / 4 - 1) * size * 4,
                            z: 0
                        };
                        group.forEach(function(mesh) {
                            TweenMax.to(mesh.position, .5, {
                                x: mesh.position.x + average.x,
                                y: mesh.position.y + average.y,
                                z: mesh.position.z + average.z,
                                delay: .1 * groupIndex
                            });
                        });
                    });
                }, 1700)));
            }
            function setGroup(targetIndex, groupId) {
                var maxSize = checkMode === MODE_LONER_UNITE ? 6 : 4;
                if (groups[groupId] || (groups[groupId] = []), groups[groupId].length !== maxSize) {
                    var c = cubes[targetIndex];
                    groups[groupId].push(c), c.groupId = groupId;
                    var availableIndex = available.indexOf(targetIndex);
                    available.splice(availableIndex, 1);
                }
            }
            for (setGroup(0, globalGroupId), checkNeighbours(0), con.log(loners), rand.shuffle(loners), 
            con.log(loners), checkMode = MODE_LONER_UNITE, i = 0; i < loners.length; i++) checkNeighbours(loners[i]);
            for (i = 0; i < cubes.length; i++) {
                var col = 25700 | 20 * (c = cubes[i]).groupId % 255 << 16;
                c.material.color.setHex(col);
            }
            stage.appendChild(renderer.domElement), document.addEventListener("mousemove", onDocumentMouseMove, !1), 
            render(), animate();
        }
    };
};

define("tetris_cube", tetris_cube);