var maze_cube = function() {

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0};
	var camPos = {x: 0, y: 0, z: 0};
	var sw = window.innerWidth, sh = window.innerHeight;
	var holder;
	var texture;

	function cube(s) {
		var group = new THREE.Group();
		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: texture ? texture : null
		});
		var geometry = new THREE.BoxGeometry(s, s, s);
		var object = new THREE.Mesh(geometry, material);
		group.add(object);
		return group;
	}

	function init() {

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.0015);

		camera = new THREE.PerspectiveCamera( 80, sw / sh, 1, 10000 );
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0xffffff, 1.5);
		lightAbove.position.set(0, 200, 100);
		scene.add(lightAbove);

		var lightLeft = new THREE.DirectionalLight(0xffffff, 4);
		lightLeft.position.set(-100, 0, 100);
		scene.add(lightLeft);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		texture = new THREE.TextureLoader().load("./maze-face.png", function() {
			var c = cube(512);
			holder.add(c);
		});

		// var grid = [["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"],["#","#",".",".",".",".",".",".",".",".",".",".","#",".","#",".",".",".","#",".",".",".","#",".",".",".","#",".","#",".",".","#"],["#",".",".","#",".","#",".","#","#","#","#","#","#",".",".",".","#","#","#",".","#",".",".",".","#",".",".",".",".",".","#","#"],["#","#",".","#",".","#",".",".",".",".",".","#","#",".","#",".",".",".","#",".","#","#","#","#","#",".","#","#","#",".",".","#"],["#","#",".","#","#","#","#","#","#","#",".","#",".",".","#","#","#",".",".",".",".","#",".",".",".",".",".",".","#","#",".","#"],["#",".",".",".","#",".",".",".","#",".",".","#","#",".","#",".","#","#","#","#","#","#",".","#","#","#","#","#","#",".",".","#"],["#",".","#",".",".",".","#","#","#","#",".",".",".",".",".",".",".",".","#","#",".",".",".","#","#",".","#",".",".",".","#","#"],["#",".","#",".","#",".",".",".",".","#","#","#",".","#",".","#","#","#","#",".",".","#",".","#",".",".","#","#",".","#","?","#"],["#",".","#","#","#","#","#","#","#","#",".",".",".","#","#","#",".",".",".",".","#","#","#","#","#",".",".","#",".","#","?","#"],["#",".",".","#",".",".",".","#","#",".",".","#","#","#",".",".",".","#","#","#","#",".","#",".","#","#",".","#",".",".","#","#"],["#",".","#","#",".","#",".",".","#","#","#","#","#",".",".","#","#","#","#",".",".",".","#",".","#","#",".","#","#",".",".","#"],["#","#","#",".",".","#","#",".",".",".",".",".",".",".","#","#",".",".","#",".","#",".",".",".",".","#",".",".","#","#",".","#"],["#",".",".",".","#","#","?","#","#","#","#","#","#","#","#","#","#",".",".",".","#","#","#","#",".","#",".","#","#","#",".","#"],["#",".","#","#","#",".","#",".",".","#",".",".","#","#",".",".",".",".","#",".",".",".","#","#",".",".",".","#",".","#",".","#"],["#",".",".",".",".",".","#","#",".","#","#",".",".",".",".","#",".","#","#","#","#",".",".","#","#","#",".","#",".","#",".","#"],["#","#",".","#","#",".","#","#",".","#","#",".","#","#","#","?","#","#",".",".","#","#",".",".","#",".",".",".",".","#",".","#"],["#",".",".","#",".",".","#",".",".","#",".",".","#",".",".","#",".",".",".","#","?","#",".","#","#",".","#","#","#","#",".","#"],["#","#",".","#",".","#","#","#",".","#","#",".","#","#",".",".",".","#","#","#","#",".",".",".","#","#","#",".",".",".",".","#"],["#",".",".","#",".","#",".","#",".","#",".",".","#","#",".","#","#","#",".",".",".",".","#","#","#",".",".",".","#","#",".","#"],["#",".","#","#",".","#",".","#",".",".",".","#","#",".",".",".","#","#","#","#","#",".",".",".","#","#",".","#","#",".",".","#"],["#",".",".","#",".","#",".",".",".","#",".","#",".",".","#","#","#",".",".",".","#","#","#",".",".","#",".","#","#","#",".","#"],["#","#",".","#",".","#","#",".","#","#",".",".",".","#","#",".",".",".","#",".",".",".","#",".","#","#",".",".",".","#",".","#"],["#",".",".","#",".",".","#","#","#","?","#","#","#","#",".",".","#","#","#","#","#",".","#",".",".","#","#",".","#","#",".","#"],["#",".","#","?","#",".",".",".",".","#","#",".",".",".",".","#","#",".",".",".","#",".","#","#",".",".","#",".","#","#",".","#"],["#",".","#","?","#","#",".","#","#","#",".",".","#","#","#","#",".",".","#",".","#",".",".","#","#",".","#",".",".","#","#","#"],["#",".",".","#",".","#",".","#",".",".",".","#","#",".",".","#","#",".","#","#","#","#",".",".","#",".","#","#",".",".","#","#"],["#","#",".",".",".","#",".",".",".","#","#","#","?","#",".",".",".",".",".",".",".","#","#",".","#",".","#","#","#",".",".","#"],["#","#","#","#",".","#","#","#","#","#","#",".","#","#","#","#","#","#","#",".","#","#",".",".","#",".",".",".","#","#",".","#"],["#",".",".",".",".",".","#",".",".",".","#",".","#",".",".",".","#","#",".",".","#","#",".","#","#",".","#","#","#","#",".","#"],["#","#",".","#","#",".",".",".","#",".",".",".","#",".","#",".",".",".",".","#","#",".",".","#",".",".",".","#",".",".",".","#"],[".",",",".",".","#","#",".","#","#",".","#",".",".",".","#","#",".","#","#","#",".",".","#","#",".","#",".",".",".","#",".","#"],["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#",".",".","#","#","#","#","#","#","#","#","#","#","#"]];
		// var size = 10, items = 32;;
		// grid.forEach(function(row, ri) {
		// 	row.forEach(function(item, ci) {
		// 		if (item == "#") {
		// 			var x = (ci - items / 2) * size, y = (ri - items / 2) * size, z = items / 2 * size;
		// 			var c = cube(size);
		// 			c.position.set(x, y, z);
		// 			holder.add(c);
		// 		}
		// 	});
		// });

		// texture.wrapS = THREE.RepeatWrapping;
		// texture.wrapT = THREE.RepeatWrapping;
		// texture.repeat.set(8, 8);

		document.body.appendChild(renderer.domElement);
		render(0);

	}



	function render(time) {
		holder.rotation.x += 0.01;
		holder.rotation.z -= 0.01;
		camPos.z = 1000;
		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}

	return {
		init: init
	}

};

define("maze_cube", maze_cube);