"use strict";

define("codevember", [ "exps_details" ], function(experimentsDetails) {
    var holder, camera, scene, renderer, lightA, lightB, lightC, ambientLight, pixels = 10, cubeSize = 400, gridSize = 440, cubeDepth = 50, grid = [], camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    function render(time) {
        function moveLight(light, x, y, z) {
            light.position.set(Math.sin((time + 1e4) * x * 1e-5), Math.sin((time + 1e4) * y * 1e-5), Math.sin((time + 1e4) * z * 1e-5));
        }
        grid.forEach(function(c) {
            c.shift.position = 20 * Math.sin(time * c.shift.speed), c.position.z = c.shift.position;
        }), moveLight(lightA, 15, 17, 12), moveLight(lightB, 14, 19, 13), moveLight(lightC, 20, 18, 16), 
        camPos.x = 50 * Math.sin(12e-5 * time), camPos.y = 50 * Math.sin(17e-5 * time), 
        camPos.z = 400 + 300 * Math.sin(3e-5 * time), camera.position.set(camPos.x, camPos.y, camPos.z), 
        camera.lookAt(scene.position), renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            !function() {
                (scene = new THREE.Scene()).fog = new THREE.FogExp2(0, .002), camera = new THREE.PerspectiveCamera(120, sw / sh, 1, 2e4), 
                scene.add(camera), (lightA = new THREE.DirectionalLight(16769279, .19)).position.set(0, 1, .5), 
                scene.add(lightA), (lightB = new THREE.DirectionalLight(15787425, .15)).position.set(-1, .5, .5), 
                scene.add(lightB), (lightC = new THREE.DirectionalLight(8453631, .18)).position.set(0, -1, .25), 
                scene.add(lightC), (renderer = new THREE.WebGLRenderer({
                    antialias: !0
                })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder), ambientLight = new THREE.AmbientLight(16777215, .2), 
                scene.add(ambientLight);
                for (var p = 0; p < pixels * pixels; p++) {
                    var c = (material = new THREE.MeshPhongMaterial({
                        color: 18555,
                        specular: 10086143,
                        shininess: 30
                    }), geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeDepth), new THREE.Mesh(geometry, material));
                    holder.add(c);
                    var xi = p % pixels - pixels / 2 + .5, yi = Math.floor(p / pixels) - pixels / 2 + .5, x = xi * gridSize, y = -yi * gridSize;
                    c.position.set(x, y, 0), c.shift = {
                        speed: 1e-4 * (.1 + Math.random()),
                        position: 0
                    }, grid.push(c);
                }
                var material, geometry;
                document.body.appendChild(renderer.domElement), render(0);
            }(), function() {
                var codevember = experimentsDetails.getFeature("codevember");
                document.body.appendChild(dom.element("style", {
                    innerText: [ "a { color: white; }", "a:hover { color: #87d9ff; text-shadow: 0px 0px 16px #fff; }", "div { box-sizing: border-box;}", ".holder { color: white; display: block; position: absolute; overflow: auto;", "top: 20%; left: 10%; height: 50%; border: 1px dashed rgba(255,255,255,0.4);", " transform: rotate3d(0.3, 0.5, 0.9, 8deg); width: 80%; z-index: 50; }", ".item { display: block; clear: both; line-height: 25px; }", ".day { color: #bcd1d6; display: inline-block; float: left; padding-right: 10px; text-align: right; width: 20%; }", ".title { color: #999; display: inline-block; float: left; width: 80%; }", ".clickable .title { color: #fff; }" ].join(" ")
                }));
                var textHolder = dom.element("div", {
                    className: "holder",
                    innerHTML: "<h1>CODEVEMBER</H1>"
                });
                codevember.forEach(function(exp) {
                    var codeItem = exp.link ? dom.element("a", {
                        className: "item clickable",
                        href: "/?" + exp.link
                    }) : dom.element("div", {
                        className: "item"
                    }), codeItemDay = dom.element("div", {
                        className: "day",
                        innerHTML: "Day " + exp.day
                    }), codeItemTitle = dom.element("div", {
                        className: "title",
                        innerHTML: exp.title
                    });
                    textHolder.appendChild(codeItem), codeItem.appendChild(codeItemDay), codeItem.appendChild(codeItemTitle);
                }), document.body.appendChild(textHolder);
            }();
        },
        resize: function(w, h) {
            renderer.setSize(w, h), camera.aspect = w / h, camera.updateProjectionMatrix();
        }
    };
});