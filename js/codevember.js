define("codevember", ["exps_details"], function(experimentsDetails) {
	con.log("experimentsDetails", experimentsDetails);

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0};
	var camPos = {x: 0, y: 0, z: 0};
	var sw = window.innerWidth, sh = window.innerHeight;

	function cube(w, h, d, colour) {
		const geometry = new THREE.PlaneGeometry(w, h, 1);
		const material = new THREE.MeshLambertMaterial({color: colour});
		return new THREE.Mesh(geometry, material);
	}

	function init() {
		// createScene();
		var codevember = experimentsDetails.getFeature("codevember");
		con.log("codevember", codevember)
	}

	function createScene() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 20000);
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0xffffff, 1);
		lightAbove.position.set(0, 1, 0.5);
		scene.add(lightAbove);

		var lightLeft = new THREE.DirectionalLight(0xf0e5a1, 0.5);
		lightLeft.position.set(-1, 0.5, 0.5);
		scene.add(lightLeft);

		var lightBelow = new THREE.DirectionalLight(0x303030, 0.2);
		lightBelow.position.set(0, -1, 0.25);
		scene.add(lightBelow);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		for (var p = 0; p < pixels * pixels; p++) {
			var c = cube(cubeSize, cubeSize, cubeSize, 0xffffff);
			holder.add(c);
			var xi = p % pixels - pixels / 2 + 0.5;
			var yi = Math.floor(p / pixels) - pixels / 2 + 0.5;
			var x = xi * gridSize;
			var y = -yi * gridSize;
			var z = 0;
			c.position.set(x, y, z);
			c.rotateSpeed = Math.random() - 0.5;
			// var unitInterval = (xi / ((pixels - 1) / 2) + 1) / 2;
			// var unitInterval = rotations[p];
			// con.log(unitInterval)
			// c.rotateAmount = Math.pow(unitInterval, 1) * 1.2;
			// c.rotateAmount = Math.sqrt(xi * xi + yi * yi);
			// if (p < pixels) con.log(unitInterval)
			grid.push(c);
		}

		document.body.appendChild(renderer.domElement);
		render(0);
	}

	function render(time) {

		// camPos.z = 100; //ortho camera
		camPos.x = 0 + Math.sin(time * 0.00012) * 50;
		// camPos.y = -cubeSize * pixels + Math.sin(time * 0.00017) * 50;
		camPos.y = 0 + Math.sin(time * 0.00017) * 50;
		camPos.z = 400 + Math.sin(time * 0.0001) * 300;

		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}

	return {
		init: init
	}

});