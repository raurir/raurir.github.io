"use strict";

define("cannon_demo", function() {
    var Demo = function(options) {
        options = options || {};
        var that = this;
        this.create = function(initfunc) {
            demo = initfunc;
        }, this.start = function() {
            demo();
        };
        var settings = this.settings = {
            stepFrequency: 60,
            quatNormalizeSkip: 2,
            quatNormalizeFast: !0,
            gx: 0,
            gy: 0,
            gz: 0,
            iterations: 3,
            tolerance: 1e-4,
            k: 1e6,
            d: 3,
            scene: 0,
            paused: !1,
            rendermode: "solid",
            constraints: !1,
            contacts: !1,
            cm2contact: !1,
            normals: !1,
            axes: !1,
            particleSize: .1,
            shadows: !1,
            aabbs: !1,
            profiling: !1,
            maxSubSteps: 3
        };
        if (settings.stepFrequency % 60 != 0) throw new Error("stepFrequency must be a multiple of 60.");
        var demo, bodies = this.bodies = [], visuals = this.visuals = [], solidMaterial = (this.particleGeo = new THREE.SphereGeometry(1, 16, 8), 
        new THREE.MeshPhongMaterial({
            color: 3157034,
            emissive: 0,
            specular: 5323312,
            shininess: 80
        }));
        this.wireframeMaterial = new THREE.MeshLambertMaterial({
            color: 16711680,
            wireframe: !0
        }), this.currentMaterial = solidMaterial;
        this.particleMaterial = new THREE.MeshLambertMaterial({
            color: 16711680
        });
        var light, scene, ambient, world = this.world = new CANNON.World();
        world.broadphase = new CANNON.NaiveBroadphase();
        var camera, controls, renderer, container, SHADOW_MAP_WIDTH = 512, SHADOW_MAP_HEIGHT = 512, MARGIN = 0, SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN, NEAR = 5, FAR = 2e3;
        !function() {
            if (container = document.getElementById("experiment-holder"), (camera = new THREE.PerspectiveCamera(24, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR)).position.set(0, -100, 50), 
            (scene = that.scene = new THREE.Scene()).fog = new THREE.Fog(2236962, 1e3, FAR), 
            camera.lookAt(scene.position), ambient = new THREE.AmbientLight(2236962), scene.add(ambient), 
            (light = new THREE.SpotLight(16777215)).position.set(30, -100, 40), light.target.position.set(0, 0, 0), 
            light.castShadow = !0, light.shadow.camera.near = 10, light.shadow.camera.far = 100, 
            light.shadow.mapSize.width = SHADOW_MAP_WIDTH, light.shadow.mapSize.height = SHADOW_MAP_HEIGHT, 
            scene.add(light), scene.add(camera), (renderer = new THREE.WebGLRenderer({
                clearColor: 0,
                clearAlpha: 1,
                antialias: !1
            })).setSize(SCREEN_WIDTH, SCREEN_HEIGHT), renderer.domElement.style.position = "relative", 
            renderer.domElement.style.top = MARGIN + "px", container.appendChild(renderer.domElement), 
            document.addEventListener("mousemove", onDocumentMouseMove), window.addEventListener("resize", onWindowResize), 
            renderer.shadowMap.enabled = !0, renderer.shadowMap.type = THREE.PCFSoftShadowMap, 
            options.trackballControls) {
                (controls = new THREE.TrackballControls(camera, renderer.domElement)).rotateSpeed = 1, 
                controls.zoomSpeed = 1.2, controls.panSpeed = .2, controls.noZoom = !1, controls.noPan = !1, 
                controls.staticMoving = !1, controls.dynamicDampingFactor = .3;
                controls.minDistance = 0, controls.maxDistance = 1e5, controls.screen.width = SCREEN_WIDTH, 
                controls.screen.height = SCREEN_HEIGHT;
            }
        }(), function animate() {
            requestAnimationFrame(animate);
            !function() {
                for (var N = bodies.length, i = 0; i < N; i++) {
                    var b = bodies[i], visual = visuals[i];
                    visual.position.copy(b.position), b.quaternion && visual.quaternion.copy(b.quaternion);
                }
            }();
            !function() {
                var timeStep = 1 / settings.stepFrequency, now = Date.now() / 1e3;
                if (!lastCallTime) return world.step(timeStep), lastCallTime = now;
                var timeSinceLastCall = now - lastCallTime;
                world.step(timeStep, timeSinceLastCall, settings.maxSubSteps), lastCallTime = now;
            }();
            controls && controls.update(), renderer.clear(), renderer.render(that.scene, camera);
        }();
        var lastCallTime = 0;
        function onDocumentMouseMove(event) {}
        function onWindowResize(event) {
            SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight, renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT), 
            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT, camera.updateProjectionMatrix(), controls && (controls.screen.width = SCREEN_WIDTH, 
            controls.screen.height = SCREEN_HEIGHT), camera.radius = (SCREEN_WIDTH + SCREEN_HEIGHT) / 4;
        }
    };
    (Demo.prototype = {
        constructor: Demo
    }).getWorld = function() {
        return this.world;
    }, Demo.prototype.addVisual = function(body, material) {
        var mesh;
        body instanceof CANNON.Body ? mesh = this.shape2mesh(body, material) : con.log("custom body!!!", body), 
        mesh && (this.bodies.push(body), this.visuals.push(mesh), body.visualref = mesh, 
        body.visualref.visualId = this.bodies.length - 1, this.scene.add(mesh));
    }, Demo.prototype.addVisuals = function(bodies) {
        for (var i = 0; i < bodies.length; i++) this.addVisual(bodies[i]);
    }, Demo.prototype.removeVisual = function(body) {
        if (body.visualref) {
            for (var bodies = this.bodies, visuals = this.visuals, old_b = [], old_v = [], n = bodies.length, i = 0; i < n; i++) old_b.unshift(bodies.pop()), 
            old_v.unshift(visuals.pop());
            for (var id = body.visualref.visualId, j = 0; j < old_b.length; j++) {
                if (j !== id) bodies[i = id < j ? j - 1 : j] = old_b[j], visuals[i] = old_v[j], 
                bodies[i].visualref = old_b[j].visualref, bodies[i].visualref.visualId = i;
            }
            body.visualref.visualId = null, this.scene.remove(body.visualref), body.visualref = null;
        }
    }, Demo.prototype.removeAllVisuals = function() {
        for (;this.bodies.length; ) this.removeVisual(this.bodies[0]);
    };
    var hackyMcHack = 0;
    return Demo.prototype.shape2mesh = function(body, material) {
        material = material || this.currentMaterial;
        this.settings.renderMode;
        var obj = new THREE.Object3D();
        function addMesh(mesh, shapeIndex) {
            if (mesh.receiveShadow = !0, mesh.castShadow = !0, mesh.children) for (var i = 0; i < mesh.children.length; i++) if (mesh.children[i].castShadow = !0, 
            mesh.children[i].receiveShadow = !0, mesh.children[i]) for (var j = 0; j < mesh.children[i].length; j++) mesh.children[i].children[j].castShadow = !0, 
            mesh.children[i].children[j].receiveShadow = !0;
            var o = body.shapeOffsets[shapeIndex], q = body.shapeOrientations[shapeIndex];
            mesh.position.set(o.x, o.y, o.z), mesh.quaternion.set(q.x, q.y, q.z, q.w), obj.add(mesh);
        }
        if (body.custom) {
            var shape = body.shapes[0], mesh = new THREE.Object3D();
            switch (body.customType) {
              case "CHAIN_LINK":
                for (var box_geometry = new THREE.BoxGeometry(2 * shape.halfExtents.x, 2 * shape.halfExtents.y, 2 * shape.halfExtents.z), link = (new THREE.Mesh(box_geometry, this.wireframeMaterial), 
                new THREE.Object3D()), points = [], pitch = shape.halfExtents.z, i = 0; i <= 10; i++) {
                    var a = i / 10 * Math.PI * -2;
                    points.push(new THREE.Vector2(.8 + .3 * Math.sin(a), .3 * Math.cos(a)));
                }
                var geometry = new THREE.LatheBufferGeometry(points, 10, 0, Math.PI), linkEnd0 = new THREE.Mesh(geometry, material);
                linkEnd0.position.set(0, 0, pitch), linkEnd0.rotation.set(0, -Math.PI / 2, 0), link.add(linkEnd0);
                var linkEnd1 = new THREE.Mesh(geometry, material);
                linkEnd1.position.set(0, 0, -pitch), linkEnd1.rotation.set(0, -Math.PI / 2, Math.PI), 
                link.add(linkEnd1);
                geometry = new THREE.CylinderBufferGeometry(.3, .3, 2 * pitch, 10);
                var cylinder0 = new THREE.Mesh(geometry, material);
                cylinder0.rotation.set(Math.PI / 2, 0, 0), cylinder0.position.set(.8, 0, 0), link.add(cylinder0);
                var cylinder1 = new THREE.Mesh(geometry, material);
                cylinder1.rotation.set(Math.PI / 2, 0, 0), cylinder1.position.set(-.8, 0, 0), link.add(cylinder1), 
                linkEnd0.receiveShadow = !0, linkEnd0.castShadow = !0, linkEnd1.receiveShadow = !0, 
                linkEnd1.castShadow = !0, cylinder0.receiveShadow = !0, cylinder0.castShadow = !0, 
                cylinder1.receiveShadow = !0, cylinder1.castShadow = !0, mesh.add(link), link.rotation.z = hackyMcHack++ % 2 * Math.PI / 2;
                break;

              default:
                throw new Error("need to supply customType!");
            }
            return addMesh(mesh, 0), obj;
        }
        for (var l = 0; l < body.shapes.length; l++) {
            switch ((shape = body.shapes[l]).type) {
              case CANNON.Shape.types.SPHERE:
                var sphere_geometry = new THREE.SphereGeometry(shape.radius, 18, 18);
                mesh = new THREE.Mesh(sphere_geometry, material);
                break;

              case CANNON.Shape.types.PARTICLE:
                mesh = new THREE.Mesh(this.particleGeo, this.particleMaterial);
                var s = this.settings;
                mesh.scale.set(s.particleSize, s.particleSize, s.particleSize);
                break;

              case CANNON.Shape.types.PLANE:
                geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
                mesh = new THREE.Object3D();
                var submesh = new THREE.Object3D(), ground = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                    color: 9474192
                }));
                ground.scale.set(100, 100, 100), submesh.add(ground), ground.castShadow = !0, ground.receiveShadow = !0, 
                mesh.add(submesh);
                break;

              case CANNON.Shape.types.BOX:
                box_geometry = new THREE.BoxGeometry(2 * shape.halfExtents.x, 2 * shape.halfExtents.y, 2 * shape.halfExtents.z);
                mesh = new THREE.Mesh(box_geometry, material);
                break;

              case CANNON.Shape.types.CONVEXPOLYHEDRON:
                var geo = new THREE.Geometry();
                for (i = 0; i < shape.vertices.length; i++) {
                    var v = shape.vertices[i];
                    geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
                }
                for (i = 0; i < shape.faces.length; i++) for (var face = shape.faces[i], j = (a = face[0], 
                1); j < face.length - 1; j++) {
                    var b = face[j], c = face[j + 1];
                    geo.faces.push(new THREE.Face3(a, b, c));
                }
                geo.computeBoundingSphere(), geo.computeFaceNormals(), mesh = new THREE.Mesh(geo, material);
                break;

              case CANNON.Shape.types.HEIGHTFIELD:
                geometry = new THREE.Geometry();
                for (var v0 = new CANNON.Vec3(), v1 = new CANNON.Vec3(), v2 = new CANNON.Vec3(), xi = 0; xi < shape.data.length - 1; xi++) for (var yi = 0; yi < shape.data[xi].length - 1; yi++) for (var k = 0; k < 2; k++) {
                    shape.getConvexTrianglePillar(xi, yi, 0 === k), v0.copy(shape.pillarConvex.vertices[0]), 
                    v1.copy(shape.pillarConvex.vertices[1]), v2.copy(shape.pillarConvex.vertices[2]), 
                    v0.vadd(shape.pillarOffset, v0), v1.vadd(shape.pillarOffset, v1), v2.vadd(shape.pillarOffset, v2), 
                    geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
                    i = geometry.vertices.length - 3;
                    geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
                }
                geometry.computeBoundingSphere(), geometry.computeFaceNormals(), mesh = new THREE.Mesh(geometry, material);
                break;

              case CANNON.Shape.types.TRIMESH:
                for (geometry = new THREE.Geometry(), v0 = new CANNON.Vec3(), v1 = new CANNON.Vec3(), 
                v2 = new CANNON.Vec3(), i = 0; i < shape.indices.length / 3; i++) {
                    shape.getTriangleVertices(i, v0, v1, v2), geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
                    j = geometry.vertices.length - 3;
                    geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
                }
                geometry.computeBoundingSphere(), geometry.computeFaceNormals(), mesh = new THREE.Mesh(geometry, material);
                break;

              default:
                throw "Visual type not recognized: " + shape.type;
            }
            addMesh(mesh, l);
        }
        return obj;
    }, Demo;
});