"use strict";

var pine_three = function() {
    var camera, scene, renderer, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    min = 0, max = 10, Math.random();
    var min, max, holder, generationComplete = !1;
    function render(time) {
        generationComplete && (holder.rotation.y += .01), camPos.z = 1e3, camera.position.set(camPos.x, camPos.y, camPos.z), 
        camera.lookAt(scene.position), renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            colours.getRandomPalette(), scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(80, sw / sh, 1, 1e4), 
            scene.add(camera);
            var lightAbove = new THREE.DirectionalLight(16777215, 1.5);
            lightAbove.position.set(0, 200, 100), scene.add(lightAbove);
            var lightLeft = new THREE.DirectionalLight(16777215, 4);
            lightLeft.position.set(-100, 0, 100), scene.add(lightLeft), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
            var segmentRadius = 10, segmentLength = 50, colour = colours.getRandomColour();
            new THREE.Vector3(0, 0, 0), function(parent, endPoint) {
                var props, group, material, geometry, object, colour = colours.mutateColour(parent.colour, 50), child = (props = {
                    radius: segmentRadius,
                    height: segmentLength,
                    colour: colour
                }, group = new THREE.Group(), material = new THREE.MeshLambertMaterial({
                    color: props.colour
                }), geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 15), 
                (object = new THREE.Mesh(geometry, material)).position.y = props.height / 2, group.add(object), 
                {
                    colour: props.colour,
                    group: group,
                    object: object
                });
                parent.group.add(child.group), parent.group.updateMatrixWorld();
            }({
                colour: colour,
                group: holder
            }), document.body.appendChild(renderer.domElement), render();
        },
        resize: function() {}
    };
};

define("pine_three", pine_three);