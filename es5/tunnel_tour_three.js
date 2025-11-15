"use strict";

var tunnel_tour_three = function tunnel_tour_three() {
	var camera, scene, renderer;
	var mouse = { x: 0, y: 0 };
	var camPos = { x: 0, y: 0, z: 0 };
	var sw = window.innerWidth,
	    sh = window.innerHeight;

	function num(min, max) {
		return Math.random() * (max - min) + min;
	}

	var segmentIndex = 0;
	var segmentLength = 200;
	var segmentsInitial = 10;
	var sharedGeometry;
	var sharedMaterial;
	var uniforms;

	var vertexShader = ["varying vec3 vPosition;", "varying vec3 vNormal;", "void main() {", "  vPosition = position;", "  vNormal = normalize(normalMatrix * normal);", "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);", "}"].join("\n");

	var fragmentShader = ["uniform float time;", "uniform vec3 fogColor;", "uniform float fogNear;", "uniform float fogFar;", "varying vec3 vPosition;", "varying vec3 vNormal;", "void main() {",
	// Create wavy patterns for color mixing
	"  float wave1 = sin(vPosition.x * 0.1 + time * 0.001) * 0.5 + 0.5;", "  float wave2 = sin(vPosition.y * 0.1 + time * 0.0015 + 2.0) * 0.5 + 0.5;", "  float wave3 = sin(vPosition.z * 0.05 + time * 0.0008 + 4.0) * 0.5 + 0.5;",

	// Define color palette: green, cyan, white, light blue
	"  vec3 green = vec3(0.2, 1.0, 0.3);", "  vec3 cyan = vec3(0.0, 1.0, 1.0);", "  vec3 white = vec3(1.0, 1.0, 1.0);", "  vec3 lightBlue = vec3(0.4, 0.8, 1.0);",

	// Mix colors based on waves
	"  vec3 color1 = mix(green, cyan, wave1);", "  vec3 color2 = mix(lightBlue, white, wave2);", "  vec3 color = mix(color1, color2, wave3);",

	// Add some brightness variation based on distance
	"  float dist = length(vPosition);", "  float pulse = sin(dist * 0.05 - time * 0.002) * 0.2 + 0.8;", "  color *= pulse;",

	// Simple lambert lighting
	"  vec3 lightDir = normalize(vec3(0.0, 1.0, 0.5));", "  float diff = max(dot(vNormal, lightDir), 0.4);", "  color *= diff;",

	// Apply fog
	"  float depth = gl_FragCoord.z / gl_FragCoord.w;", "  float fogFactor = smoothstep(fogNear, fogFar, depth);", "  color = mix(color, fogColor, fogFactor);", "  gl_FragColor = vec4(color, 1.0);", "}"].join("\n");

	var maxBits = parseInt(num(10, 100));

	function createStraight(groupPos) {
		var group = new THREE.Group();
		group.position.set(groupPos.x, groupPos.y, groupPos.z);

		var bits = parseInt(num(3, maxBits));
		var radius = num(200, 300);

		var startAngle = num(0, Math.PI);

		for (var i = 0, il = bits; i < il; i++) {
			var a = startAngle + i / il * Math.PI * 2;
			var x = Math.sin(a) * radius;
			var y = Math.cos(a) * radius;
			var z = 0;

			var box = new THREE.Mesh(sharedGeometry, sharedMaterial);
			box.position.set(x, y, z);
			box.rotation.set(0, 0, -a);
			group.add(box);
		}
		scene.add(group);
	}

	function createSection(index) {
		createStraight({ x: 0, y: 0, z: index * -segmentLength });
	}

	function init() {
		scene = new THREE.Scene();

		// Add dark blue fog
		var fogColor = 0x000a1a; // Very dark blue
		scene.fog = new THREE.Fog(fogColor, 100, 1500);
		scene.background = new THREE.Color(fogColor);

		camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 10000);
		scene.add(camera);

		// Create shared geometry and material for better performance
		sharedGeometry = new THREE.BoxGeometry(20, 20, 100);

		// Funky animated shader material
		uniforms = {
			time: { value: 0.0 },
			fogColor: { value: new THREE.Color(fogColor) },
			fogNear: { value: 100 },
			fogFar: { value: 1500 }
		};

		sharedMaterial = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(sw, sh);

		for (var j = 0, jl = segmentsInitial; j < jl; j++) {
			createSection(j);
		}

		document.body.appendChild(renderer.domElement);

		function listen(eventNames, callback, options) {
			for (var i = 0; i < eventNames.length; i++) {
				window.addEventListener(eventNames[i], callback, options);
			}
		}
		listen(["resize"], function (_e) {
			sw = window.innerWidth;
			sh = window.innerHeight;
			camera.aspect = sw / sh;
			camera.updateProjectionMatrix();
			renderer.setSize(sw, sh);
		});

		listen(["mousemove"], function (e) {
			mouse.x = e.clientX / sw * 2 - 1;
			mouse.y = -(e.clientY / sh) * 2 + 1;
		});

		listen(["touchmove"], function (e) {
			e.preventDefault();
			if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
			mouse.x = e.clientX / sw * 2 - 1;
			mouse.y = -(e.clientY / sh) * 2 + 1;
		}, { passive: false });

		render(0);
	}

	function render(time) {
		camPos.x = mouse.x * 100;
		camPos.y = mouse.y * 100;
		camPos.z -= 20;

		if (camPos.z % segmentLength == 0) {
			segmentIndex = -Math.floor(camPos.z / segmentLength);
			createSection(segmentsInitial + segmentIndex);
		}

		camera.position.set(camPos.x, camPos.y, camPos.z);

		// Spin camera on Z-axis (the axis it's looking down)
		camera.rotation.z = time * 0.0005;

		// Update shader uniforms
		uniforms.time.value = time;

		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	return {
		init: init,
		resize: function resize() {}
	};
};

define("tunnel_tour_three", tunnel_tour_three);
