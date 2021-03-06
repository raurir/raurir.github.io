"use strict";

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

	function cube(w, h, d, colour) {
		var group = new THREE.Group();
		var material = new THREE.MeshPhongMaterial({
			color: colour,
			emissive: 0x803000,
			specular: 0xa08080,
			shininess: 40
			// color: colour,
		});

		var geometry = new THREE.BoxGeometry(w, h, d);
		var object = new THREE.Mesh(geometry, material);
		object.castShadow = true;
		object.receiveShadow = true;
		group.add(object);
		return group;
	}

	function init() {
		var mazes = [];

		var face = function face(preoccupied) {
			return linkedLine.generate(blocks, preoccupied);
		};
		var add = function add(maze) {
			con.log("adding walls:", mazes.length, maze.wallrects.length);
			mazes.push(maze.wallrects);
			progress("render:progress", mazes.length / 6);
		};

		perf.start('gen');

		face().then(add).then(function () {
			// add a custom face with a block little piece cut out... 
			return face([{ x: 1, y: 2 }, { x: 1, y: 3 }, { x: 3, y: 3 }]);
		}).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(function () {
			con.log("success");
			perf.end('gen');
			init3D(mazes);
		}).catch(function (err) {
			con.warn("fail", err);
		});
	}

	function init3D(mazes) {

		// con.log(mazes);

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.0002);

		camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 20000);
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0x909090, 1.5);
		lightAbove.castShadow = true;
		lightAbove.position.set(0, 200, 0);

		// lightAbove.shadow = {
		// 	bias: 0.00002,
		// 	mapSize: {
		// 		width: 1024,
		// 		height: 1024
		// 	},
		// 	camera: {
		// 		near: 1,
		// 		far: 85,
		// 		fov: 110
		// 	}
		// }
		// lightAbove.distance = 130;
		// lightAbove.angle = Math.PI/3;


		scene.add(lightAbove);

		// var lightLeft = new THREE.DirectionalLight(0xffffff, 1.5);
		// lightLeft.position.set(-100, 0, 100);
		// scene.add(lightLeft);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(sw, sh);
		renderer.shadowMap = {
			type: THREE.BasicShadowMap,
			enabled: true
		};

		// controls = new THREE.OrbitControls( camera, renderer.domElement );

		holder = new THREE.Group();
		scene.add(holder);

		var c = cube(cubeSize * 2 - size, cubeSize * 2 - size, cubeSize * 2 - size, 0x403020);
		holder.add(c);

		var makeFace = function makeFace(options) {
			var face = new THREE.Group();
			holder.add(face);

			options.maze.forEach(function (item) {
				var x = (item.x + item.w / 2 - blocks - 0.5) * size;
				var y = (item.y + item.h / 2 - blocks - 0.5) * size;
				var z = cubeSize + 1;
				var c = cube(item.w * size, item.h * size, size, 0x909090); // options.colour);
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
			con.log("exportToObj"); // for printing.
			var exporter = new THREE.OBJExporter();
			var result = exporter.parse(scene);
			var floatingDiv = document.createElement("div");
			floatingDiv.style.display = 'block';
			floatingDiv.style.background = "white";
			floatingDiv.style.color = "black";
			floatingDiv.innerHTML = result.split('\n').join('<br />');
			con.log("result.length", result.length);
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
