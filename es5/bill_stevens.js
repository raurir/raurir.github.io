"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// must solve this for...
define("bill_stevens", function () {
	// ... and jan

	var stage = document.createElement("div");

	var camera, scene, projector, renderer, holder;
	var mouse = { x: 0, y: 0 };
	var sw = window.innerWidth,
	    sh = window.innerHeight;
	var theta = 0,
	    gamma = 0;
	var dim = 4;
	var size = 30;
	var cubes = [];

	var available = Array(Math.pow(dim, 3)).fill(0);
	var occupied = Array(Math.pow(dim, 3)).fill(0);
	var positions = [];

	var position = function position(grid) {
		return (
			// (index) => (index - grid / 2 + 0.5) * size;
			function (index) {
				return index * size;
			}
		);
	};

	var populate = function populate(array, index) {
		return array[index]++;
	};

	var getPositionFromIndex = function getPositionFromIndex(grid) {
		return function (index) {
			var x = index % grid;
			var y = Math.floor(index / grid) % grid;
			var z = Math.floor(index / (grid * grid));
			return { x: x, y: y, z: z };
		};
	};

	var getIndexFromPosition = function getIndexFromPosition(_ref) {
		var x = _ref.x,
		    y = _ref.y,
		    z = _ref.z;
		return x + y * dim + z * dim * dim;
	};

	var pieces = [
	/*
 {
 	id: 0,
 	structure: [
 		[
 			[1,1],
 			[1,0],
 		],[
 			[1,0],
 			[0,0],
 		]
 	]
 },
 */
	{
		id: 1,
		structure: [[[1, 1, 1], [1, 0, 0]]]
	}, {
		id: 3,
		structure: [[[1, 1, 1, 1]]]
	}].map(function (piece) {
		// calculate dimensions (bounds)
		var structure = piece.structure;

		var w = 0,
		    h = 0,
		    d = 0;
		structure.forEach(function (xLayer, x) {
			w = Math.max(w, x + 1);
			xLayer.forEach(function (yRow, y) {
				h = Math.max(h, y + 1);
				yRow.forEach(function (piece, z) {
					d = Math.max(d, z + 1);
				});
			});
		});
		return Object.assign(piece, {
			dimensions: { w: w, h: h, d: d }
		});
	});
	// console.log(pieces);

	var cube = function cube(scale) {
		var d = scale * size;
		var material = new THREE.MeshLambertMaterial({ color: 0 });
		var geometry = new THREE.BoxGeometry(d, d, d);
		return new THREE.Mesh(geometry, material);
	};

	var getBlock = function getBlock() {

		var test = occupied.slice();
		// con.log(test);
		var piece = pieces[Math.floor(Math.random() * pieces.length)];
		var structure = piece.structure;


		var p = position(dim);

		var hex = colours.getNextColour();
		var mutated = colours.mutateColour(hex, 30);
		var colour = Number("0x" + mutated.substr(1));

		var block = new THREE.Group();
		block.x = rand.getInteger(0, dim - piece.dimensions.w);
		block.y = rand.getInteger(0, dim - piece.dimensions.h);
		block.z = rand.getInteger(0, dim - piece.dimensions.d);

		block.rotation.set(rand.getInteger(-1, 1) * Math.PI / 2, rand.getInteger(-1, 1) * Math.PI / 2, rand.getInteger(-1, 1) * Math.PI / 2);

		var positions = [],
		    vectors = [];

		structure.forEach(function (xLayer, x) {
			xLayer.forEach(function (yRow, y) {
				yRow.forEach(function (piece, z) {
					if (piece) {
						var c = cube(1);
						c.position.set(p(x), p(y), p(z));
						c.material.color.setHex(colour);
						block.add(c);

						var positionIndex = getIndexFromPosition({
							x: x + block.x,
							y: y + block.y,
							z: z + block.z
						});
						positions.push(positionIndex);
						populate(test, positionIndex);
					}
				});
			});
		});

		if (test.some(function (item) {
			return item > 1;
		})) {
			return con.log("invalid!");
		}

		block.position.set(block.x * size, block.y * size, block.z * size);
		// return block;

		holder.add(block);

		block.updateMatrixWorld();

		// calculate absolute positions using THREE'S nested bodies calculation.
		var min = { x: 0, y: 0, z: 0 };

		block.children.forEach(function (c, index) {
			var vector = new THREE.Vector3();
			vector.setFromMatrixPosition(c.matrixWorld);
			var cleansed = {};
			Object.entries(vector).forEach(function (_ref2) {
				var _ref3 = _slicedToArray(_ref2, 2),
				    key = _ref3[0],
				    value = _ref3[1];

				// remove inifitely small numbers created by matrix rotations.
				var v = value > 0 && value < 0.001 || value < 0 && value > -0.001 ? 0 : value;
				cleansed[key] = v / size;
				min[key] = Math.min(min[key], cleansed[key]);
			});
			vectors[index] = cleansed;
		});

		//
		TweenMax.to(block.rotation, 3.5, { x: 0, y: 0, z: 0 });

		block.children.forEach(function (c, index) {
			var pos = vectors[index];
			var newPos = {
				x: (pos.x - min.x) * size,
				y: (pos.y - min.y) * size,
				z: (pos.z - min.z) * size
			};
			TweenMax.to(c.position, 3.5, newPos);
			con.log(pos, newPos);
		});

		positions.forEach(function (positionIndex) {
			populate(occupied, positionIndex);
		});

		// con.log("occupied", occupied);
	};

	var init = function init() {

		colours.getRandomPalette();

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(50, sw / sh, 1, 10000);
		camera.position.set(0, 100, 500);
		scene.add(camera);

		var light = new THREE.DirectionalLight(0xffffff, 2);
		light.position.set(1, 1, 1).normalize();
		scene.add(light);

		var light = new THREE.DirectionalLight(0xff00ff, 2);
		light.position.set(-1, 0, 0).normalize();
		scene.add(light);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		var p = position(dim + 1);
		for (var i = 0; i < Math.pow(dim + 1, 3); i++) {
			var c = cube(0.1);

			var _getPositionFromIndex = getPositionFromIndex(dim + 1)(i),
			    x = _getPositionFromIndex.x,
			    y = _getPositionFromIndex.y,
			    z = _getPositionFromIndex.z;

			c.position.set(p(x), p(y), p(z));
			c.material.color.setHex(0xff7700);
			cubes.push(c);
			holder.add(c);
		}

		stage.appendChild(renderer.domElement);

		document.addEventListener('mousemove', onDocumentMouseMove, false);
		document.addEventListener('keydown', onKeyDown, false);

		render();
		animate();
		attemptBlock();
	};

	var a = 0;
	var attemptBlock = function attemptBlock() {
		getBlock();

		if (occupied.every(function (item) {
			return item === 1;
		})) {
			return con.log("we're done here!!", occupied);
		}

		// con.log(available, occupied);
		a++;
		if (a > 3) return; //1e3) return;
		setTimeout(attemptBlock, 2000);
	};

	var onDocumentMouseMove = function onDocumentMouseMove(event) {
		event.preventDefault();
		mouse.x = event.clientX / sw * 2 - 1;
		mouse.y = -(event.clientY / sh) * 2 + 1;
	};

	var onKeyDown = function onKeyDown(event) {
		// con.log(event);
		return;

		switch (event.key) {
			case "ArrowLeft":
				b.x--;break;
			case "ArrowUp":
				b.y--;break;
			case "ArrowRight":
				b.x++;break;
			case "ArrowDown":
				b.y++;break;
		}

		var mesh = b;

		TweenMax.to(mesh.position, 0.5, {
			x: b.x * size,
			y: b.y * size,
			z: b.z * size
		});

		// event.preventDefault();
	};

	var render = function render() {

		var camRadius = 300;

		// theta += 0.3;// mouse.x * 4;
		// gamma -= 0.435;//mouse.y * 2;

		camera.position.x = 200; //camRadius * Math.sin( theta * Math.PI / 360 );
		camera.position.y = 300; //mouse.y * 100;
		camera.position.z = 400; //camRadius * Math.cos( theta * Math.PI / 360 );
		camera.lookAt(scene.position);
		renderer.render(scene, camera);
	};

	var animate = function animate() {
		requestAnimationFrame(animate);
		render();
	};

	return { stage: stage, init: init };
});
