"use strict";

var camera, scene, projector, renderer, mouse = {
    x: 0,
    y: 0
}, sw = window.innerWidth, sh = window.innerHeight;

sw = sh = 400;

var n, theta = 0, h = [], i = 0, radius = 20, settings = {};

function draw(props) {
    var material = new THREE.MeshLambertMaterial({
        color: 4278198272
    }), geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 14);
    return new THREE.Mesh(geometry, material);
}

function init() {
    var light;
    con.log("init"), scene = new THREE.Scene(), (camera = new THREE.PerspectiveCamera(70, sw / sh, 1, 1e4)).position.set(0, 300, 500), 
    scene.add(camera), (light = new THREE.DirectionalLight(16777215, 2)).position.set(1, 1, 1).normalize(), 
    scene.add(light), (light = new THREE.DirectionalLight(16777215)).position.set(-1, -1, -1).normalize(), 
    scene.add(light), (renderer = new THREE.WebGLRenderer()).sortObjects = !1, renderer.setSize(sw, sh);
    for (var i = 0; i < 10; i++) {
        var scale = 1 - i / 10 + .5, height = 100 * scale, cylinder = draw({
            height: i * height,
            radius: 20 * scale
        });
        cylinder.position.set(0, height, 0), cylinder.rotation.set(0, 0, .2 * i), scene.add(cylinder);
    }
    document.body.appendChild(renderer.domElement), document.addEventListener("mousemove", onDocumentMouseMove, !1);
}

function onDocumentMouseMove(event) {
    event.preventDefault(), mouse.x = event.clientX / sw * 2 - 1, mouse.y = -event.clientY / sh * 2 + 1;
}

function render() {
    camera.position.x = 500 * Math.sin(theta * Math.PI / 360), camera.position.y = 130 * mouse.y, 
    camera.position.z = 500 * Math.cos(theta * Math.PI / 360), camera.lookAt(scene.position), 
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate), render();
}

settings.lineScale = 1, settings.lineSize = 1 + 10 * Math.random() * settings.lineScale, 
settings.lineGap = 2 + 3 * Math.random() * settings.lineScale, settings.baseRotation = 0, 
settings.varyRotation = Math.random() * Math.PI * 2, setTimeout(function() {
    init(), animate();
}, 100);