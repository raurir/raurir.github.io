"use strict";

define("triangles", function() {
    var camera, scene, renderer, holder, lightA, lightB, lightC, ambientLight, triangleShape, sw = window.innerWidth, sh = window.innerHeight, grid = [], TAU = 2 * Math.PI, triangles = 48, triSize = 130, theta = 1 / 6 * Math.PI, lenA = triSize / Math.cos(theta), lenB = lenA * Math.sin(theta), lenC = (lenA + lenB) / 2;
    function triangle() {
        triangleShape = triangleShape || function() {
            for (var shape = new THREE.Shape(), triRadius = .99 * lenA, i = 0; i < 4; i++) {
                var a = i / 3 * TAU, point = {
                    x: Math.sin(a) * triRadius,
                    y: Math.cos(a) * triRadius
                };
                0 == i ? shape.moveTo(point.x, point.y) : shape.lineTo(point.x, point.y);
            }
            return shape;
        }();
        var colour = .98 < Math.random() ? 1376239 : .99 < Math.random() ? 16716933 : 4274759, geometry = new THREE.ShapeGeometry(triangleShape), material = new THREE.MeshPhongMaterial({
            color: colour,
            side: THREE.DoubleSide,
            specular: 16777215,
            shininess: rand.getNumber(40, 60)
        });
        return {
            mesh: new THREE.Mesh(geometry, material),
            falling: !1
        };
    }
    function resize(e) {
        sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
        renderer.setSize(sw, sh);
    }
    function getZ(zi) {
        return zi * lenC + (zi % 2 ? 0 : lenC - lenB);
    }
    function fall(tri) {
        tri.falling = !0, TweenMax.to(tri.mesh.position, 2.4, {
            y: -5e3,
            ease: Quint.easeIn
        }), TweenMax.to(tri.mesh.scale, .5, {
            x: .1,
            y: .1,
            z: .1,
            delay: 2,
            ease: Quint.easeIn
        }), TweenMax.to(tri.mesh.rotation, 2.5, {
            x: rand.getNumber(-2, 2),
            y: rand.getNumber(-2, 2),
            z: rand.getNumber(-2, 2),
            ease: Quint.easeIn,
            onComplete: function(tri) {
                return function() {
                    var pos = tri.origin.pos, rot = tri.origin.rot;
                    tri.rowIndex -= triangles, pos.z = tri.mesh.position.z - getZ(triangles) + 45, tri.mesh.scale.set(1, 1, 1), 
                    tri.mesh.position.set(pos.x, pos.y, pos.z), tri.mesh.rotation.set(rot.x, rot.y, rot.z), 
                    tri.falling = !1;
                };
            }(tri)
        });
    }
    function render(time) {
        requestAnimationFrame(render), holder.rotation.z = .05 * Math.sin(5e-4 * time);
        var fallLimitZ = -1e3 - 750 * Math.sin(3e-4 * time);
        function moveLight(light, x, y, z) {
            var sc = 3e-5 * (time + 1e4);
            light.position.set(5 * Math.sin(x * sc), 1, Math.sin(z * sc) - 1);
        }
        grid.forEach(function(tri, index) {
            tri.mesh.position.z += 15, tri.mesh.position.z > fallLimitZ && 0 == tri.falling && .9 < Math.random() && fall(tri);
        }), moveLight(lightA, 15, 0, 12), moveLight(lightB, 14, 0, 13), moveLight(lightC, 20, 0, 16), 
        renderer.render(scene, camera);
    }
    return {
        init: function() {
            (scene = new THREE.Scene()).fog = new THREE.FogExp2(0, 5e-4), (camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 2e4)).position.set(0, 1e3, 1300), 
            camera.lookAt(scene.position), scene.add(camera), lightA = new THREE.DirectionalLight(16761024, .8), 
            scene.add(lightA), lightB = new THREE.DirectionalLight(16761087, .8), scene.add(lightB), 
            lightC = new THREE.DirectionalLight(12632319, .8), scene.add(lightC), ambientLight = new THREE.AmbientLight(16777215, .8), 
            scene.add(ambientLight), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
            for (var p = 0; p < triangles * triangles; p++) {
                var tri = triangle();
                holder.add(tri.mesh);
                var xi = p % triangles - triangles / 2 + .5, zi = Math.floor(p / triangles), rowEven = zi % 2, row4th = Math.floor(zi / 2) % 2, pos = {
                    x: 2 * xi * triSize + (rowEven ^ row4th ? -triSize : 0),
                    y: 0,
                    z: -5e3 + getZ(zi)
                }, rot = {
                    x: Math.PI / 2,
                    y: 0,
                    z: rowEven * Math.PI
                };
                tri.rowIndex = zi, tri.mesh.position.set(pos.x, pos.y, pos.z), tri.mesh.rotation.set(rot.x, rot.y, rot.z), 
                tri.origin = {
                    pos: pos,
                    rot: rot
                }, grid.push(tri);
            }
            document.body.appendChild(renderer.domElement), dom.on(window, [ "resize" ], resize), 
            render(0);
        }
    };
});