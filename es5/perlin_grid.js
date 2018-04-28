"use strict";

var vertexShader = "varying vec2 vUv;\nvoid main()\n{\n  vUv = uv;\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = projectionMatrix * mvPosition;\n}";

var fragmentShader = "\nuniform float r;\nuniform float g;\nuniform float b;\nuniform float distance;\nuniform float pulse;\nuniform float rows;\nuniform float cols;\nvarying vec2 vUv;\nfloat checkerRows = 1.5;\nfloat checkerCols = 2.0;\nvoid main( void ) {\n  vec2 position = abs(-1.0 + 2.0 * vUv);\n\n  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 1.0);\n\n  float perc = 0.25 + distance * edging * 0.75;\n  vec2 checkPosition = vUv;\n  \n  float checkerX = mod(checkPosition.x, 1.0 / rows) * rows; // loop of 0 to 1 per row: /|/|/|//\n  checkerX = abs(checkerX - 0.5) * 2.0; // make up and down: /// \n  checkerX = pow(checkerX, 3.0); // power to sharpen edges: __/__/\n\n  float checkerY = mod(checkPosition.y, 1.0 / cols) * cols;\n  checkerY = abs(checkerY - 0.5) * 2.0;\n  checkerY = pow(checkerY, 3.0);\n\n  float checkerMod = 0.0;\n  if (rows > 1.0 && floor(checkPosition.x * rows) == checkerMod) {\n    perc = 2.0;\n  }\n  if (cols > 1.0 && floor(checkPosition.y * cols) == checkerMod) {\n    perc = 2.0;\n  }\n\n  // float checker = (checkerX * checkerY) * 2.0;\n  float checker = (checkerX + checkerY) * 0.5;\n  float r1 = r * checker + 0.1;\n  float g1 = g * checker + 0.05;\n  float b1 = b * checker + 0.2;\n  float red = r1 * perc + pulse;\n  float green = g1 * perc + pulse;\n  float blue = b1 * perc + pulse + 0.05;\n\n  // float red = r;\n  // float green = g;\n  // float blue = b;\n\n  gl_FragColor = vec4(red, green, blue, 1.0);\n}";

var perlin_grid = function perlin_grid(noise) {

	var stage = document.createElement("div");

	var camera, scene, renderer;
	var mouse = { x: 0, y: 0 };
	var camPos = { x: 0, y: 0, z: 10 };
	var sw = window.innerWidth,
	    sh = window.innerHeight;

	var size = {
		width: 300,
		height: 100,
		depth: 300
	};
	var edgeSize = 50;
	var gridUnits = 7;
	var gridAbove = [];
	var gridBelow = [];
	var seed = Math.random();

	var holderAbove, holderBelow;

	function num(min, max) {
		return Math.random() * (max - min) + min;
	}

	function createMaterial(rows, cols, colourRand, distance) {
		var colourBase = { r: 0.7, g: 0.3, b: 0.6 };
		var colour = {
			r: colourBase.r + colourRand.r,
			g: colourBase.g + colourRand.g,
			b: colourBase.b + colourRand.b
		};

		var uniforms = {
			r: { type: "f", value: colour.r },
			g: { type: "f", value: colour.g },
			b: { type: "f", value: colour.b },
			// distanceX: { type: "f", value: 1.0},
			distance: { type: "f", value: distance },
			pulse: { type: "f", value: 0 },
			rows: { type: "f", value: rows },
			cols: { type: "f", value: cols }
		};

		var material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});
		return material;
	}

	function cube(options) {
		var width = options.dimensions.width;
		var height = options.dimensions.height;
		var depth = options.dimensions.depth;
		var colour = options.colour;
		var checker = options.checker;
		var distance = options.distance;
		// these coloured vars are just for debugging
		var shaderRed = createMaterial(checker[0][0], checker[0][1], colour, distance);
		var shaderYellow = createMaterial(checker[1][0], checker[1][1], colour, distance);
		var shaderGreen = createMaterial(checker[2][0], checker[2][1], colour, distance);
		var shaderBlue = createMaterial(checker[3][0], checker[3][1], colour, distance);
		var shaderCyan = createMaterial(checker[4][0], checker[4][1], colour, distance);
		var shaderMagenta = createMaterial(checker[5][0], checker[5][1], colour, distance);

		// const material = new THREE.MeshPhongMaterial({
		// 	color: props.colour,
		// 	emissive: 0x803000,
		// });

		var geometry = new THREE.BoxGeometry(width, height, depth);
		var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial([shaderRed, shaderYellow, shaderGreen, shaderBlue, shaderCyan, shaderMagenta]));

		// mesh.colours = colours;
		return mesh;
	}

	var draw = function draw(x, z, distanceFromCentre) {

		var colourRand = {
			r: num(0, 0.5),
			g: num(0, 0.5),
			b: num(0, 0.5)
		};

		var vertProps = {
			width: edgeSize,
			height: size.height,
			depth: edgeSize
		};

		var distance = size.width / 2 - edgeSize; // only because size.width == size.depth
		var holder = new THREE.Group();
		var verticalEdgeBL = cube({ // back left
			dimensions: vertProps,
			checker: [[1, 2], [1, 2], [1, 1], [1, 1], [1, 2], [1, 2]],
			colour: colourRand,
			distance: distanceFromCentre
		});
		verticalEdgeBL.position.set(-distance, 0, -distance);
		holder.add(verticalEdgeBL);
		var verticalEdgeBR = cube({
			dimensions: vertProps,
			checker: [[1, 2], [1, 2], [1, 1], [1, 1], [1, 2], [1, 2]],
			colour: colourRand,
			distance: distanceFromCentre
		});
		verticalEdgeBR.position.set(distance, 0, -distance);
		holder.add(verticalEdgeBR);
		var verticalEdgeFL = cube({
			dimensions: vertProps,
			checker: [[1, 2], [1, 2], [1, 1], [1, 1], [1, 2], [1, 2]],
			colour: colourRand,
			distance: distanceFromCentre
		});
		verticalEdgeFL.position.set(-distance, 0, distance);
		holder.add(verticalEdgeFL);
		var verticalEdgeFR = cube({
			dimensions: vertProps,
			checker: [[1, 2], [1, 2], [1, 1], [1, 1], [1, 2], [1, 2]],
			colour: colourRand,
			distance: distanceFromCentre
		});
		verticalEdgeFR.position.set(distance, 0, distance);
		holder.add(verticalEdgeFR); // front right

		var horizProps = {
			width: size.width - edgeSize,
			height: edgeSize,
			depth: edgeSize
		};
		var horizontalEdgeF = cube({
			dimensions: horizProps,
			checker: [[1, 1], [1, 1], [5, 1], [5, 1], [5, 1], [5, 1]],
			colour: colourRand,
			distance: distanceFromCentre
		});
		horizontalEdgeF.position.set(0, (size.height + edgeSize) / 2, -distance);
		holder.add(horizontalEdgeF);
		var horizontalEdgeB = cube({
			dimensions: horizProps,
			checker: [[1, 1], [1, 1], [5, 1], [5, 1], [5, 1], [5, 1]],
			colour: colourRand,
			distance: distanceFromCentre
		});
		horizontalEdgeB.position.set(0, (size.height + edgeSize) / 2, distance);
		holder.add(horizontalEdgeB);

		return holder;
	};

	function init() {
		return;

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 10000);
		camera.position.set(0, 100, 500);
		scene.add(camera);

		var light = new THREE.DirectionalLight(0xffffff, 2);
		light.position.set(1, 1, 1).normalize();
		scene.add(light);

		var light = new THREE.DirectionalLight(0xff00ff, 2);
		light.position.set(-1, 0, 0).normalize();
		scene.add(light);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		// renderer.sortObjects = false;
		renderer.setSize(sw, sh);

		holderAbove = new THREE.Group();
		scene.add(holderAbove);

		holderBelow = new THREE.Group();
		scene.add(holderBelow);

		for (var x = 0; x < gridUnits; x++) {
			for (var z = 0; z < gridUnits; z++) {
				var px = (x - gridUnits / 2 + 0.5) * size.width;
				var py = 0;
				var pz = (z - gridUnits / 2 + 0.5) * size.depth;

				var distanceFromCentre = 1 - Math.sqrt(px * px + pz * pz) / 1200;

				// con.log("distanceFromCentre", distanceFromCentre)

				var boxAbove = draw(x, z, distanceFromCentre);
				boxAbove.position.set(px, py, pz);
				holderAbove.add(boxAbove);
				gridAbove.push(boxAbove);

				var boxBelow = draw(x, z, distanceFromCentre);
				boxBelow.position.set(px, py, pz);
				boxBelow.rotation.set(Math.PI, Math.PI / 2, 0);
				holderBelow.add(boxBelow);
				gridBelow.push(boxBelow);
			}
		}

		// var boxAbove = draw(0, 0, 1);
		// scene.add(boxAbove);

		stage.appendChild(renderer.domElement);

		animate(0);
	}

	function listen(eventNames, callback) {
		for (var i = 0; i < eventNames.length; i++) {
			window.addEventListener(eventNames[i], callback);
		}
	}
	listen(["resize"], function (e) {
		sw = window.innerWidth;
		sh = window.innerHeight;
		camera.aspect = sw / sh;
		camera.updateProjectionMatrix();
		renderer.setSize(sw, sh);
	});
	listen(["mousedown", "touchstart"], function (e) {
		e.preventDefault();
		isMouseDown = true;
	});
	listen(["mousemove", "touchmove"], function (e) {
		e.preventDefault();
		if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
		mouse.x = e.clientX / sw * 2 - 1;
		mouse.y = -(e.clientY / sh) * 2 + 1;
	});
	listen(["mouseup", "touchend"], function (e) {
		e.preventDefault();
		isMouseDown = false;
	});

	function render(time) {

		var breathDistance = 1 + (1 + Math.sin(time * 0.004)) * 2;

		function renderBox(holder, value, x, z, above) {

			value = value * value * value * value; // power the fuck

			var scale = 1 + value * 50;

			var px = (x - gridUnits / 2 + 0.5) * size.width * breathDistance;
			var py = scale * size.height / 2 * above;
			var pz = (z - gridUnits / 2 + 0.5) * size.depth * breathDistance;

			holder.position.set(px, py, pz);

			// con.log('holder', scale , size.height / 2 * above)
			// con.log('holder', scale)

			// con.log("holder", holder)
			// for (var m = 0; m < holder.children.length; m++) {
			// 	var mesh = holder.children[m];
			// 	for (var n = 0; n < mesh.material.materials.length; n++) {
			// 		var material = mesh.material.materials[n];
			// 		if (Math.random() > 0.99) {
			// 			material.uniforms.pulse.value = 1;
			// 		}
			// 		material.uniforms.pulse.value -= material.uniforms.pulse.value * 0.1 / (1 + 1);

			// 	}
			// }
		}

		for (var z = 0; z < gridUnits; z++) {
			// using double high grid, first half is top, 2nd half is bottom
			for (var x = 0; x < gridUnits; x++) {
				var gridIndex = x + z * gridUnits;
				var valueAbove = (noise.perlin3(x / gridUnits, z / gridUnits, seed) + 1) / 2;
				var valueBelow = (noise.perlin3(x / gridUnits, z + gridUnits * gridUnits / gridUnits, seed) + 1) / 2;
				var holderAbove = gridAbove[gridIndex];
				var holderBelow = gridBelow[gridIndex];
				renderBox(holderAbove, valueAbove, x, z, 1);
				renderBox(holderBelow, valueBelow, x, z, -1);
			}
		}

		seed += 0.01;
		var camDistance = 400;
		camPos.x -= (camPos.x - mouse.x * 1) * 0.02;
		camPos.y -= (camPos.y - mouse.y * 1000) * 0.05;
		// var rotY = time * 0.001 + camPos.x;
		var rotY = camPos.x * 4;
		camera.position.set(Math.sin(rotY) * camDistance, camPos.y, Math.cos(rotY) * camDistance);

		camera.lookAt(scene.position);

		renderer.render(scene, camera);
	}

	function animate(time) {
		requestAnimationFrame(animate);
		if (Math.random() > 0.99) {
			var holder = Math.random() > 0.5 ? holderAbove : holderBelow;
			TweenMax.to(holder.rotation, 0.75, {
				y: Math.PI / 2 * Math.round(num(-2, 2)),
				eade: Quad.easeInOut
			});
		}
		render(time);
	}

	return {
		init: init,
		stage: stage
	};
};

define("perlin_grid", ["noise"], perlin_grid);
