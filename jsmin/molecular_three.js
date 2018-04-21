"use strict";

var molecular_three = function() {
    var camera, scene, renderer, mouse = {
        x: 0,
        y: 0
    }, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    function num(min, max) {
        return Math.random() * (max - min) + min;
    }
    var segmentLastCreated, holder, segmentCreationInterval = 0, segmentLengthInitial = 50, segmentLength = segmentLengthInitial, segmentRadius = num(4, 15), sphereRadius = segmentRadius * num(1, 3), branchingAngle = num(0, 10), vectors = [], generationComplete = !1, attempts = 0, bail = 300, renderMessage = dom.element("div", {
        innerHTML: "rendering",
        style: {
            color: "white",
            position: "absolute",
            top: "10px",
            width: "100%",
            textAlign: "center"
        }
    });
    function sphere(props) {
        var material = new THREE.MeshLambertMaterial({
            color: props.colour
        }), geometry = new THREE.SphereGeometry(props.radius, 10, 10);
        return new THREE.Mesh(geometry, material);
    }
    function cylinder(props) {
        var group = new THREE.Group(), material = new THREE.MeshLambertMaterial({
            color: props.colour
        }), geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 15), object = new THREE.Mesh(geometry, material);
        return object.position.y = props.height / 2, group.add(object), {
            colour: props.colour,
            group: group,
            object: object
        };
    }
    function getSectionEnd(cylinder) {
        var numVertices = cylinder.object.geometry.vertices.length, end = cylinder.object.geometry.vertices[numVertices - 2];
        return new THREE.Vector3(end.x + cylinder.object.position.x, end.y + cylinder.object.position.y, end.z + cylinder.object.position.z);
    }
    function render(time) {
        generationComplete && (holder.rotation.y += .01), camPos.z = 1e3, camera.position.set(camPos.x, camPos.y, camPos.z), 
        camera.lookAt(scene.position), renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            colours.getRandomPalette(), (scene = new THREE.Scene()).fog = new THREE.FogExp2(0, .0015), 
            camera = new THREE.PerspectiveCamera(80, sw / sh, 1, 1e4), scene.add(camera);
            var lightAbove = new THREE.DirectionalLight(16777215, 1.5);
            lightAbove.position.set(0, 200, 100), scene.add(lightAbove);
            var lightLeft = new THREE.DirectionalLight(16777215, 4);
            function checkDistance(reference) {
                var globalPosition = new THREE.Vector3();
                globalPosition.setFromMatrixPosition(reference.matrixWorld);
                for (var st = new Date().getTime(), distanceOk = !0, i = 0, il = vectors.length; i < il && distanceOk; i++) globalPosition == vectors[i] && con.log("same one", globalPosition, vectors[i]), 
                globalPosition.distanceTo(vectors[i]) < segmentLength - 5 && (distanceOk = !1);
                var proc = new Date().getTime() - st;
                return 3 < proc && con.warn("proc time = ", proc), {
                    vector: globalPosition,
                    ok: distanceOk
                };
            }
            function drawSection(parent, endPoint) {
                var colour = colours.mutateColour(parent.colour, 50), child = cylinder({
                    radius: segmentRadius,
                    height: segmentLength,
                    colour: colour
                });
                child.group.position.set(endPoint.x, endPoint.y, endPoint.z), child.group.rotation.z = 2 * num(-.5, .5) * Math.PI * attempts / bail * branchingAngle, 
                child.group.rotation.y = num(0, 2) * Math.PI;
                var end = getSectionEnd(child), endSphere = sphere({
                    radius: 3,
                    colour: 16711680
                });
                endSphere.position.set(end.x, end.y, end.z), child.group.add(endSphere), parent.group.add(child.group), 
                parent.group.updateMatrixWorld();
                var distance = checkDistance(endSphere);
                if (child.group.remove(endSphere), distance.ok) {
                    vectors.push(distance.vector);
                    var s = sphere({
                        radius: sphereRadius,
                        colour: colour
                    });
                    return s.position.set(distance.vector.x, distance.vector.y, distance.vector.z), 
                    holder.add(s), child;
                }
                return child.group.remove(endSphere), parent.group.remove(child.group), null;
            }
            function addSection(parent) {
                if (segmentLength = (2 - ++attempts / bail) * segmentLengthInitial / 2, attempts < bail) {
                    renderMessage.innerHTML = "Rendering " + Math.round(attempts / bail * 100) + "%";
                    for (var endPoint = getSectionEnd(parent), kids = parseInt(num(1, 3)), i = 0; i < kids; i++) {
                        var newSection = drawSection(parent, endPoint);
                        newSection && (segmentLastCreated = new Date().getTime(), function(a, p) {
                            setTimeout(function() {
                                generationComplete ? con.log("wanted to created another, but time out...") : addSection(p);
                            }, 10 * attempts);
                        }(0, newSection));
                    }
                } else generationComplete = !0, renderMessage && document.body.removeChild(renderMessage), 
                renderMessage = null;
            }
            lightLeft.position.set(-100, 0, 100), scene.add(lightLeft), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder), segmentCreationInterval = setInterval(function() {
                3e3 < new Date().getTime() - segmentLastCreated && (con.log("more than 3 seconds... bailing!"), 
                generationComplete = !0, clearInterval(segmentCreationInterval));
            }, 500);
            for (var seeds = parseInt(num(10, 50)), colour = colours.getRandomColour(), j = 0; j < seeds; j++) {
                var baseSection = cylinder({
                    radius: segmentRadius,
                    height: segmentLength,
                    colour: colour
                });
                baseSection.group.rotation.set(num(0, 2) * Math.PI, num(0, 2) * Math.PI, num(0, 2) * Math.PI), 
                holder.add(baseSection.group);
                var end = getSectionEnd(baseSection), endSphere = sphere({
                    radius: sphereRadius,
                    colour: colour
                });
                endSphere.position.set(end.x, end.y, end.z), baseSection.group.add(endSphere), baseSection.group.updateMatrixWorld();
                var distance = checkDistance(endSphere);
                distance.ok ? (vectors.push(distance.vector), addSection(baseSection)) : (baseSection.group.remove(endSphere), 
                holder.remove(baseSection.group));
            }
            function listen(eventNames, callback) {
                for (var i = 0; i < eventNames.length; i++) window.addEventListener(eventNames[i], callback);
            }
            document.body.appendChild(renderer.domElement), document.body.appendChild(renderMessage), 
            listen([ "resize" ], function(e) {
                sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
                renderer.setSize(sw, sh);
            }), listen([ "mousemove", "touchmove" ], function(e) {
                e.preventDefault(), e.changedTouches && e.changedTouches[0] && (e = e.changedTouches[0]), 
                mouse.x = e.clientX / sw * 2 - 1, mouse.y = -e.clientY / sh * 2 + 1;
            }), render();
        },
        resize: function() {}
    };
};

define("molecular_three", molecular_three);