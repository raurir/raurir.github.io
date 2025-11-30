"use strict";

define("isometric_words", [], function () {
  rand.setSeed(Math.random());

  var pic =
    "\n   \u2588\u2588\u2588\u2588\u2588        \u2588\u2588\u2588\u2588\u2588     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\n\u2588\u2588\u2588\u2588         \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\n\u2588\u2588\u2588\u2588         \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n\u2588\u2588\u2588\u2588         \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n\u2588\u2588\u2588\u2588         \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\n\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588  \u2588\u2588\u2588\u2588\n \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588    \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588   \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n   \u2588\u2588\u2588\u2588\u2588        \u2588\u2588\u2588\u2588\u2588     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588     \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\n\n";

  var cubeSize = 10;

  function getCamera(direction) {
    var d = 1000 * direction;
    return {
      x: -1 * d, // notice positive/negative units... see comments below regarding magic offset
      y: 1 * d,
      z: 1 * d,
    };
  }

  var camera, scene, renderer;
  var camPos = getCamera(1);
  var sw = window.innerWidth,
    sh = window.innerHeight;
  var holder;

  function cube() {
    var colour = colours.getNextColour();
    var material = new THREE.MeshLambertMaterial({
      color: colour,
    });
    var geometry = new THREE.BoxGeometry(
      cubeSize,
      cubeSize,
      cubeSize,
    );
    return new THREE.Mesh(geometry, material);
  }

  function randomRotate() {
    return (Math.random() - 0.5) * 1;
  }

  function init() {
    colours.getRandomPalette();

    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(
      sw / -2,
      sw / 2,
      sh / 2,
      sh / -2,
      1,
      20000,
    );
    scene.add(camera);

    camera.position.set(camPos.x, camPos.y, camPos.z);
    camera.lookAt(scene.position);

    var lightAbove = new THREE.DirectionalLight(0xffd0d0, 1);
    lightAbove.position.set(0, 1, 0);
    scene.add(lightAbove);

    var lightLeft = new THREE.DirectionalLight(0xd0ffd0, 1);
    lightLeft.position.set(1, 0, 0);
    scene.add(lightLeft);

    var lightBelow = new THREE.DirectionalLight(0xd0d0ff, 1);
    lightBelow.position.set(0, 0, 1);
    scene.add(lightBelow);

    var light = new THREE.AmbientLight(0x606060);
    scene.add(light);

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(sw, sh);

    holder = new THREE.Group();
    scene.add(holder);
    holder.rotation.set(
      randomRotate(),
      randomRotate(),
      randomRotate(),
    );

    var lines = pic.split("\n");
    var width = lines.reduce(function (a, b) {
      return Math.max(a, b.length);
    }, 0);
    var height = lines.length;

    lines.forEach(function (line, y) {
      line.split("").forEach(function (pixel, x) {
        if (pixel === "█") {
          var c = cube();
          holder.add(c);
          var magicOffset = rand.getInteger(-10, 10);
          c.position.set(
            (x - width / 2 + magicOffset) * cubeSize, // add magic offset
            (-y + height / 2 - magicOffset) * cubeSize, // minus magic offset
            -magicOffset * cubeSize, // minus magic offset
          );
        }
      });
    });

    document.body.appendChild(renderer.domElement);
    render(0);
    morph();
  }
  var weird = true;
  function morph() {
    weird = !weird;
    var rotateMod = weird ? 1 : 0;
    TweenMax.to(holder.rotation, 5, {
      x: rotateMod * randomRotate(),
      y: rotateMod * randomRotate(),
      z: rotateMod * randomRotate(),
      ease: Quint.easeInOut,
      onComplete: morph,
    });
  }
  function render(time) {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  return {
    init: init,
  };
});
