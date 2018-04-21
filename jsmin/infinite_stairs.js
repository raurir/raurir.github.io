"use strict";

define("infinite_stairs", function() {
    var camera, scene, renderer, holder, sw = window.innerWidth, sh = window.innerHeight, flightWidth = 300, stepDepth = 40, stepHeight = 30, textures = {};
    function render(time) {
        requestAnimationFrame(render), renderer.render(scene, camera);
    }
    return {
        init: function() {
            !function(assets) {
                for (var loader = new THREE.TextureLoader(), i = 0; i < assets.length; i++) {
                    var assetName = assets[i];
                    textures[assetName] = loader.load("/assets/" + assetName);
                }
            }([ "wood-dark.jpg" ]), scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 2e4), 
            scene.add(camera), camera.position.set(0, 250, -100), camera.position.set(1500, 1600, -1e3), 
            camera.lookAt(new THREE.Vector3(0, 250, 100)), new THREE.OrbitControls(camera), 
            (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), renderer.shadowMap.enabled = !0, renderer.shadowMap.type = THREE.PCFSoftShadowMap, 
            holder = new THREE.Group(), scene.add(holder), function(numFlight) {
                var treadDepth = 1.25 * stepDepth, flight = (Math.floor(flightWidth / treadDepth), 
                new THREE.Group());
                holder.add(flight);
                var materialWood = new THREE.MeshPhongMaterial({
                    map: textures["wood-dark.jpg"]
                });
                function randUV(geometry) {
                    for (var uvs = geometry.faceVertexUvs[0].length, f = 0; f < uvs; f += 2) {
                        var u0 = rand.getNumber(0, .75), u1 = u0 + rand.getNumber(.1, .25), v0 = rand.getNumber(0, .75), v1 = v0 + rand.getNumber(.1, .25);
                        geometry.faceVertexUvs[0][f] = [ new THREE.Vector2(u0, v1), new THREE.Vector2(u0, v0), new THREE.Vector2(u1, v1) ], 
                        geometry.faceVertexUvs[0][f + 1] = [ new THREE.Vector2(u0, v0), new THREE.Vector2(u1, v0), new THREE.Vector2(u1, v1) ];
                    }
                    return geometry;
                }
                var wallWidth = 6 * stepDepth * 2.3 * 4, wallPanelWidth = 100, wallPanelDepth = 5, wallPanelHeight = 6 * stepHeight * 2 * 4, wallPanelSpacing = 105, numWallPanels = Math.floor(wallWidth / wallPanelWidth);
                function createWall(xFlip) {
                    var wall = new THREE.Group();
                    flight.add(wall), wall.position.set(xFlip * flightWidth / 2, 0, 0);
                    for (var i = 0; i < numWallPanels; i++) {
                        var wallGeom = randUV(new THREE.BoxGeometry(wallPanelDepth, wallPanelHeight, wallPanelWidth)), wallPanel = new THREE.Mesh(wallGeom, materialWood);
                        wallPanel.position.set(0, 0, i * wallPanelSpacing), wallPanel.castShadow = !0, wallPanel.receiveShadow = !0, 
                        wall.add(wallPanel);
                    }
                    return wall;
                }
                0 == numFlight && (createWall(-1), createWall(1));
            }(0);
            var lightAmbient = new THREE.AmbientLight(16777215, 1);
            scene.add(lightAmbient), document.body.appendChild(renderer.domElement), render();
        }
    };
});