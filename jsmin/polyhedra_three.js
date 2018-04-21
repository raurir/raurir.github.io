"use strict";

var polyhedra_three = function() {
    var camera, scene, renderer, stage = document.createElement("div"), mouse = {
        x: 0,
        y: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    sw = sh = 400;
    var polyhedron, theta = 0, settings = {};
    function onDocumentMouseMove(event) {
        event.preventDefault(), mouse.x = event.clientX / sw * 2 - 1, mouse.y = -event.clientY / sh * 2 + 1;
    }
    function render() {
        theta += 4 * mouse.x, polyhedron.rotation.y = .1 * theta, camera.lookAt(scene.position), 
        renderer.render(scene, camera);
    }
    function animate() {
        requestAnimationFrame(animate), render();
    }
    return settings.lineScale = 1, settings.lineSize = 1 + 10 * Math.random() * settings.lineScale, 
    settings.lineGap = 2 + 3 * Math.random() * settings.lineScale, settings.baseRotation = 0, 
    settings.varyRotation = Math.random() * Math.PI * 2, {
        stage: stage,
        init: function() {
            var light, time1 = new Date().getTime();
            scene = new THREE.Scene(), (camera = new THREE.PerspectiveCamera(70, sw / sh, 1, 1e4)).position.set(0, 100, 500), 
            scene.add(camera), (light = new THREE.DirectionalLight(16777215, 2)).position.set(1, 1, 1).normalize(), 
            scene.add(light), (light = new THREE.DirectionalLight(16711935, 2)).position.set(-1, 0, 0).normalize(), 
            scene.add(light), (renderer = new THREE.WebGLRenderer()).setSize(sw, sh);
            var mesh = POLYHEDRA.Icosidodecahedron;
            polyhedron = function(props) {
                var i, il, faces = [], faceRange = [], totalFaces = 0;
                props.face.map(function(face) {
                    for (i = 0, il = face.length - 2; i < il; i++) faces.push(face[0], face[i + 1], face[i + 2]);
                    totalFaces += il, faceRange.push(totalFaces);
                });
                var vertices = [];
                props.vertex.map(function(vertex) {
                    vertex.map(function(vertexIndex) {
                        vertices.push(vertexIndex);
                    });
                });
                var materials = [];
                for (i = 0, il = props.face.length; i < il; i++) {
                    var col = Math.round(255 * Math.random()) << 16 | Math.round(255 * Math.random()) << 8 | Math.round(255 * Math.random()), material = new THREE.MeshLambertMaterial({
                        color: col
                    });
                    materials.push(material);
                }
                var geometry = new THREE.PolyhedronGeometry(vertices, faces, 200, 0);
                con.log("geometry", geometry);
                var materialIndex = 0;
                for (i = 0, il = geometry.faces.length; i < il; i++) -1 < faceRange.indexOf(i) && materialIndex++, 
                geometry.faces[i].materialIndex = materialIndex;
                return material = new THREE.MeshFaceMaterial(materials), new THREE.Mesh(geometry, material);
            }(mesh), scene.add(polyhedron), stage.appendChild(renderer.domElement), document.addEventListener("mousemove", onDocumentMouseMove, !1);
            var time2 = new Date().getTime();
            render();
            var time3 = new Date().getTime();
            con.log("times", time2 - time1, time3 - time2), animate();
        }
    };
};

define("polyhedra_three", polyhedra_three);