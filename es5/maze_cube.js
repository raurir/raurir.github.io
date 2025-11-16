"use strict";

var vertexShader = "\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec3 vLocalPosition;\nvoid main() {\n\tvPosition = position;\n\tvNormal = normalize(normalMatrix * normal);\n\tvLocalPosition = position;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n";

var fragmentShader = "\nprecision mediump float;\nuniform float time;\nuniform vec3 baseColor;\nvarying vec3 vPosition;\nvarying vec3 vNormal;\nvarying vec3 vLocalPosition;\n\nfloat hash(float n) {\n\treturn fract(sin(n) * 43758.5453);\n}\n\nfloat noise(vec3 p) {\n\tvec3 i = floor(p);\n\tvec3 f = fract(p);\n\tf = f * f * (3.0 - 2.0 * f);\n\tfloat n = i.x + i.y * 57.0 + 113.0 * i.z;\n\treturn mix(\n\tmix(mix(hash(n + 0.0), hash(n + 1.0), f.x),\n\t\tmix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),\n\tmix(mix(hash(n + 113.0), hash(n + 114.0), f.x),\n\t\tmix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);\n}\n\nfloat fbm(vec3 p, float time) {\n\tfloat value = 0.0;\n\tfloat amplitude = 0.5;\n\tfloat frequency = (cos((time + 100.0) * 0.08) + sin(time * 0.12) + 2.5) * 0.1;\n\tfor (int i = 0; i < 4; i++) {\n\t\tvalue += amplitude * noise(p * frequency);\n\t\tfrequency *= 2.0;\n\t\tamplitude *= 0.5;\n\t}\n\treturn value;\n}\n\nvoid main() {\n\tvec3 pos = vLocalPosition * 0.05;\n\tpos += vec3(time * 0.0, time * 0.0, time * 0.0);\n\tfloat noiseValue = fbm(pos, time * 0.001);\n\tfloat blob = smoothstep(0.3, 0.7, noiseValue);\n\tblob = pow(blob, 1.5);\n\tfloat detail = fbm(pos * 3.0, 1.0);\n\tblob = mix(blob, detail * 0.5 + 0.5, 0.3);\n\tvec3 color1 = vec3(0.1, 0.0, 0.0);\n\tvec3 color2 = vec3(0.8, 0.2, 0.1);\n\tvec3 color = mix(color1, color2, blob);\n\tfloat glow = pow(blob, 2.0) * 0.3;\n\tcolor += vec3(0.5, 0.4, 0.3) * glow;\n\tvec3 lightDir = normalize(vec3(0.0, 1.0, 0.5));\n\tfloat diff = max(dot(vNormal, lightDir), 0.3);\n\tcolor *= diff;\n\tgl_FragColor = vec4(color, 1.0);\n}\n";

define("maze_cube", ["linked_line"], function (linkedLine) {
	var blocks = 11;
	var cubeSize = 1512;
	var size = cubeSize / blocks;

	var camera, scene, renderer;
	var mouse = { x: 0, y: 0, toggle: true };
	var camPos = { x: 0, y: 0, z: 0 };
	var sw = window.innerWidth,
	    sh = window.innerHeight;
	var holder;
	var controls;
	var materialShader;
	var materialPhong;
	var uniforms;

	function cube(w, h, d, materialType) {
		var group = new THREE.Group();

		var geometry = new THREE.BoxGeometry(w, h, d);
		var material;
		switch (materialType) {
			case "shader":
				material = materialShader;
				break;
			case "phong":
				material = materialPhong;
				break;
		}
		var object = new THREE.Mesh(geometry, material);
		object.castShadow = true;
		object.receiveShadow = true;
		group.add(object);
		return group;
	}

	function init() {
		console.log("init maze cube");
		var mazes = [];

		var face = function face(preoccupied) {
			return linkedLine.generate(blocks, preoccupied);
		};
		var add = function add(maze) {
			console.log("adding walls:", mazes.length, maze.wallrects.length);
			mazes.push(maze.wallrects);
			progress("render:progress", mazes.length / 6);
		};

		perf.start("gen");

		face().then(add).then(function () {
			// add a custom face with a block little piece cut out...
			return face([{ x: 1, y: 2 }, { x: 1, y: 3 }, { x: 3, y: 3 }]);
		}).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(function () {
			console.log("success");
			perf.end("gen");
			init3D(mazes);
		}).catch(function (err) {
			console.warn("fail", err);
		});
	}

	function init3D(mazes) {
		// console.log(mazes);

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.0002);

		camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 20000);
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0x909090, 1.5);
		lightAbove.castShadow = true;
		lightAbove.position.set(0, 200, 0);
		scene.add(lightAbove);

		materialPhong = new THREE.MeshPhongMaterial({
			color: 0x101010,
			emissive: 0x301000,
			specular: 0x602020,
			shininess: 100
		});

		uniforms = {
			time: { value: 0.0 },
			baseColor: { value: new THREE.Color(0xff00ff) }
		};
		materialShader = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: uniforms,
			fog: false
		});

		var lightLeft = new THREE.DirectionalLight(0xffffff, 1.5);
		lightLeft.position.set(-100, 0, 0);
		scene.add(lightLeft);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(sw, sh);
		renderer.shadowMap = {
			type: THREE.BasicShadowMap,
			enabled: true
		};

		// controls = new THREE.OrbitControls( camera, renderer.domElement );

		holder = new THREE.Group();
		scene.add(holder);

		var c = cube(cubeSize * 2 - size, cubeSize * 2 - size, cubeSize * 2 - size, "shader");
		holder.add(c);

		var makeFace = function makeFace(options) {
			var face = new THREE.Group();
			holder.add(face);

			options.maze.forEach(function (item) {
				var x = (item.x + item.w / 2 - blocks - 0.5) * size;
				var y = (item.y + item.h / 2 - blocks - 0.5) * size;
				var z = cubeSize + 1;
				var c = cube(item.w * size, item.h * size, size, "phong");
				c.position.set(x, y, z);
				face.add(c);
			});
			if (options.rotation.x) face.rotation.x = options.rotation.x * Math.PI;
			if (options.rotation.y) face.rotation.y = options.rotation.y * Math.PI;
			if (options.rotation.z) face.rotation.z = options.rotation.z * Math.PI;
			// face.rotation.set(options.rotation.x * Math.PI, options.rotation.y * Math.PI, options.rotation.z * Math.PI);
			// return face;
		};

		makeFace({ maze: mazes[0], rotation: { x: 0 }, colour: 0xff0000 });
		makeFace({ maze: mazes[1], rotation: { x: 1, z: 1.5 }, colour: 0x00ff00 });
		makeFace({ maze: mazes[2], rotation: { x: 0.5, z: 0.5 }, colour: 0x0000ff });
		makeFace({ maze: mazes[3], rotation: { x: 1.5, z: 1 }, colour: 0xffff00 });
		makeFace({ maze: mazes[4], rotation: { y: 0.5, z: 1.5 }, colour: 0xff00ff });
		makeFace({ maze: mazes[5], rotation: { y: 1.5, z: 1 }, colour: 0x00ffff });

		document.body.appendChild(renderer.domElement);
		progress("render:complete", renderer.domElement);
		render(0);

		function exportToObj() {
			console.log("exportToObj"); // for printing.
			var exporter = new THREE.OBJExporter();
			var result = exporter.parse(scene);
			var floatingDiv = document.createElement("div");
			floatingDiv.style.display = "block";
			floatingDiv.style.background = "white";
			floatingDiv.style.color = "black";
			floatingDiv.innerHTML = result.split("\n").join("<br />");
			console.log("result.length", result.length);
			document.body.appendChild(floatingDiv);
		}
		// window.addEventListener("click", exportToObj);
		function toggle() {
			mouse.toggle = !mouse.toggle;
		}
		window.addEventListener("click", toggle);
		window.addEventListener("touchstart", toggle);
	}

	function render(time) {
		if (mouse.toggle) {
			holder.rotation.x += Math.PI * 0.005;
			// holder.rotation.y -= 0.01;
			holder.rotation.z -= Math.PI * 0.002;
			// if (holder.rotation.x >= Math.PI * 2) {
			// 	// mouse.toggle = false
			// }
		}

		// Update shader time uniform
		uniforms.time.value = time;

		camPos.z = 5000;
		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
		// controls.update();
		requestAnimationFrame(render);
	}

	return {
		init: init
	};
});
