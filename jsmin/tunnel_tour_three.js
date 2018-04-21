"use strict";

var tunnel_tour_three = function() {
    var camera, scene, renderer, mouse = {
        x: 0,
        y: 0
    }, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    var segmentIndex = 0, segmentLength = 200, segmentsInitial = 10;
    function createStraight(groupPos) {
        var group = new THREE.Group();
        group.position.set(groupPos.x, groupPos.y, groupPos.z);
        for (var min, max, props, material, geometry, size = {
            width: 20,
            height: 20,
            depth: 100
        }, i = 0, il = parseInt((min = 3, max = 15, Math.random() * (max - min) + min)); i < il; i++) {
            var a = i / il * Math.PI * 2, x = 200 * Math.sin(a), y = 200 * Math.cos(a), box = (props = size, 
            void 0, material = new THREE.MeshLambertMaterial({
                color: 10526880
            }), geometry = new THREE.BoxGeometry(props.width, props.height, props.depth), new THREE.Mesh(geometry, material));
            box.position.set(x, y, 0), box.rotation.set(0, 0, -a), group.add(box);
        }
        scene.add(group);
    }
    function createSection(index) {
        createStraight({
            x: 0,
            y: 0,
            z: index * -segmentLength
        });
    }
    function render(time) {
        camPos.x = 100 * mouse.x, camPos.y = 100 * mouse.y, camPos.z -= 20, camPos.z % segmentLength == 0 && (segmentIndex = -Math.floor(camPos.z / segmentLength), 
        createSection(segmentsInitial + segmentIndex)), camera.position.set(camPos.x, camPos.y, camPos.z), 
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 1e4), 
            scene.add(camera);
            var lightAbove = new THREE.DirectionalLight(16777215, .5);
            lightAbove.position.set(0, 200, 100), scene.add(lightAbove), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh);
            for (var j = 0, jl = segmentsInitial; j < jl; j++) createSection(j);
            function listen(eventNames, callback) {
                for (var i = 0; i < eventNames.length; i++) window.addEventListener(eventNames[i], callback);
            }
            document.body.appendChild(renderer.domElement), listen([ "resize" ], function(e) {
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

define("tunnel_tour_three", tunnel_tour_three);