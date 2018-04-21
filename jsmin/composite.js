"use strict";

var focalLength = 1200;

function calc2D(points, axisRotations) {
    for (var x, y, z, xy, xz, yx, yz, scaleRatio, t = [], sx = Math.sin(axisRotations.x), cx = Math.cos(axisRotations.x), sy = Math.sin(axisRotations.y), cy = Math.cos(axisRotations.y), sz = Math.sin(axisRotations.z), cz = Math.cos(axisRotations.z), i = 0, il = points.length; i < il; i++) x = points[i].x, 
    x = (cz * (yx = sy * (xz = sx * (y = points[i].y) + cx * (z = points[i].z)) + cy * x) - sz * (xy = cx * y - sx * z)) * (scaleRatio = focalLength / (focalLength + (yz = cy * xz - sy * x))), 
    y = (sz * yx + cz * xy) * scaleRatio, t[i] = make2DPoint(x, y, yz);
    return t;
}

function calcNormal(p1, p2, p3) {
    var u = {};
    u.x = p2.x - p1.x, u.y = p2.y - p1.y, u.z = p2.z - p1.z;
    var v = {};
    v.x = p3.x - p1.x, v.y = p3.y - p1.y, v.z = p3.z - p1.z;
    var n = {};
    return n.x = u.y * v.z - u.z * v.y, n.y = u.z * v.x - u.x * v.z, n.z = u.x * v.y - u.y * v.x, 
    n;
}

if (make3DPoint = function(x, y, z) {
    var point = {};
    return point.x = x, point.y = y, point.z = z, point;
}, make2DPoint = function(x, y, z) {
    var point = {};
    return point.x = x + sw / 2, point.y = y + sh / 2, point.z = z, point;
}, cubeAxisRotations = make3DPoint(0, 0, 0), renderPlanes = function(group, planesArray, options) {
    for (var list = [], i = 0, il = planesArray.length; i < il; i++) {
        for (var screenPoints = calc2D(planesArray[i], cubeAxisRotations), minX = 1e6, minY = 1e6, minZ = 1e6, maxX = 0, maxY = 0, maxZ = 0, vertices = [], av = {
            x: 0,
            y: 0
        }, vil = screenPoints.length, vi = 0; vi < vil; vi++) {
            var v = screenPoints[vi];
            vertices.push({
                x: v.x,
                y: v.y
            }), v.x < minX && (minX = v.x), v.x > maxX && (maxX = v.x), v.y < minY && (minY = v.y), 
            v.y > maxY && (maxY = v.y), v.z < minZ && (minZ = v.z), v.z > maxZ && (maxZ = v.z), 
            av.x = av.x + v.x, av.y = av.y + v.y;
        }
        av.x = av.x / vil, av.y = av.y / vil;
        var zIndex = minZ + (maxZ - minZ) / 2, normal3D = calcNormal(screenPoints[0], screenPoints[1], screenPoints[2]), normalLength = Math.sqrt(normal3D.x * normal3D.x + normal3D.y * normal3D.y + normal3D.z * normal3D.z), normalised3D = {
            x: normal3D.x / normalLength,
            y: normal3D.y / normalLength,
            z: normal3D.z / normalLength
        }, face = {
            z: zIndex,
            o: vertices
        };
        if (options) {
            var params = {
                slope: {
                    x: Math.acos(normalised3D.x),
                    y: Math.asin(normal3D.y / normalLength),
                    z: Math.acos(normalised3D.z)
                },
                bounds: [ minX, minY, maxX, maxY ],
                vertices: vil
            };
            face.params = params;
        }
        list[i] = face;
    }
    list.sort(function(a, b) {
        return a.z < b.z ? 1 : -1;
    });
    for (i = 0, il = list.length; i < il; i++) {
        vertices = list[i].o;
        options.fillColor && (group.fillStyle = options.fillColor(list[i].params)), group.beginPath();
        v = 0;
        for (var vl = vertices.length; v < vl; v++) {
            var x = vertices[v].x, y = vertices[v].y;
            0 == v ? group.moveTo(x, y) : group.lineTo(x, y);
        }
        group.closePath(), group.fill();
    }
}, define(function(require) {
    var stage = dom.element("div"), b1 = dom.button("test1", {
        style: {
            color: "white"
        }
    }), b2 = dom.button("test2", {
        style: {
            color: "white"
        }
    });
    return stage.appendChild(b1), stage.appendChild(b2), dom.on(b1, [ "click" ], function go() {
        con.log("go!!");
        dom.on(b2, [ "click" ], go);
        dom.off(b1, [ "click" ], go);
    }), con.log("test loaded"), {
        stage: stage,
        init: function() {},
        resize: function() {}
    };
}), function() {
    var can, con, ctx, d, draw, init, seeds, time;
    con = console, d = document, can = ctx = null, time = 0, seeds = [], init = function() {
        var i, _i;
        for ((can = d.createElement("canvas")).width = can.height = 400, d.body.appendChild(can), 
        ctx = can.getContext("2d"), i = _i = 0; _i < 4; i = _i += 1) seeds[i] = Math.pow(2, i + 1) + 10 * (2 * Math.random() - 1);
        return con.log(seeds), draw();
    }, draw = function() {
        var i, v, x, y, _i, _j;
        for (can.width = can.width, time += 1, x = _i = 0; _i < 200; x = _i += 1) {
            for (i = _j = v = 0; _j < 4; i = _j += 1) v += Math.sin((time + x) * seeds[i] * .01) / Math.pow(2, i + 1);
            y = 200 + 200 * v / 4, 100, ctx.fillStyle = "rgba(100,100,100,0.4)", ctx.fillRect(2 * x, y, 10, 10);
        }
        return requestAnimationFrame(draw);
    }, init();
}.call(this), define("aegean_sun", [ "perlin" ], function(perlin) {
    var sw = window.innerWidth, sh = window.innerHeight, w = 400, h = 400, channelX = perlin.noise(w, h), channelY = perlin.noise(w, h), cols = (rand.getInteger(100, 300), 
    rand.getInteger(4, 10), Math.floor(sw * sh / 200), colours.getRandomPalette()), canvas = dom.canvas(sw, sh), ctx = canvas.ctx;
    return {
        init: function() {
            var bg = colours.getRandomColour();
            cols.splice(cols.indexOf(bg), 1), ctx.fillStyle = bg, ctx.fillRect(0, 0, sw, sh), 
            ctx.strokeStyle = colours.getNextColour(), function(t) {
                var noiseX = channelX.cycle(100 * Math.random(), .005), noiseY = channelY.cycle(100 * Math.random(), .004), segments = 20;
                function recurse(line, offset) {
                    for (var segments = line.length, nextLine = [], i = 0; i < segments; i++) {
                        var p = {
                            x: line[i].x + offset.x,
                            y: line[i].y + offset.y
                        }, noiseIndex = Math.floor(p.y * w + p.x), x = 2 * (noiseX[noiseIndex] - .5), y = 0 * (noiseY[noiseIndex] - .5);
                        p.x += x, p.y += y, nextLine.push(p);
                    }
                    return renderLine(nextLine), nextLine;
                }
                function renderLine(line) {
                    var segments = line.length;
                    ctx.beginPath();
                    for (var i = 0; i < segments; i++) {
                        var p = line[i];
                        0 == i ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
                    }
                    ctx.stroke();
                }
                for (var line = function() {
                    for (var p0 = {
                        x: rand.getNumber(.4, .6) * w,
                        y: 0 * h
                    }, p1 = {
                        x: rand.getNumber(.4, .6) * w,
                        y: 1 * h
                    }, line = [], i = 0; i < segments; i++) {
                        var p = geom.lerp(p0, p1, i / segments);
                        line.push(p);
                    }
                    return renderLine(line), line;
                }(), next = line, prev = line, i = 0; i < 40; i++) next = recurse(next, {
                    x: 4,
                    y: 0
                }), prev = recurse(prev, {
                    x: -4,
                    y: 0
                });
            }();
        },
        stage: canvas.canvas
    };
}), isNode = "undefined" != typeof module) var con = console, rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var camera, scene, projector, renderer, alien = function() {
    var centre, stage = dom.canvas(1, 1), ctx = stage.ctx, numberOfRows = 10, numberOfColumns = 10, cellSize = Math.ceil(rand.getInteger(20, 60) / numberOfColumns), halfColumns = numberOfColumns / 2, canvasWidth = cellSize * (numberOfColumns + 2), canvasHeight = cellSize * (numberOfRows + 2);
    function render() {
        var aliens = function() {
            function r(m) {
                return ~~(Math.random() * m + 1);
            }
            function q() {
                for (var l = r(11), g = r(5), a = [], i = 0; i < l; ) j = i * g, a.push(j), i && a.unshift(-j), 
                i++;
                return a;
            }
            return {
                x: q(),
                y: q()
            };
        }();
        con.log(aliens), aliens.x.forEach(function(x, xi) {
            aliens.y.forEach(function(y) {
                var img = function() {
                    var grid = [], lineSize = rand.getInteger(0, 3);
                    lineSize && (lineSize = cellSize / lineSize);
                    var bmp = dom.canvas(canvasWidth, canvasHeight);
                    function drawCell(y, x, fillStyle, strokeWidth) {
                        var colReflected = void 0;
                        colReflected = halfColumns <= x ? numberOfColumns - x - 1 : x;
                        var isOn = grid[y][colReflected];
                        isOn && (bmp.ctx.fillStyle = fillStyle, bmp.ctx.fillRect((1 + x) * cellSize - strokeWidth, (1 + y) * cellSize - strokeWidth, cellSize + 2 * strokeWidth, cellSize + 2 * strokeWidth));
                    }
                    return function() {
                        for (var row = 0; row < numberOfRows; row++) {
                            grid[row] = [];
                            for (var column = 0; column < halfColumns; column++) grid[row][column] = (probability = column, 
                            Math.random() < (probability + 1) / (halfColumns + 1));
                        }
                        var probability;
                    }(), function() {
                        var column = void 0, row = void 0, colourLine = colours.getNextColour(), colourFill = colours.getNextColour();
                        for (row = 0; row < numberOfRows; row++) for (column = 0; column < numberOfColumns; column++) drawCell(row, column, colourLine, lineSize);
                        for (row = 0; row < numberOfRows; row++) for (column = 0; column < numberOfColumns; column++) drawCell(row, column, colourFill || colours.getNextColour(), 0);
                    }(), bmp.canvas;
                }();
                ctx.drawImage(img, centre + x * canvasWidth, centre + y * canvasHeight);
            }), progress("render:progress", xi / aliens.x.length);
        }), progress("render:complete", stage.canvas);
    }
    return {
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
            centre = sh / 2, colours.getRandomPalette(), render();
        },
        render: render,
        stage: stage.canvas
    };
};

isNode ? module.exports = alien() : define("alien", alien);

var mouse = {
    x: 0,
    y: 0
}, sw = window.innerWidth, sh = window.innerHeight;

sw = sh = 400;

var n, theta = 0, h = [], i = 0, radius = 20;

function draw(props) {
    var material = new THREE.MeshLambertMaterial({
        color: 4278198272
    }), geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 14);
    return new THREE.Mesh(geometry, material);
}

function init() {
    var light;
    con.log("init"), scene = new THREE.Scene(), (camera = new THREE.PerspectiveCamera(70, sw / sh, 1, 1e4)).position.set(0, 300, 500), 
    scene.add(camera), (light = new THREE.DirectionalLight(16777215, 2)).position.set(1, 1, 1).normalize(), 
    scene.add(light), (light = new THREE.DirectionalLight(16777215)).position.set(-1, -1, -1).normalize(), 
    scene.add(light), (renderer = new THREE.WebGLRenderer()).sortObjects = !1, renderer.setSize(sw, sh);
    for (var i = 0; i < 10; i++) {
        var scale = 1 - i / 10 + .5, height = 100 * scale, cylinder = draw({
            height: i * height,
            radius: 20 * scale
        });
        cylinder.position.set(0, height, 0), cylinder.rotation.set(0, 0, .2 * i), scene.add(cylinder);
    }
    document.body.appendChild(renderer.domElement), document.addEventListener("mousemove", onDocumentMouseMove, !1);
}

function onDocumentMouseMove(event) {
    event.preventDefault(), mouse.x = event.clientX / sw * 2 - 1, mouse.y = -event.clientY / sh * 2 + 1;
}

function render() {
    camera.position.x = 500 * Math.sin(theta * Math.PI / 360), camera.position.y = 130 * mouse.y, 
    camera.position.z = 500 * Math.cos(theta * Math.PI / 360), camera.lookAt(scene.position), 
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate), render();
}

if ((settings = {}).lineScale = 1, settings.lineSize = 1 + 10 * Math.random() * settings.lineScale, 
settings.lineGap = 2 + 3 * Math.random() * settings.lineScale, settings.baseRotation = 0, 
settings.varyRotation = Math.random() * Math.PI * 2, setTimeout(function() {
    init(), animate();
}, 100), isNode = "undefined" != typeof module) {
    con = console, rand = require("./rand.js");
    var Image = (Canvas = require("canvas")).Image, http = (dom = require("./dom.js"), 
    require("http")), https = require("https");
}

var any_image_url = function() {
    var size, sw, sh, cx, cy, allowed = {
        526: {
            image: "https://funkyvector.com/blog/wp-content/uploads/2016/05/state_of_origin_52_6_22_d5243594_design.png",
            scale: isNode ? 1 : .5
        },
        834199129: {
            scale: .8
        }
    }, bmp = dom.canvas(1, 1), ctx = bmp.ctx;
    return {
        stage: bmp.canvas,
        init: function(options) {
            var ok;
            size = options.size, cx = (sw = size) / 2, cy = (sh = size) / 2, bmp.setSize(sw, sh), 
            (ok = allowed[rand.getSeed()]) && ok.image ? function(url, scale) {
                function drawToContext(img) {
                    var width = img.width, height = img.height;
                    ctx.translate(cx, cy), ctx.scale(scale, scale), ctx.translate(-width / 2, -height / 2), 
                    ctx.drawImage(img, 0, 0), progress("render:complete", bmp.canvas);
                }
                if (isNode) !function(url, fulfill, reject) {
                    var protocol = http;
                    /https:\/\//.test(url) && (protocol = https), protocol.get(url, function(res) {
                        var buffers = [];
                        res.on("data", function(chunk) {
                            chunk.length, buffers.push(chunk);
                        }), res.on("end", function() {
                            var loaded = Buffer.concat(buffers);
                            fulfill(loaded);
                        }), res.on("error", function(e) {
                            con.log("loadImageURL reject", e), reject(e);
                        });
                    });
                }(url, function(buffer) {
                    var data, fulfill, reject, img;
                    data = buffer, fulfill = function(img) {
                        drawToContext(img);
                    }, reject = function(err) {
                        con.log("makeImage fail", err);
                    }, (img = new Image()).src = data, img ? fulfill(img) : (con.log("makeImage reject"), 
                    reject());
                }, function(err) {
                    con.log("loadImageURL fail", err);
                }); else {
                    var img = new Image();
                    img.onload = function() {
                        drawToContext(img);
                    }, img.onerror = function(err) {
                        con.log("img.onerror error", err);
                    }, img.src = url;
                }
            }(ok.image, ok.scale) : con.warn("Cannot find image:", rand.getSeed());
        }
    };
};

isNode ? module.exports = any_image_url() : define("any_image_url", any_image_url), 
define("attractor", function() {
    var xn, yn, sw = window.innerWidth, sh = window.innerHeight, canvas = (colours.getRandomPalette(), 
    dom.canvas(sw, sh)), ctx = canvas.ctx, a = .19, c = 1.3, xn1 = 5, yn1 = 0, scale = 40, iterations = 2e4, mouse = {
        x: 0,
        y: 0
    };
    function f(x) {
        return (x + .1 + x * (a - c) * x) / (1.1 + a * (c * c + a * a) * x * x) * 1.3;
    }
    function onLoop(time) {
        requestAnimationFrame(onLoop), ctx.fillStyle = "white", ctx.fillRect(0, 0, sw, sh), 
        c = mouse.x / 9e3;
        for (var i = yn1 = xn1 = 0; i < iterations; i++) xn1 = -(xn = xn1) - a + c + f(yn = yn1), 
        yn1 = -xn + c * f(xn * yn), ctx.fillStyle = "rgba(0,0,0,0.3)", ctx.fillRect(380 + xn1 * scale, 450 + yn1 * scale, 1, 1);
    }
    return dom.on(window, [ "mousemove", "touchmove" ], function(e) {
        var event = e.changedTouches && e.changedTouches[0] || e;
        event.x = event.x || event.pageX, event.y = event.y || event.pageY, mouse.x = event.x - sw / 2, 
        mouse.y = event.y - sh / 2;
    }), {
        init: function() {
            onLoop();
        },
        stage: canvas.canvas
    };
});

var analyser, AudioContext = window.AudioContext || window.webkitAudioContext, fftSize = 128;

function WebAudioAnalyser(audio, ctx, opts) {
    if (!(this instanceof WebAudioAnalyser)) return new WebAudioAnalyser(audio, ctx, opts);
    if (ctx instanceof AudioContext || (opts = ctx, ctx = null), opts = opts || {}, 
    this.ctx = ctx = ctx || new AudioContext(), audio instanceof AudioNode || (audio = audio instanceof Audio || audio instanceof HTMLAudioElement ? ctx.createMediaElementSource(audio) : ctx.createMediaStreamSource(audio)), 
    this.analyser = ctx.createAnalyser(), this.analyser.fftSize = fftSize, this.stereo = !!opts.stereo, 
    this.audible = !1 !== opts.audible, this.wavedata = null, this.freqdata = null, 
    this.splitter = null, this.merger = null, this.source = audio, this.stereo) {
        this.analyser = [ this.analyser ], this.analyser.push(ctx.createAnalyser()), this.splitter = ctx.createChannelSplitter(2), 
        this.merger = ctx.createChannelMerger(2), this.output = this.merger, this.source.connect(this.splitter);
        for (var i = 0; i < 2; i++) this.splitter.connect(this.analyser[i], i, 0), this.analyser[i].connect(this.merger, 0, i);
        this.audible && this.merger.connect(ctx.destination);
    } else this.output = this.source, this.source.connect(this.analyser), this.audible && this.analyser.connect(ctx.destination);
}

WebAudioAnalyser.prototype.waveform = function(output, channel) {
    return output || (output = this.wavedata || (this.wavedata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount))), 
    (this.stereo ? this.analyser[channel || 0] : this.analyser).getByteTimeDomainData(output), 
    output;
}, WebAudioAnalyser.prototype.frequencies = function(output, channel) {
    return output || (output = this.freqdata || (this.freqdata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount))), 
    (this.stereo ? this.analyser[channel || 0] : this.analyser).getByteFrequencyData(output), 
    output;
}, analyse = WebAudioAnalyser;

var lastBars = new Uint8Array(fftSize / 2), d = document.createElement("div");

function createFreqBar(index) {
    var div = document.createElement("div");
    return div.style.width = "100%", div.style.height = "100px", div.style.position = "absolute", 
    div.style.top = 100 * index + "px", document.body.appendChild(div), div;
}

document.body.appendChild(d);

var lastPeak = [], numBands = 8, bands = [];

for (i = 0; i < numBands; i++) bands[i] = createFreqBar(i), lastPeak[i] = 0;

var audio = new Audio();

function getBand(frequencies, band) {
    for (var total = 0, bandWidth = fftSize / 2 / numBands, endBand = band * bandWidth + bandWidth, i = band * bandWidth; i < endBand; i++) total += frequencies[i];
    return total /= bandWidth;
}

audio.crossOrigin = "Anonymous", audio.src = "exebeche.mp3", audio.loop = !0, audio.addEventListener("canplay", function() {
    console.log("playing!"), analyser = analyse(audio, {
        audible: !0,
        stereo: !1,
        fftSize: 16
    }), binCount = 64, levelBins = Math.floor(binCount / levelsCount), con.log(binCount, levelsCount), 
    audio.play(), audio.currentTime = 150, render(0);
}), audio.addEventListener("error", function(e) {
    switch (e.target.error.code) {
      case e.target.error.MEDIA_ERR_ABORTED:
        alert("You aborted the video playback.");
        break;

      case e.target.error.MEDIA_ERR_NETWORK:
        alert("A network error caused the audio download to fail.");
        break;

      case e.target.error.MEDIA_ERR_DECODE:
        alert("The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.");
        break;

      case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        alert("The video audio not be loaded, either because the server or network failed or because the format is not supported.");
        break;

      default:
        alert("An unknown error occurred.");
    }
});

var freqByteData, timeByteData, levelBins, levelsData = [], levelsCount = 32, levelHistory = [], beatCutOff = 0, beatTime = 0, length = 256;

for (i = 0; i < length; i++) levelHistory.push(0);

function render(time) {
    if (analyser) {
        var frequencies = analyser.frequencies();
        frequencies.length;
        requestAnimationFrame(render);
        for (var i = 0; i < levelsCount; i++) {
            for (var sum = 0, j = 0; j < levelBins; j++) sum += frequencies[i * levelBins + j];
            levelsData[i] = sum / levelBins / 256 * 1;
        }
        for (sum = 0, j = 0; j < levelsCount; j++) sum += levelsData[j];
        level = sum / levelsCount, levelHistory.push(level), levelHistory.shift(1);
        level > beatCutOff && .15 < level ? (document.body.style.background = "#fff", beatCutOff = 1.1 * level, 
        beatTime = 0) : (document.body.style.background = "#444", beatTime <= 50 ? beatTime++ : (beatCutOff *= .98, 
        beatCutOff = Math.max(beatCutOff, .15)));
        var b2 = [];
        levelsData.concat([ 10 * level ]).forEach(function(freq) {
            for (var f = 0, bar = "#"; f++ < 10 * freq; ) bar += "#";
            b2.push(bar);
        }), d.innerHTML = b2.join("<br>");
    }
}

define("ball_and_chain", [ "lib/schteppe/cannon.0.6.2.min.js", "cannon_demo" ], function(cn, CannonDemo) {
    function go() {
        var demo = new CannonDemo();
        demo.create(function() {
            var world = function(demo) {
                var world = demo.getWorld();
                world.gravity.set(0, 0, -40), world.broadphase = new CANNON.NaiveBroadphase(), world.solver.iterations = 10;
                var groundShape = new CANNON.Plane(), groundBody = new CANNON.Body({
                    mass: 0
                });
                return groundBody.addShape(groundShape), groundBody.position.set(0, 0, 1), world.addBody(groundBody), 
                demo.addVisual(groundBody), world.quatNormalizeFast = !1, world.quatNormalizeSkip = 0, 
                world;
            }(demo);
            world.gravity.set(0, 0, -20);
            var last, width = 1, pitch = 1, chainShape0 = new CANNON.Box(new CANNON.Vec3(width, .3, pitch)), chainShape1 = new CANNON.Box(new CANNON.Vec3(.3, width, pitch)), space = .3;
            function join(body0, body1, offset) {
                var cnX = .1 * width, cnY = pitch + space + offset, c1 = new CANNON.PointToPointConstraint(body0, new CANNON.Vec3(-cnX, 0, cnY), body1, new CANNON.Vec3(-cnX, 0, -cnY)), c2 = new CANNON.PointToPointConstraint(body0, new CANNON.Vec3(cnX, 0, cnY), body1, new CANNON.Vec3(cnX, 0, -cnY));
                world.addConstraint(c1), world.addConstraint(c2);
            }
            for (var i = 0; i < 10; i++) {
                var firstChainLink = 1 === i, lastBody = 9 === i, py = (10 - i) * (2 * pitch + 2 * space) + 2 * pitch + space;
                if (0 === i) {
                    var sphereShape = new CANNON.Sphere(4), spherebody = new CANNON.Body({
                        mass: 3
                    });
                    spherebody.addShape(sphereShape), spherebody.position.set(0, 0, py), last = spherebody;
                } else if (lastBody) {
                    var cylinderShape = new CANNON.Cylinder(2, 2, 3, 12), cylinderBody = new CANNON.Body({
                        mass: .5
                    });
                    cylinderBody.addShape(cylinderShape), cylinderBody.position.set(0, 0, py), join(cylinderBody, last, 0), 
                    last = cylinderBody;
                } else {
                    var chainLinkBody = new CANNON.Body({
                        mass: .1
                    });
                    chainLinkBody.addShape(i % 2 ? chainShape0 : chainShape1), chainLinkBody.position.set(0, 0, py), 
                    chainLinkBody.custom = !0, chainLinkBody.customType = "CHAIN_LINK", join(chainLinkBody, last, firstChainLink ? 1.8 : 0), 
                    last = chainLinkBody;
                }
                world.add(last), demo.addVisual(last), last.velocity.set(Math.random() - .5, Math.random() - .5, Math.random() - .5), 
                last.linearDamping = .1, last.angularDamping = .1;
            }
        }), demo.start();
    }
    !function check() {
        con.log("check"), "undefined" == typeof THREE ? setTimeout(check, 10) : go();
    }();
});

con = console;

if (isNode = "undefined" != typeof module) {
    rand = require("./rand.js");
    var geom = require("./geom.js");
    dom = require("./dom.js"), colours = require("./colours.js");
}

var bezier_flow = function() {
    var sw, sh, size, lines, sections, points, lineStyles, exponential, scalePerLine, settings = {
        renderlimit: {
            min: 1,
            max: Number.POSITIVE_INFINITY,
            cur: 1
        }
    }, bmp = dom.canvas(100, 100), ctx = bmp.ctx;
    function getPoint(d) {
        return points[(sections + d) % sections];
    }
    function createPoint(origin) {
        for (var cx = origin.cx || rand.random(), cy = origin.cy || rand.random(), gapScale = .7 * rand.random() / lines, gaps = [], total = 0, i = 0; i < lines; i++) {
            var gap = (.1 + rand.random()) * gapScale;
            gaps[i] = total, total += gap * (exponential ? .1 * Math.pow(2, 1 + .2 * i) : 1);
        }
        points.push({
            index: origin.index,
            cx: cx,
            cy: cy,
            a: null,
            total: total,
            gaps: gaps,
            angle: function() {
                var prev = getPoint(this.index - 1), next = getPoint(this.index + 1), dx = next.cx - prev.cx, dy = next.cy - prev.cy;
                this.a = -Math.atan(dy / dx) - (dx < 0 ? 0 : Math.PI);
            },
            move: function() {
                this.angle();
            },
            lines: function(i) {
                var r = gaps[i] - .2;
                return [ cx - Math.sin(this.a) * r, cy - Math.cos(this.a) * r ];
            }
        });
    }
    function render() {
        ctx.clearRect(0, 0, sw, sh), con.log("render ========================", settings.renderlimit.cur);
        for (var j = 0; j < settings.renderlimit.cur; j++) for (var i = 0, il = points.length; i < il; i++) {
            var p1 = getPoint(i - 1), p2 = getPoint(i);
            p2.move();
            var m1 = -Math.tan(p1.a), m2 = -Math.tan(p2.a), p1l = p1.lines(j), p2l = p2.lines(j), x1 = p1l[0], y1 = p1l[1], x2 = p2l[0], y2 = p2l[1], c1 = y1 - m1 * x1, c2 = y2 - m2 * x2, y1a = -.1 * m1 + c1, y1b = 1.1 * m1 + c1, y2a = -.1 * m2 + c2, y2b = 1.1 * m2 + c2, inter = geom.intersectionAnywhere({
                x: -.1,
                y: y1a
            }, {
                x: 1.1,
                y: y1b
            }, {
                x: -.1,
                y: y2a
            }, {
                x: 1.1,
                y: y2b
            });
            ctx.strokeStyle = lineStyles[j].strokeStyle, ctx.lineWidth = lineStyles[j].lineWidth * (scalePerLine ? .1 * (j + 1) : 1), 
            ctx.beginPath(), ctx.moveTo(x1 * size, y1 * size), ctx.quadraticCurveTo(inter.x * size, inter.y * size, x2 * size, y2 * size), 
            ctx.stroke();
        }
        con.log("render complete called"), progress("render:complete", bmp.canvas);
    }
    return {
        stage: bmp.canvas,
        init: function(options) {
            function baseLineWidth() {
                return 1 + 3 * rand.random();
            }
            con.log("init called", rand.getSeed()), size = options.size, sh = sw = size, bmp.setSize(sw, sh), 
            lines = rand.getInteger(100, 500), settings.renderlimit.max = lines, settings.renderlimit.cur = lines, 
            sections = rand.getInteger(3, 6), con.log("sections", sections), exponential = .5 < rand.random(), 
            scalePerLine = .5 < rand.random(), constantBaseLine = .5 < rand.random(), points = [], 
            lineStyles = [], colours.getRandomPalette();
            for (var fixedConstantBaseLine = baseLineWidth(), l = 0; l < lines; l++) lineStyles[l] = {
                strokeStyle: colours.getRandomColour(),
                lineWidth: constantBaseLine ? fixedConstantBaseLine : baseLineWidth()
            };
            for (var baseAngle = 1e-4 + rand.random() * Math.PI, angleVariance = 1 / sections * .1, p = 0; p < sections; p++) {
                var radius = .3 + .1 * rand.random(), a = baseAngle + (p / sections + rand.getNumber(-angleVariance, angleVariance)) * Math.PI * 2;
                createPoint({
                    index: p,
                    cx: .5 + Math.sin(a) * radius,
                    cy: .5 + Math.cos(a) * radius
                });
            }
            for (p = 0; p < sections; p++) points[p].angle();
            ctx.clearRect(0, 0, size, size), ctx.lineCap = "round", render();
        },
        settings: settings,
        render: render
    };
};

if (isNode ? module.exports = bezier_flow() : define("bezier_flow", bezier_flow), 
define("cannon_demo", function() {
    var Demo = function(options) {
        options = options || {};
        var that = this;
        this.create = function(initfunc) {
            demo = initfunc;
        }, this.start = function() {
            demo();
        };
        var settings = this.settings = {
            stepFrequency: 60,
            quatNormalizeSkip: 2,
            quatNormalizeFast: !0,
            gx: 0,
            gy: 0,
            gz: 0,
            iterations: 3,
            tolerance: 1e-4,
            k: 1e6,
            d: 3,
            scene: 0,
            paused: !1,
            rendermode: "solid",
            constraints: !1,
            contacts: !1,
            cm2contact: !1,
            normals: !1,
            axes: !1,
            particleSize: .1,
            shadows: !1,
            aabbs: !1,
            profiling: !1,
            maxSubSteps: 3
        };
        if (settings.stepFrequency % 60 != 0) throw new Error("stepFrequency must be a multiple of 60.");
        var demo, bodies = this.bodies = [], visuals = this.visuals = [], solidMaterial = (this.particleGeo = new THREE.SphereGeometry(1, 16, 8), 
        new THREE.MeshPhongMaterial({
            color: 3157034,
            emissive: 0,
            specular: 5323312,
            shininess: 80
        }));
        this.wireframeMaterial = new THREE.MeshLambertMaterial({
            color: 16711680,
            wireframe: !0
        }), this.currentMaterial = solidMaterial;
        this.particleMaterial = new THREE.MeshLambertMaterial({
            color: 16711680
        });
        var light, scene, ambient, world = this.world = new CANNON.World();
        world.broadphase = new CANNON.NaiveBroadphase();
        var camera, controls, renderer, container, SHADOW_MAP_WIDTH = 512, SHADOW_MAP_HEIGHT = 512, MARGIN = 0, SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN, NEAR = 5, FAR = 2e3;
        !function() {
            if (container = document.getElementById("experiment-holder"), (camera = new THREE.PerspectiveCamera(24, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR)).position.set(0, -100, 50), 
            (scene = that.scene = new THREE.Scene()).fog = new THREE.Fog(2236962, 1e3, FAR), 
            camera.lookAt(scene.position), ambient = new THREE.AmbientLight(2236962), scene.add(ambient), 
            (light = new THREE.SpotLight(16777215)).position.set(30, -100, 40), light.target.position.set(0, 0, 0), 
            light.castShadow = !0, light.shadow.camera.near = 10, light.shadow.camera.far = 100, 
            light.shadow.mapSize.width = SHADOW_MAP_WIDTH, light.shadow.mapSize.height = SHADOW_MAP_HEIGHT, 
            scene.add(light), scene.add(camera), (renderer = new THREE.WebGLRenderer({
                clearColor: 0,
                clearAlpha: 1,
                antialias: !1
            })).setSize(SCREEN_WIDTH, SCREEN_HEIGHT), renderer.domElement.style.position = "relative", 
            renderer.domElement.style.top = MARGIN + "px", container.appendChild(renderer.domElement), 
            document.addEventListener("mousemove", onDocumentMouseMove), window.addEventListener("resize", onWindowResize), 
            renderer.shadowMap.enabled = !0, renderer.shadowMap.type = THREE.PCFSoftShadowMap, 
            options.trackballControls) {
                (controls = new THREE.TrackballControls(camera, renderer.domElement)).rotateSpeed = 1, 
                controls.zoomSpeed = 1.2, controls.panSpeed = .2, controls.noZoom = !1, controls.noPan = !1, 
                controls.staticMoving = !1, controls.dynamicDampingFactor = .3;
                controls.minDistance = 0, controls.maxDistance = 1e5, controls.screen.width = SCREEN_WIDTH, 
                controls.screen.height = SCREEN_HEIGHT;
            }
        }(), function animate() {
            requestAnimationFrame(animate);
            !function() {
                for (var N = bodies.length, i = 0; i < N; i++) {
                    var b = bodies[i], visual = visuals[i];
                    visual.position.copy(b.position), b.quaternion && visual.quaternion.copy(b.quaternion);
                }
            }();
            !function() {
                var timeStep = 1 / settings.stepFrequency, now = Date.now() / 1e3;
                if (!lastCallTime) return world.step(timeStep), lastCallTime = now;
                var timeSinceLastCall = now - lastCallTime;
                world.step(timeStep, timeSinceLastCall, settings.maxSubSteps), lastCallTime = now;
            }();
            controls && controls.update(), renderer.clear(), renderer.render(that.scene, camera);
        }();
        var lastCallTime = 0;
        function onDocumentMouseMove(event) {}
        function onWindowResize(event) {
            SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight, renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT), 
            camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT, camera.updateProjectionMatrix(), controls && (controls.screen.width = SCREEN_WIDTH, 
            controls.screen.height = SCREEN_HEIGHT), camera.radius = (SCREEN_WIDTH + SCREEN_HEIGHT) / 4;
        }
    };
    (Demo.prototype = {
        constructor: Demo
    }).getWorld = function() {
        return this.world;
    }, Demo.prototype.addVisual = function(body, material) {
        var mesh;
        body instanceof CANNON.Body ? mesh = this.shape2mesh(body, material) : con.log("custom body!!!", body), 
        mesh && (this.bodies.push(body), this.visuals.push(mesh), body.visualref = mesh, 
        body.visualref.visualId = this.bodies.length - 1, this.scene.add(mesh));
    }, Demo.prototype.addVisuals = function(bodies) {
        for (var i = 0; i < bodies.length; i++) this.addVisual(bodies[i]);
    }, Demo.prototype.removeVisual = function(body) {
        if (body.visualref) {
            for (var bodies = this.bodies, visuals = this.visuals, old_b = [], old_v = [], n = bodies.length, i = 0; i < n; i++) old_b.unshift(bodies.pop()), 
            old_v.unshift(visuals.pop());
            for (var id = body.visualref.visualId, j = 0; j < old_b.length; j++) {
                if (j !== id) bodies[i = id < j ? j - 1 : j] = old_b[j], visuals[i] = old_v[j], 
                bodies[i].visualref = old_b[j].visualref, bodies[i].visualref.visualId = i;
            }
            body.visualref.visualId = null, this.scene.remove(body.visualref), body.visualref = null;
        }
    }, Demo.prototype.removeAllVisuals = function() {
        for (;this.bodies.length; ) this.removeVisual(this.bodies[0]);
    };
    var hackyMcHack = 0;
    return Demo.prototype.shape2mesh = function(body, material) {
        material = material || this.currentMaterial;
        this.settings.renderMode;
        var obj = new THREE.Object3D();
        function addMesh(mesh, shapeIndex) {
            if (mesh.receiveShadow = !0, mesh.castShadow = !0, mesh.children) for (var i = 0; i < mesh.children.length; i++) if (mesh.children[i].castShadow = !0, 
            mesh.children[i].receiveShadow = !0, mesh.children[i]) for (var j = 0; j < mesh.children[i].length; j++) mesh.children[i].children[j].castShadow = !0, 
            mesh.children[i].children[j].receiveShadow = !0;
            var o = body.shapeOffsets[shapeIndex], q = body.shapeOrientations[shapeIndex];
            mesh.position.set(o.x, o.y, o.z), mesh.quaternion.set(q.x, q.y, q.z, q.w), obj.add(mesh);
        }
        if (body.custom) {
            var shape = body.shapes[0], mesh = new THREE.Object3D();
            switch (body.customType) {
              case "CHAIN_LINK":
                for (var box_geometry = new THREE.BoxGeometry(2 * shape.halfExtents.x, 2 * shape.halfExtents.y, 2 * shape.halfExtents.z), link = (new THREE.Mesh(box_geometry, this.wireframeMaterial), 
                new THREE.Object3D()), points = [], pitch = shape.halfExtents.z, i = 0; i <= 10; i++) {
                    var a = i / 10 * Math.PI * -2;
                    points.push(new THREE.Vector2(.8 + .3 * Math.sin(a), .3 * Math.cos(a)));
                }
                var geometry = new THREE.LatheBufferGeometry(points, 10, 0, Math.PI), linkEnd0 = new THREE.Mesh(geometry, material);
                linkEnd0.position.set(0, 0, pitch), linkEnd0.rotation.set(0, -Math.PI / 2, 0), link.add(linkEnd0);
                var linkEnd1 = new THREE.Mesh(geometry, material);
                linkEnd1.position.set(0, 0, -pitch), linkEnd1.rotation.set(0, -Math.PI / 2, Math.PI), 
                link.add(linkEnd1);
                geometry = new THREE.CylinderBufferGeometry(.3, .3, 2 * pitch, 10);
                var cylinder0 = new THREE.Mesh(geometry, material);
                cylinder0.rotation.set(Math.PI / 2, 0, 0), cylinder0.position.set(.8, 0, 0), link.add(cylinder0);
                var cylinder1 = new THREE.Mesh(geometry, material);
                cylinder1.rotation.set(Math.PI / 2, 0, 0), cylinder1.position.set(-.8, 0, 0), link.add(cylinder1), 
                linkEnd0.receiveShadow = !0, linkEnd0.castShadow = !0, linkEnd1.receiveShadow = !0, 
                linkEnd1.castShadow = !0, cylinder0.receiveShadow = !0, cylinder0.castShadow = !0, 
                cylinder1.receiveShadow = !0, cylinder1.castShadow = !0, mesh.add(link), link.rotation.z = hackyMcHack++ % 2 * Math.PI / 2;
                break;

              default:
                throw new Error("need to supply customType!");
            }
            return addMesh(mesh, 0), obj;
        }
        for (var l = 0; l < body.shapes.length; l++) {
            switch ((shape = body.shapes[l]).type) {
              case CANNON.Shape.types.SPHERE:
                var sphere_geometry = new THREE.SphereGeometry(shape.radius, 18, 18);
                mesh = new THREE.Mesh(sphere_geometry, material);
                break;

              case CANNON.Shape.types.PARTICLE:
                mesh = new THREE.Mesh(this.particleGeo, this.particleMaterial);
                var s = this.settings;
                mesh.scale.set(s.particleSize, s.particleSize, s.particleSize);
                break;

              case CANNON.Shape.types.PLANE:
                geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
                mesh = new THREE.Object3D();
                var submesh = new THREE.Object3D(), ground = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
                    color: 9474192
                }));
                ground.scale.set(100, 100, 100), submesh.add(ground), ground.castShadow = !0, ground.receiveShadow = !0, 
                mesh.add(submesh);
                break;

              case CANNON.Shape.types.BOX:
                box_geometry = new THREE.BoxGeometry(2 * shape.halfExtents.x, 2 * shape.halfExtents.y, 2 * shape.halfExtents.z);
                mesh = new THREE.Mesh(box_geometry, material);
                break;

              case CANNON.Shape.types.CONVEXPOLYHEDRON:
                var geo = new THREE.Geometry();
                for (i = 0; i < shape.vertices.length; i++) {
                    var v = shape.vertices[i];
                    geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
                }
                for (i = 0; i < shape.faces.length; i++) for (var face = shape.faces[i], j = (a = face[0], 
                1); j < face.length - 1; j++) {
                    var b = face[j], c = face[j + 1];
                    geo.faces.push(new THREE.Face3(a, b, c));
                }
                geo.computeBoundingSphere(), geo.computeFaceNormals(), mesh = new THREE.Mesh(geo, material);
                break;

              case CANNON.Shape.types.HEIGHTFIELD:
                geometry = new THREE.Geometry();
                for (var v0 = new CANNON.Vec3(), v1 = new CANNON.Vec3(), v2 = new CANNON.Vec3(), xi = 0; xi < shape.data.length - 1; xi++) for (var yi = 0; yi < shape.data[xi].length - 1; yi++) for (var k = 0; k < 2; k++) {
                    shape.getConvexTrianglePillar(xi, yi, 0 === k), v0.copy(shape.pillarConvex.vertices[0]), 
                    v1.copy(shape.pillarConvex.vertices[1]), v2.copy(shape.pillarConvex.vertices[2]), 
                    v0.vadd(shape.pillarOffset, v0), v1.vadd(shape.pillarOffset, v1), v2.vadd(shape.pillarOffset, v2), 
                    geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
                    i = geometry.vertices.length - 3;
                    geometry.faces.push(new THREE.Face3(i, i + 1, i + 2));
                }
                geometry.computeBoundingSphere(), geometry.computeFaceNormals(), mesh = new THREE.Mesh(geometry, material);
                break;

              case CANNON.Shape.types.TRIMESH:
                for (geometry = new THREE.Geometry(), v0 = new CANNON.Vec3(), v1 = new CANNON.Vec3(), 
                v2 = new CANNON.Vec3(), i = 0; i < shape.indices.length / 3; i++) {
                    shape.getTriangleVertices(i, v0, v1, v2), geometry.vertices.push(new THREE.Vector3(v0.x, v0.y, v0.z), new THREE.Vector3(v1.x, v1.y, v1.z), new THREE.Vector3(v2.x, v2.y, v2.z));
                    j = geometry.vertices.length - 3;
                    geometry.faces.push(new THREE.Face3(j, j + 1, j + 2));
                }
                geometry.computeBoundingSphere(), geometry.computeFaceNormals(), mesh = new THREE.Mesh(geometry, material);
                break;

              default:
                throw "Visual type not recognized: " + shape.type;
            }
            addMesh(mesh, l);
        }
        return obj;
    }, Demo;
}), isNode = "undefined" != typeof module) con = console, rand = require("./rand.js"), 
dom = require("./dom.js"), colours = require("./colours.js");

var circle_packing = function() {
    var sw, sh, TAU = 2 * Math.PI, cx = .5, cy = .5, bmp = dom.canvas(1, 1);
    var experiment = {
        stage: bmp.canvas,
        init: function(options) {
            console.time("process time");
            var size = options.size;
            sh = sw = size, bmp.setSize(sw, sh), colours.getRandomPalette(), bmp.ctx.clearRect(0, 0, sw, sh);
            var threads = 0, iterations = 0, circles = 0, gap = rand.getNumber(.001, .02);
            con.log("gap", gap);
            var minRadius = rand.getNumber(.001, .01), maxRadius = rand.getNumber(minRadius + .02, .5), maxDepth = rand.getInteger(1, 10), limitMaxRadius = rand.getInteger(0, 2), powerMaxRadius = rand.getNumber(.8, 3), limitMinRadius = rand.getInteger(0, 1);
            con.log("limitMaxRadius", limitMaxRadius), con.log("powerMaxRadius", powerMaxRadius), 
            con.log("limitMinRadius", limitMinRadius);
            var banding = .7 < rand.getNumber(), bandScale = rand.getInteger(4, 20), bandModulo = rand.getInteger(2, 10), alternatePunchOut = .7 < rand.getNumber(), progressTicker = 0, fakeProgress = .1;
            function attemptNextCircle(parent, attempt) {
                if (threads++, attempt++, progressTicker++, threadOutput.ctx.fillRect(progressTicker / 500, 0, 1, threads / 50), 
                circles % 100 == 0 && progress("render:progress", fakeProgress -= .02 * (fakeProgress - 1)), 
                attempt < 5e3) {
                    var delay = iterations % 100 ? 0 : 200;
                    delay ? setTimeout(function() {
                        attemptCircle(parent, attempt);
                    }, delay) : attemptCircle(parent, attempt);
                } else con.log("too many attempt");
            }
            function attemptCircle(parent, attempt, options) {
                var colour, depth, distance, dx, dy, other, r, radius, y, x;
                if (threads--, iterations++, parent) {
                    if (!parent.sites.length) return;
                    depth = parent.depth + 1;
                    var index = Math.floor(rand.random() * parent.sites.length);
                    switch (site = parent.sites.splice(index, 1)[0], x = site.x, y = site.y, dx = parent.x - x, 
                    dy = parent.y - y, distance = Math.sqrt(dx * dx + dy * dy), radius = parent.r - distance - gap, 
                    limitMaxRadius) {
                      case 1:
                        maxRadius = .01 + Math.pow(.5 - distance, powerMaxRadius);
                        break;

                      case 2:
                        maxRadius = .01 + Math.pow(distance, powerMaxRadius);
                    }
                    switch (limitMinRadius) {
                      case 1:
                        minRadius = .1 * maxRadius;
                    }
                    if (r = rand.random() * radius, maxRadius < r ? r = maxRadius : r < minRadius && (r = minRadius), 
                    options && (options.r && (r = options.r), options.x && (x = options.x), options.y && (y = options.y)), 
                    r - gap < minRadius) return attemptNextCircle(parent, attempt);
                    for (var ok = !0, i = 0, il = parent.children.length; i < il && ok; i++) {
                        other = parent.children[i], dx = x - other.x, dy = y - other.y, distance = Math.sqrt(dx * dx + dy * dy);
                        var distanceCombined = r + other.r + gap;
                        distance < distanceCombined && (r = distance - other.r - gap) < minRadius && (ok = !1);
                    }
                    if (!1 === ok) return attemptNextCircle(parent, attempt);
                } else x = cx, y = cy, r = .5, depth = 0;
                if (options && options.colour) colour = options.colour; else for (colour = colours.getRandomColour(); parent && parent.colour == colour; ) colour = colours.getNextColour();
                alternatePunchOut && (bmp.ctx.globalCompositeOperation = (depth + 1) % 2 ? "destination-out" : "source-over"), 
                bmp.ctx.beginPath(), bmp.ctx.fillStyle = colour, bmp.ctx.drawCircle(x * sw, y * sh, r * sw), 
                bmp.ctx.closePath(), bmp.ctx.fill();
                var grid = .01, rings = Math.ceil(r / grid);
                grid = r / rings;
                for (var sites = [], ring = 0; ring < rings; ring++) for (var perimeter = ring * grid * TAU, segments = Math.ceil(perimeter / grid) || 6, segment = 0; segment < segments; segment++) {
                    var siteRadius = (ring + rand.getNumber(0, 1)) * grid, siteAngle = (segment + rand.getNumber(0, 1)) / segments * TAU, siteX = x + Math.sin(siteAngle) * siteRadius, siteY = y + Math.cos(siteAngle) * siteRadius, site = {
                        x: siteX,
                        y: siteY
                    };
                    banding ? parseInt(siteRadius * bandScale) % bandModulo == 0 && sites.push(site) : sites.push(site);
                }
                var circle = {
                    colour: colour,
                    depth: depth,
                    x: x,
                    y: y,
                    r: r,
                    children: [],
                    sites: sites
                };
                if (circles++, parent && parent.children && parent.children.push(circle), depth < maxDepth) for (var i = 0, il = circle.sites.length; i < il; i++) attemptNextCircle(circle, 0);
            }
            !function progressChecker() {
                -1 == threads ? (con.log("progressChecker", threads), progress("render:complete", bmp.canvas), 
                !0) : setTimeout(progressChecker, 250);
            }();
            attemptCircle(null, 0, {
                colour: "transparent"
            });
        },
        settings: {}
    }, threadOutput = dom.canvas(800, 300);
    return experiment;
};

if (isNode ? module.exports = circle_packing() : define("circle_packing", circle_packing), 
isNode = "undefined" != typeof module) con = console, dom = require("./dom.js"), 
geom = require("./geom.js"), rand = require("./rand.js");

var circle_packing_zoom_loop = function() {
    var size, current, TAU = 2 * Math.PI, cx = .5, cy = .5, bmp = dom.canvas(1, 1), zoom = {};
    function updateZoom(time) {
        zoom.amount < zoom.max || (zoom.amount = zoom.max), target = zoom.target, scale = zoom.amount;
        var distance = Math.sqrt(Math.pow(zoom.target.x, 2) + Math.pow(zoom.target.y, 2)) * zoom.max;
        scaler = zoom.amount, zoomProgress = zoom.amount / zoom.max, zoomRemaining = 1 - zoomProgress;
        var xo = (zoom.target.x, zoom.amount);
        bmp.ctx.save(), bmp.ctx.clearRect(0, 0, size, size);
        for (var i = 0, il = current.circles.length; i < il; i++) {
            var _current$circles$i = current.circles[i], x = _current$circles$i.x, y = _current$circles$i.y, r = _current$circles$i.r;
            x = .5 + (x - .5) * scaler, y = .5 + (y - .5) * scaler, r *= Math.pow(scaler, 1), 
            bmp.ctx.fillStyle = i == zoom.targetIndex ? "#f00" : "#000", bmp.ctx.beginPath(), 
            bmp.ctx.drawCircle(x * size, y * size, r * size), bmp.ctx.closePath(), bmp.ctx.fill();
        }
        bmp.ctx.fillStyle = "yellow", bmp.ctx.fillRect(cx * size - 1, 0, 2, size), bmp.ctx.fillRect(0, cy * size - 1, size, 2);
        xo = .5 + (target.x - .5) * scaler;
        var yo = .5 + (target.y - .5) * scaler;
        bmp.ctx.strokeStyle = "green", bmp.ctx.beginPath(), bmp.ctx.moveTo(cx * size, cy * size), 
        bmp.ctx.lineTo(xo * size, yo * size), bmp.ctx.stroke();
        var half = geom.lerp({
            x: cx * size,
            y: cy * size
        }, {
            x: xo * size,
            y: yo * size
        }, zoomProgress);
        bmp.ctx.fillRect(half.x, half.y, 10, 10);
    }
    return window.addEventListener("mousemove", function(e) {
        zoom.amount = 1 + e.x / size * zoom.max, updateZoom();
    }), {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size, bmp.setSize(size, size), current = function() {
                var planet = dom.canvas(size, size), gap = rand.getNumber(1e-4, .02), minRadius = rand.getNumber(.001, .01), maxRadius = rand.getNumber(minRadius + .02, .5), maxDepth = 1;
                function attemptNextCircle(parent, attempt) {
                    ++attempt < 5e3 ? attemptCircle(parent, attempt) : con.log("too many attempt");
                }
                function attemptCircle(parent, attempt, options) {
                    var depth, distance, dx, dy, other, r, radius, y, x;
                    if (parent) {
                        if (!parent.sites.length) return;
                        depth = parent.depth + 1;
                        var index = Math.floor(rand.random() * parent.sites.length);
                        if (site = parent.sites.splice(index, 1)[0], x = site.x, y = site.y, dx = parent.x - x, 
                        dy = parent.y - y, distance = Math.sqrt(dx * dx + dy * dy), radius = parent.r - distance - gap, 
                        r = rand.random() * radius, maxRadius < r ? r = maxRadius : r < minRadius && (r = minRadius), 
                        r - gap < minRadius) return attemptNextCircle(parent, attempt);
                        for (var ok = !0, i = 0, il = parent.children.length; i < il && ok; i++) {
                            other = parent.children[i], dx = x - other.x, dy = y - other.y, distance = Math.sqrt(dx * dx + dy * dy);
                            var distanceCombined = r + other.r + gap;
                            distance < distanceCombined && (r = distance - other.r - gap) < minRadius && (ok = !1);
                        }
                        if (!1 === ok) return attemptNextCircle(parent, attempt);
                    } else x = cx, y = cy, r = .5, depth = 0;
                    var grid = .01, rings = Math.ceil(r / grid);
                    grid = r / rings;
                    for (var sites = [], ring = 0; ring < rings; ring++) for (var perimeter = ring * grid * TAU, segments = Math.ceil(perimeter / grid) || 6, segment = 0; segment < segments; segment++) {
                        var siteRadius = (ring + rand.getNumber(0, 1)) * grid, siteAngle = (segment + rand.getNumber(0, 1)) / segments * TAU, siteX = x + Math.sin(siteAngle) * siteRadius, siteY = y + Math.cos(siteAngle) * siteRadius, site = {
                            x: siteX,
                            y: siteY
                        };
                        sites.push(site);
                    }
                    var circle = {
                        depth: depth,
                        x: x,
                        y: y,
                        r: r,
                        children: [],
                        sites: sites
                    };
                    if (parent && parent.children && parent.children.push(circle), depth < maxDepth) for (var i = 0, il = circle.sites.length; i < il; i++) attemptNextCircle(circle, 0);
                    return circle;
                }
                var container = attemptCircle(null, 0);
                return {
                    canvas: planet.canvas,
                    circles: container.children
                };
            }(), setTimeout(function() {
                var p0 = current;
                con.log("p0", p0);
                var targetIndex = rand.getInteger(0, p0.circles.length), target = p0.circles[targetIndex];
                zoom = {
                    amount: 1,
                    max: .5 / target.r,
                    target: target,
                    targetIndex: targetIndex
                }, con.log("zoom", zoom), updateZoom();
            }, 100);
        }
    };
};

if (isNode ? module.exports = circle_packing_zoom_loop() : define("circle_packing_zoom_loop", circle_packing_zoom_loop), 
isNode = "undefined" != typeof module) con = console, rand = require("./rand.js"), 
dom = require("./dom.js"), colours = require("./colours.js");

var circle_sectors = function() {
    var size, TAU = 2 * Math.PI, QUADRANT = Math.PI / 2, centre = .5, bmp = dom.canvas(1, 1);
    return {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size, bmp.setSize(size, size), colours.getRandomPalette();
            var rings = rand.getInteger(4, 24), ringStart = rand.getInteger(0, rings - 1), sectorsStart = rand.getInteger(2, 16), sectorsPower = rand.getInteger(2, 3), padding = rand.getNumber(0, .01), sectorsMin = rand.getNumber(.02, .2), dotty = .8 < rand.getNumber(0, 1), howDotty = rand.getNumber(.1, .8), colourCycle = function() {
                var mode = rand.getInteger(0, 2);
                con.log("colourCycle - mode:", mode);
                var ringLast = -1, ringRegularCycle = .6 < rand.getNumber(0, 1);
                switch (mode) {
                  case 0:
                    return function(ring, sector) {
                        return colours.getRandomColour();
                    };

                  case 1:
                    return function(ring, sector) {
                        return colours.getNextColour(ring);
                    };

                  case 2:
                    return function(ring, sector) {
                        return ring != ringLast ? (ringLast = ring, colours.getNextColour(ringRegularCycle || rand.getInteger(0, 4))) : colours.getCurrentColour();
                    };
                }
            }();
            bmp.ctx.lineWidth = padding * size;
            for (var i = ringStart; i < rings; i++) if (!(dotty && rand.getNumber(0, 1) > howDotty)) {
                for (var ringRadiusInner = i / rings * centre, ringRadiusOuter = (i + 1) / rings * centre, perimeter = TAU * ringRadiusInner, sectors = sectorsStart; sectorsMin < perimeter / sectors; ) sectors *= sectorsPower;
                for (var j = 0; j < sectors; j++) {
                    var drawSector = function() {
                        bmp.ctx.beginPath(), bmp.ctx.moveTo(x0 * size, y0 * size), bmp.ctx.lineTo(x1 * size, y1 * size), 
                        bmp.ctx.arc(centre * size, centre * size, ringRadiusOuter * size, QUADRANT - angle0, QUADRANT - angle1, !0), 
                        bmp.ctx.lineTo(x3 * size, y3 * size), bmp.ctx.arc(centre * size, centre * size, ringRadiusInner * size, QUADRANT - angle1, QUADRANT - angle0, !1), 
                        bmp.ctx.closePath();
                    };
                    if (!(dotty && rand.getNumber(0, 1) > howDotty)) {
                        var angle0 = j / sectors * TAU, angle1 = (j + 1) / sectors * TAU, x0 = centre + Math.sin(angle0) * ringRadiusInner, y0 = centre + Math.cos(angle0) * ringRadiusInner, x1 = centre + Math.sin(angle0) * ringRadiusOuter, y1 = centre + Math.cos(angle0) * ringRadiusOuter, x3 = (Math.sin(angle1), 
                        Math.cos(angle1), centre + Math.sin(angle1) * ringRadiusInner), y3 = centre + Math.cos(angle1) * ringRadiusInner;
                        bmp.ctx.globalCompositeOperation = "source-over", bmp.ctx.fillStyle = colourCycle(i, j), 
                        drawSector(), bmp.ctx.fill(), bmp.ctx.globalCompositeOperation = "destination-out", 
                        drawSector(), bmp.ctx.stroke();
                    }
                }
            }
        }
    };
};

isNode ? module.exports = circle_sectors() : define("circle_sectors", circle_sectors), 
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

con = console;

if (isNode = "undefined" != typeof module) rand = require("./rand.js");

colours = function() {
    var random;
    rand ? random = rand.random : (random = Math.random, con.warn("!!!! colours is using native random"));
    var paletteIndex = -1, currentPalette = null, colourIndex = 0;
    function getRandomPalette(warning) {
        return warning && con.warn("Ensure you call getRandomPalette!"), paletteIndex = ~~(random() * palettes.length), 
        currentPalette = palettes[paletteIndex];
    }
    function channelToHex(c) {
        var hex = c.toString(16);
        return 1 == hex.length ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + channelToHex(r) + channelToHex(g) + channelToHex(b);
    }
    function hexToRgb(hex) {
        return {
            r: parseInt(hex.substr(1, 2), 16),
            g: parseInt(hex.substr(3, 2), 16),
            b: parseInt(hex.substr(5, 2), 16)
        };
    }
    function mutateChannel(channel, amount, direction) {
        var mutation = Math.round(channel + (random() - .5) * amount);
        return mutation = 255 < mutation ? 255 : mutation <= 0 ? 0 : mutation;
    }
    function showPalette() {
        null == currentPalette && getRandomPalette(!0);
        var p = dom.element("div");
        p.className = "palette", p.id = "palette-" + paletteIndex;
        for (var j = 0; j < currentPalette.length; j++) {
            var colour = currentPalette[j], c = dom.element("div", {
                className: "colour",
                innerHTML: colour,
                style: {
                    background: colour
                }
            });
            p.appendChild(c);
        }
        return p;
    }
    var palettes = [ [ "#333", "#ccc" ], [ "#A0C9D9", "#F2F0D0", "#735438", "#A64941", "#0D0D0D" ], [ "#D93D93", "#629C27", "#DEE300", "#32393D", "#FFFFFF" ], [ "#36190A", "#B2460B", "#FF6818", "#009AA3", "#00ECD2" ], [ "#1B69FF", "#002875", "#0143C2", "#FFB002", "#FF781E" ], [ "#FFBE10", "#FFAE3C", "#FF7E49", "#E85137", "#333C3C" ], [ "#0E1D22", "#587077", "#555555", "#ECEBDF" ], [ "#F2385A", "#F5A503", "#E9F1DF", "#4AD9D9", "#36B1BF" ], [ "#E8463E", "#611410", "#FFCFCD", "#038733", "#63F598" ], [ "#4F8499", "#C95F5F", "#003145", "#012914", "#FCD457" ], [ "#406874", "#84D9D9", "#B8D9D3", "#35402A", "#592C1C" ], [ "#8F8164", "#D9D7AC", "#4F6373", "#293845", "#14212B" ], [ "#1C2623", "#37A672", "#E2CA63", "#F2884B", "#DB3323" ], [ "#FFD7AE", "#163A5C", "#1D2328", "#FE6200", "#ADB7BD" ], [ "#FFB919", "#8C12B2", "#C200FF", "#14CC83", "#09B26F" ], [ "#8C1822", "#BF1725", "#594F46", "#1C8476", "#006B5E" ], [ "#CF9CB3", "#626161", "#DEBC92", "#B68256", "#EDDFBB" ], [ "#A6442E", "#A65644", "#BF7665", "#D9A79C", "#F2F2F2" ], [ "#200101", "#421C0C", "#C9A860", "#4FA35E", "#076043" ], [ "#435939", "#737268", "#D9D4BA", "#D9D5C5", "#0D0000" ], [ "#467302", "#97BF04", "#D97904", "#A62F03", "#590902" ], [ "#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630", "#FA6900" ], [ "#FE4365", "#FC9D9A", "#F9CDAD", "#C8C8A9", "#83AF9B" ], [ "#ECD078", "#D95B43", "#C02942", "#542437", "#53777A" ], [ "#556270", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58" ], [ "#774F38", "#E08E79", "#F1D4AF", "#ECE5CE", "#C5E0DC" ], [ "#E8DDCB", "#CDB380", "#036564", "#033649", "#031634" ], [ "#490A3D", "#BD1550", "#E97F02", "#F8CA00", "#8A9B0F" ], [ "#594F4F", "#547980", "#45ADA8", "#9DE0AD", "#E5FCC2" ], [ "#00A0B0", "#6A4A3C", "#CC333F", "#EB6841", "#EDC951" ], [ "#E94E77", "#D68189", "#C6A49A", "#C6E5D9", "#F4EAD5" ], [ "#D9CEB2", "#948C75", "#D5DED9", "#7A6A53", "#99B2B7" ], [ "#FFFFFF", "#CBE86B", "#F2E9E1", "#1C140D", "#CBE86B" ], [ "#EFFFCD", "#DCE9BE", "#555152", "#2E2633", "#99173C" ], [ "#3FB8AF", "#7FC7AF", "#DAD8A7", "#FF9E9D", "#FF3D7F" ], [ "#343838", "#005F6B", "#008C9E", "#00B4CC", "#00DFFC" ], [ "#413E4A", "#73626E", "#B38184", "#F0B49E", "#F7E4BE" ], [ "#99B898", "#FECEA8", "#FF847C", "#E84A5F", "#2A363B" ], [ "#FF4E50", "#FC913A", "#F9D423", "#EDE574", "#E1F5C4" ], [ "#554236", "#F77825", "#D3CE3D", "#F1EFA5", "#60B99A" ], [ "#351330", "#424254", "#64908A", "#E8CAA4", "#CC2A41" ], [ "#00A8C6", "#40C0CB", "#F9F2E7", "#AEE239", "#8FBE00" ], [ "#FF4242", "#F4FAD2", "#D4EE5E", "#E1EDB9", "#F0F2EB" ], [ "#655643", "#80BCA3", "#F6F7BD", "#E6AC27", "#BF4D28" ], [ "#8C2318", "#5E8C6A", "#88A65E", "#BFB35A", "#F2C45A" ], [ "#FAD089", "#FF9C5B", "#F5634A", "#ED303C", "#3B8183" ], [ "#BCBDAC", "#CFBE27", "#F27435", "#F02475", "#3B2D38" ], [ "#D1E751", "#FFFFFF", "#000000", "#4DBCE9", "#26ADE4" ], [ "#FF9900", "#424242", "#E9E9E9", "#BCBCBC", "#3299BB" ], [ "#5D4157", "#838689", "#A8CABA", "#CAD7B2", "#EBE3AA" ], [ "#5E412F", "#FCEBB6", "#78C0A8", "#F07818", "#F0A830" ], [ "#EEE6AB", "#C5BC8E", "#696758", "#45484B", "#36393B" ], [ "#1B676B", "#519548", "#88C425", "#BEF202", "#EAFDE6" ], [ "#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D" ], [ "#452632", "#91204D", "#E4844A", "#E8BF56", "#E2F7CE" ], [ "#F04155", "#FF823A", "#F2F26F", "#FFF7BD", "#95CFB7" ], [ "#F0D8A8", "#3D1C00", "#86B8B1", "#F2D694", "#FA2A00" ], [ "#2A044A", "#0B2E59", "#0D6759", "#7AB317", "#A0C55F" ], [ "#67917A", "#170409", "#B8AF03", "#CCBF82", "#E33258" ], [ "#B9D7D9", "#668284", "#2A2829", "#493736", "#7B3B3B" ], [ "#BBBB88", "#CCC68D", "#EEDD99", "#EEC290", "#EEAA88" ], [ "#A3A948", "#EDB92E", "#F85931", "#CE1836", "#009989" ], [ "#E8D5B7", "#0E2430", "#FC3A51", "#F5B349", "#E8D5B9" ], [ "#B3CC57", "#ECF081", "#FFBE40", "#EF746F", "#AB3E5B" ], [ "#AB526B", "#BCA297", "#C5CEAE", "#F0E2A4", "#F4EBC3" ], [ "#607848", "#789048", "#C0D860", "#F0F0D8", "#604848" ], [ "#515151", "#FFFFFF", "#00B4FF", "#EEEEEE" ], [ "#3E4147", "#FFFEDF", "#DFBA69", "#5A2E2E", "#2A2C31" ], [ "#300030", "#480048", "#601848", "#C04848", "#F07241" ], [ "#1C2130", "#028F76", "#B3E099", "#FFEAAD", "#D14334" ], [ "#A8E6CE", "#DCEDC2", "#FFD3B5", "#FFAAA6", "#FF8C94" ], [ "#EDEBE6", "#D6E1C7", "#94C7B6", "#403B33", "#D3643B" ], [ "#AAB3AB", "#C4CBB7", "#EBEFC9", "#EEE0B7", "#E8CAAF" ], [ "#FDF1CC", "#C6D6B8", "#987F69", "#E3AD40", "#FCD036" ], [ "#CC0C39", "#E6781E", "#C8CF02", "#F8FCC1", "#1693A7" ], [ "#3A111C", "#574951", "#83988E", "#BCDEA5", "#E6F9BC" ], [ "#FC354C", "#29221F", "#13747D", "#0ABFBC", "#FCF7C5" ], [ "#B9D3B0", "#81BDA4", "#B28774", "#F88F79", "#F6AA93" ], [ "#5E3929", "#CD8C52", "#B7D1A3", "#DEE8BE", "#FCF7D3" ], [ "#230F2B", "#F21D41", "#EBEBBC", "#BCE3C5", "#82B3AE" ], [ "#5C323E", "#A82743", "#E15E32", "#C0D23E", "#E5F04C" ], [ "#4E395D", "#827085", "#8EBE94", "#CCFC8E", "#DC5B3E" ], [ "#DAD6CA", "#1BB0CE", "#4F8699", "#6A5E72", "#563444" ], [ "#5B527F", "#9A8194", "#C6A9A3", "#EBD8B7", "#99BBAD" ], [ "#C2412D", "#D1AA34", "#A7A844", "#A46583", "#5A1E4A" ], [ "#D1313D", "#E5625C", "#F9BF76", "#8EB2C5", "#615375" ], [ "#9D7E79", "#CCAC95", "#9A947C", "#748B83", "#5B756C" ], [ "#1C0113", "#6B0103", "#A30006", "#C21A01", "#F03C02" ], [ "#8DCCAD", "#988864", "#FEA6A2", "#F9D6AC", "#FFE9AF" ], [ "#CFFFDD", "#B4DEC1", "#5C5863", "#A85163", "#FF1F4C" ], [ "#75616B", "#BFCFF7", "#DCE4F7", "#F8F3BF", "#D34017" ], [ "#B6D8C0", "#C8D9BF", "#DADABD", "#ECDBBC", "#FEDCBA" ], [ "#382F32", "#FFEAF2", "#FCD9E5", "#FBC5D8", "#F1396D" ], [ "#E3DFBA", "#C8D6BF", "#93CCC6", "#6CBDB5", "#1A1F1E" ], [ "#A7C5BD", "#E5DDCB", "#EB7B59", "#CF4647", "#524656" ], [ "#413D3D", "#040004", "#C8FF00", "#FA023C", "#4B000F" ], [ "#9DC9AC", "#FFFEC7", "#F56218", "#FF9D2E", "#919167" ], [ "#A8A7A7", "#CC527A", "#E8175D", "#474747", "#363636" ], [ "#EDF6EE", "#D1C089", "#B3204D", "#412E28", "#151101" ], [ "#C1B398", "#605951", "#FBEEC2", "#61A6AB", "#ACCEC0" ], [ "#FFEDBF", "#F7803C", "#F54828", "#2E0D23", "#F8E4C1" ], [ "#7E5686", "#A5AAD9", "#E8F9A2", "#F8A13F", "#BA3C3D" ], [ "#5E9FA3", "#DCD1B4", "#FAB87F", "#F87E7B", "#B05574" ], [ "#951F2B", "#F5F4D7", "#E0DFB1", "#A5A36C", "#535233" ], [ "#FFFBB7", "#A6F6AF", "#66B6AB", "#5B7C8D", "#4F2958" ], [ "#000000", "#9F111B", "#B11623", "#292C37", "#CCCCCC" ], [ "#EFF3CD", "#B2D5BA", "#61ADA0", "#248F8D", "#605063" ], [ "#9CDDC8", "#BFD8AD", "#DDD9AB", "#F7AF63", "#633D2E" ], [ "#FCFEF5", "#E9FFE1", "#CDCFB7", "#D6E6C3", "#FAFBE3" ], [ "#84B295", "#ECCF8D", "#BB8138", "#AC2005", "#2C1507" ], [ "#0CA5B0", "#4E3F30", "#FEFEEB", "#F8F4E4", "#A5B3AA" ], [ "#4D3B3B", "#DE6262", "#FFB88C", "#FFD0B3", "#F5E0D3" ], [ "#B5AC01", "#ECBA09", "#E86E1C", "#D41E45", "#1B1521" ], [ "#4E4D4A", "#353432", "#94BA65", "#2790B0", "#2B4E72" ], [ "#379F7A", "#78AE62", "#BBB749", "#E0FBAC", "#1F1C0D" ], [ "#FFE181", "#EEE9E5", "#FAD3B2", "#FFBA7F", "#FF9C97" ], [ "#A70267", "#F10C49", "#FB6B41", "#F6D86B", "#339194" ], [ "#30261C", "#403831", "#36544F", "#1F5F61", "#0B8185" ], [ "#2D2D29", "#215A6D", "#3CA2A2", "#92C7A3", "#DFECE6" ], [ "#F38A8A", "#55443D", "#A0CAB5", "#CDE9CA", "#F1EDD0" ], [ "#793A57", "#4D3339", "#8C873E", "#D1C5A5", "#A38A5F" ] ];
    return {
        getRandomPalette: getRandomPalette,
        getRandomColour: function() {
            return null == currentPalette && getRandomPalette(!0), colourIndex = ~~(random() * currentPalette.length), 
            currentPalette[colourIndex];
        },
        getCurrentColour: function() {
            return null == currentPalette && getRandomPalette(!0), currentPalette[colourIndex];
        },
        getNextColour: function(offset) {
            return null == currentPalette && getRandomPalette(!0), null != offset ? colourIndex += offset : colourIndex++, 
            colourIndex += currentPalette.length, colourIndex %= currentPalette.length, currentPalette[colourIndex];
        },
        getPalleteIndex: function() {
            return paletteIndex;
        },
        setPalette: function(p) {
            currentPalette = p;
        },
        setRandomPalette: function(_paletteIndex) {
            currentPalette = palettes[paletteIndex = _paletteIndex];
        },
        setColourIndex: function(index) {
            colourIndex = index;
        },
        setPaletteRange: function(range) {
            if (range > currentPalette.length) return con.warn("setPaletteRange - current palette has less than", range, "colours!");
            var palette = rand.shuffle(currentPalette.slice());
            return currentPalette = palette.splice(0, range);
        },
        showPalette: showPalette,
        showColours: function() {
            css = [ ".palette {", "\tclear: both;", "\theight: 50px;", " margin-bottom: 20px", "}", ".colour {", "\twidth: 100px;", "\theight: 50px;", "\tfloat: left;", "\ttext-align: center;", "\tfont-size: 10px;", "\tline-height: 50px;", "}" ].join(""), 
            style = dom.element("style"), style.type = "text/css", style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css)), 
            document.head.appendChild(style), !0;
            var css, style;
            for (var h = document.createElement("div"), i = 0; i < palettes.length; i++) currentPalette = palettes[paletteIndex = i], 
            h.appendChild(showPalette());
            return document.body.appendChild(h), h;
        },
        mutateColour: function(colour, amount) {
            return function(hex, amount) {
                var rgb = hexToRgb(hex), r = rgb.r, g = rgb.g, b = rgb.b;
                return rgbToHex(r = mutateChannel(r, amount), g = mutateChannel(g, amount), b = mutateChannel(b, amount));
            }(colour, amount);
        },
        mixColours: function(colours) {
            for (var mixed = {
                r: 0,
                g: 0,
                b: 0
            }, c = 0, cl = colours.length; c < cl; c++) {
                var rgb = hexToRgb(colours[c]);
                mixed.r += rgb.r, mixed.g += rgb.g, mixed.b += rgb.b;
            }
            return mixed.r /= cl, mixed.g /= cl, mixed.b /= cl, mixed.r = parseInt(mixed.r), 
            mixed.g = parseInt(mixed.g), mixed.b = parseInt(mixed.b), rgbToHex(mixed.r, mixed.g, mixed.b);
        }
    };
}();

"undefined" != typeof module && (module.exports = colours);

var isNode = "undefined" != typeof module;

con = console;

if (isNode) rand = require("./rand.js"), dom = require("./dom.js"), colours = require("./colours.js");

var corona_sine = function() {
    var size, sw, sh, stage, ctx, inner, colourLayers, lengthLayers, colourBG, oscillators, oscs, vector = !1, settings = {
        layers: {
            label: "Layers",
            min: 1,
            max: 30,
            cur: 0,
            type: "Number"
        },
        rays: {
            label: "Rays",
            min: 12,
            max: 312,
            cur: 0,
            type: "Number"
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !0
        }
    };
    if ("undefined" != typeof window && (sw = window.innerWidth, sh = window.innerHeight), 
    vector) stage = dom.svg("svg", {
        width: sw,
        height: sh
    }), inner = dom.svg("g"), stage.appendChild(inner), bmp = ctx = stage; else {
        var bmp = dom.canvas(100, 100);
        stage = bmp.canvas, ctx = bmp.ctx;
    }
    function renderLine(rotation, start, end, width, colour) {
        if (!(end - start < width / 4)) if (vector) {
            var d = [ "M", start, ",", -width, " L", end, -width, " C", end + 1.6 * width, ",", -width, " ", end + 1.6 * width, ",", width, " ", end, ",", width, " L", end, ",", width, " L", start, ",", width, " C", start - 1.6 * width, ",", width, " ", start - 1.6 * width, ",", -width, " ", start, ",", -width ].join(""), path = dom.svg("path", {
                d: d,
                fill: colour,
                transform: "translate(" + [ sw / 2, sh / 2 ] + ") rotate(" + 180 * rotation / Math.PI + ")"
            });
            inner.appendChild(path);
        } else ctx.save(), ctx.translate(sw / 2, sh / 2), ctx.rotate(rotation), ctx.beginPath(), 
        ctx.fillStyle = colour, ctx.moveTo(start, -width), ctx.lineTo(end, -width), ctx.arc(end, 0, width, -Math.PI / 2, Math.PI / 2, !1), 
        ctx.lineTo(end, width), ctx.lineTo(start, width), ctx.arc(start, 0, width, Math.PI / 2, -Math.PI / 2, !1), 
        ctx.fill(), ctx.closePath(), ctx.restore();
    }
    function renderRay(frac, time, innerRadius, maxRadius, lineWidth) {
        for (var layers = settings.layers.cur, rotation = frac * Math.PI * 2, oscLength = function(rotation, time) {
            for (var t = 0, o = 0; o < oscillators; o++) t += (Math.sin(oscs[o].offset + time * oscs[o].speed + rotation * oscs[o].phase) + 1) / 2;
            return t / oscillators;
        }(rotation, time), l = 0; l < layers; l++) {
            renderLine(rotation, innerRadius + oscLength * maxRadius * lengthLayers[l] + 2 * lineWidth, innerRadius + oscLength * maxRadius * lengthLayers[l + 1] - 2 * lineWidth, lineWidth, colourLayers[l]);
        }
    }
    function render(time) {
        time || (time = 0), colours.getRandomPalette(), colourBG = colours.getRandomColour();
        var layers = settings.layers.cur, rays = settings.rays.cur;
        colourLayers = [], lengthLayers = [ 0 ];
        for (var l = 0; l < layers; l++) colourLayers.push(colours.getNextColour()), lengthLayers.push(rand.random());
        lengthLayers.sort(), lengthLayers[layers] = 1, oscillators = ~~(1 + 13 * rand.random()), 
        oscs = [];
        for (var o = 0; o < oscillators; o++) oscs.push({
            offset: rand.random() * Math.PI * 2,
            phase: ~~(6 * rand.random()),
            speed: .003 * rand.random()
        });
        settings.background.cur ? (ctx.fillStyle = colourBG, ctx.fillRect(0, 0, sw, sh)) : ctx.clearRect(0, 0, sw, sh);
        var minDimension = sh < sw ? sh : sw, innerRadius = minDimension / 2 * .2, maxRadius = minDimension / 2 * 1 - innerRadius, lineWidth = innerRadius * Math.tan(1 / rays / 2 * Math.PI * 2), batchSize = 100;
        !function renderBatch(batch) {
            var start = batch * batchSize, end = start + batchSize;
            rays < end && (end = rays);
            for (var i = start; i < end; i++) renderRay(i / rays, time, innerRadius, maxRadius, lineWidth);
            end < rays ? (progress("render:progress", end / rays), setTimeout(function() {
                renderBatch(batch + 1);
            }, 100)) : progress("render:complete", stage);
        }(0);
    }
    return {
        stage: stage,
        render: render,
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, bmp.setSize(sw, sh), 
            new Date().getTime(), settings.layers.cur = ~~(1 + 4 * rand.random()), settings.rays.cur = ~~(12 + 300 * rand.random()), 
            options.settings && (settings = options.settings), progress("settings:initialised", settings), 
            render(0);
        },
        settings: settings,
        update: function(s) {
            rand.random(), rand.random(), settings = s, render();
        }
    };
};

isNode ? module.exports = corona_sine() : define("corona_sine", corona_sine), define("cube_fractal_zoom", function() {
    var camera, scene, renderer, holder, lightA, lightB, lightC, next, prev, cubeSize = 200, gridSize = 1.2 * cubeSize, sw = window.innerWidth, sh = window.innerHeight, destRot = {};
    function getIndex(p, num) {
        return {
            xi: p % num - num / 2 + .5,
            yi: Math.floor(p / num) % num - num / 2 + .5,
            zi: Math.floor(p / num / num) - num / 2 + .5
        };
    }
    function cubes(num) {
        var grid = [], group = new THREE.Group();
        holder.add(group);
        var material, geometry, inner = new THREE.Group();
        group.add(inner);
        for (var p = 0; p < num * num * num; p++) {
            var c = (void 0, material = new THREE.MeshPhongMaterial({
                color: 9470064,
                specular: 16777215,
                shininess: 50
            }), geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), new THREE.Mesh(geometry, material));
            inner.add(c);
            var _getIndex = getIndex(p, num), xi = _getIndex.xi, yi = _getIndex.yi, zi = _getIndex.zi, x = xi * cubeSize, y = yi * cubeSize, z = zi * cubeSize;
            c.position.set(x, y, z), grid.push(c);
        }
        return {
            group: group,
            inner: inner,
            num: num,
            grid: grid
        };
    }
    function zoomIn() {
        next.group.scale.set(.001, .001, .001);
        var scale = prev.num;
        TweenMax.to(prev.group.scale, 2.5, {
            x: scale,
            y: scale,
            z: scale,
            ease: Quad.easeInOut
        });
        var x = .5 * gridSize, y = .5 * gridSize, z = .5 * gridSize;
        TweenMax.to(prev.inner.position, 2, {
            x: x,
            y: y,
            z: z,
            ease: Quad.easeInOut
        }), prev.grid.forEach(function(c, index) {
            var _getIndex2 = getIndex(index, prev.num), xi = _getIndex2.xi, yi = _getIndex2.yi, zi = _getIndex2.zi, x = xi * gridSize, y = yi * gridSize, z = zi * gridSize;
            TweenMax.to(c.position, 1.5, {
                x: x,
                y: y,
                z: z,
                ease: Quad.easeInOut,
                delay: 1
            });
        }), destRot = {
            x: rand.getNumber(-Math.PI, Math.PI),
            y: rand.getNumber(-Math.PI, Math.PI),
            z: rand.getNumber(-Math.PI, Math.PI)
        }, TweenMax.to(prev.group.rotation, 2.5, {
            x: destRot.x,
            y: destRot.y,
            z: destRot.z,
            ease: Quad.easeInOut,
            onComplete: zoomOver
        });
    }
    function zoomOver() {
        next.group.scale.set(1, 1, 1), next.group.rotation.set(destRot.x, destRot.y, destRot.z);
        var g = 4 * gridSize;
        prev.grid.forEach(function(c, index) {
            var _getIndex3 = getIndex(index, prev.num), xi = _getIndex3.xi, yi = _getIndex3.yi, zi = _getIndex3.zi, x = xi * g, y = yi * g, z = zi * g;
            0 != index && (TweenMax.to(c.position, 2.5, {
                x: x,
                y: y,
                z: z,
                ease: Quad.easeIn
            }), TweenMax.to(c.rotation, 2.5, {
                x: rand.getNumber(-2, 2),
                y: rand.getNumber(-2, 2),
                z: rand.getNumber(-2, 2),
                ease: Quint.easeIn
            })), TweenMax.to(c.scale, 2.5, {
                x: 0,
                y: 0,
                z: 0,
                ease: Quint.easeIn
            });
        }), TweenMax.to({}, 2.5, {
            onComplete: zoomAgain
        });
    }
    function zoomAgain() {
        var temp = prev;
        prev = next, (next = temp).group.scale.set(.001, .001, .001), next.inner.position.set(0, 0, 0), 
        next.grid.forEach(function(c, index) {
            var _getIndex4 = getIndex(index, next.num), xi = _getIndex4.xi, yi = _getIndex4.yi, zi = _getIndex4.zi, x = xi * cubeSize, y = yi * cubeSize, z = zi * cubeSize;
            c.position.set(x, y, z), c.rotation.set(0, 0, 0), c.scale.set(1, 1, 1);
        }), setTimeout(zoomIn, 1e3);
    }
    function render(time) {
        function moveLight(light, x, y, z) {
            var t = time + 1e4;
            light.position.set(Math.sin(t * x * 4e-5), Math.sin(t * y * 4e-5), Math.sin(t * z * 4e-5));
        }
        moveLight(lightA, 15, 17, 12), moveLight(lightB, 14, 19, 13), moveLight(lightC, 20, 18, 16), 
        holder.rotation.z += .005, holder.rotation.x += .001, renderer.render(scene, camera), 
        requestAnimationFrame(render);
    }
    return {
        init: function() {
            scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 2e4), 
            scene.add(camera), camera.position.set(0, 0, 1500), camera.lookAt(scene.position), 
            lightA = new THREE.DirectionalLight(16711680, 1), scene.add(lightA), lightB = new THREE.DirectionalLight(12623872, 1), 
            scene.add(lightB), lightC = new THREE.DirectionalLight(16750848, 1), scene.add(lightC), 
            (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
            var lightAmbient = new THREE.AmbientLight(16769248, .2);
            scene.add(lightAmbient), prev = cubes(2), next = cubes(2), document.body.appendChild(renderer.domElement), 
            render(0), setTimeout(zoomIn, 1500);
        }
    };
}), define("cube_pixelator", [], function() {
    var camera, scene, renderer, holder, pixels = 48, cubeSize = 8, gridSize = 10, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight, grid = [], rotations = [], images = [], currentImage = 0;
    function createBitmap(image, resolve) {
        var img = new Image();
        img.onload = function() {
            if (img.width != img.height) throw new Error("squares only mate!");
            var scale = pixels / img.width, ctx = dom.canvas(pixels, pixels).ctx;
            ctx.scale(scale, scale), ctx.drawImage(img, 0, 0);
            for (var grayscale = [], pixelData = ctx.getImageData(0, 0, pixels, pixels).data, p = 0; p < pixelData.length; p += 4) {
                var r = pixelData[p];
                grayscale.push({
                    rotation: r / 255
                });
            }
            images.push(grayscale), progress("render:progress", images.length / 4), setTimeout(resolve, 100);
        }, img.src = "./assets/" + image + ".jpg";
    }
    function createScene() {
        scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 2e4), 
        scene.add(camera);
        var lightAbove = new THREE.DirectionalLight(16777215, 1);
        lightAbove.position.set(0, 1, .5), scene.add(lightAbove);
        var lightLeft = new THREE.DirectionalLight(15787425, .5);
        lightLeft.position.set(-1, .5, .5), scene.add(lightLeft);
        var w, h, colour, geometry, material, lightBelow = new THREE.DirectionalLight(3158064, .2);
        lightBelow.position.set(0, -1, .25), scene.add(lightBelow), (renderer = new THREE.WebGLRenderer({
            antialias: !0
        })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
        for (var p = 0; p < pixels * pixels; p++) {
            var c = (h = w = cubeSize, colour = 16777215, void 0, geometry = new THREE.PlaneGeometry(w, h, 1), 
            material = new THREE.MeshLambertMaterial({
                color: colour
            }), new THREE.Mesh(geometry, material));
            holder.add(c);
            var xi = p % pixels - pixels / 2 + .5, yi = Math.floor(p / pixels) - pixels / 2 + .5, x = xi * gridSize, y = -yi * gridSize;
            c.position.set(x, y, 0), c.rotateSpeed = Math.random() - .5, grid.push(c);
        }
        document.body.appendChild(renderer.domElement), render(0), setInterval(toggleImage, 6e3), 
        progress("render:complete", renderer.domElement);
    }
    var toggleImage = function() {
        currentImage++, currentImage %= images.length, con.log("toggleImage", currentImage);
        for (var newRotations = images[currentImage].slice(), i = 0; i < pixels * pixels; i++) TweenMax.to(rotations[i], 3, {
            rotation: newRotations[i].rotation,
            easing: Back.easeInOut,
            delay: .001 * i
        });
    };
    function render(time) {
        grid.forEach(function(c, index) {
            c.rotation.x = Math.PI / 4 - rotations[index].rotation * Math.PI / 3;
        }), camPos.x = 0 + 50 * Math.sin(12e-5 * time), camPos.y = 0 + 50 * Math.sin(17e-5 * time), 
        camPos.z = 400 + 300 * Math.sin(1e-4 * time), camera.position.set(camPos.x, camPos.y, camPos.z), 
        camera.lookAt(scene.position), renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            for (var p = 0; p < pixels * pixels; p++) rotations.push({
                rotation: Math.random()
            });
            var fn2 = function() {
                return createBitmap("marilyn", fn3);
            }, fn3 = function() {
                return createBitmap("hicks", fn4);
            }, fn4 = function() {
                setTimeout(createScene, 200);
            };
            createBitmap("cash", fn2);
        }
    };
}), define("depends", [ "dom", "colours", "rand", "geom", "exps" ], function(dom, colours, rand, geom, exps) {
    console.log("ok", arguments), exps();
});

con = console;

if (isNode = "undefined" != typeof module) var Canvas = require("canvas");

dom = function() {
    function element(element, props) {
        var el = document.createElement(element);
        return function(el, props) {
            for (var p in props) if ("style" == p) for (var s in props[p]) el[p][s] = props[p][s]; else el[p] = props[p];
        }(el, props), el.setSize = function(w, h) {
            el.style.width = w + "px", el.style.height = h + "px";
        }, el;
    }
    return {
        element: element,
        canvas: function(w, h) {
            var c;
            isNode ? c = new Canvas(w, h) : ((c = element("canvas")).width = w, c.height = h);
            var ctx = c.getContext("2d"), circleRads = 2 * Math.PI;
            return ctx.drawCircle = function(x, y, r) {
                ctx.arc(x, y, r, 0, circleRads, !1);
            }, {
                setSize: function(w, h, preserveCanvas) {
                    preserveCanvas ? c.setSize(w, h) : (c.width = w, c.height = h);
                },
                canvas: c,
                ctx: ctx
            };
        },
        button: function(txt, props) {
            return (props = props || {}).innerHTML && con.warn("Specify butotn text as 1st param"), 
            props.innerHTML = txt, element("button", props);
        },
        svg: function(tag, props) {
            var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
            return function(el, attrs) {
                for (var p in attrs) el.setAttribute(p, attrs[p]);
            }(el, props), el.setSize = function(w, h) {
                el.setAttribute("width", w), el.setAttribute("height", h);
            }, el.clearRect = function() {}, el.fillRect = function() {
                con.warn("svg.fillRect not implemented");
            }, el;
        },
        on: function(target, events, callback) {
            for (var i = 0, il = events.length; i < il; i++) target.addEventListener(events[i], callback);
        },
        off: function(target, events, callback) {
            for (var i = 0, il = events.length; i < il; i++) target.removeEventListener(events[i], callback);
        },
        trigger: function(target, events) {
            for (var i = 0, il = events.length; i < il; i++) target.dispatchEvent(events[i]);
        }
    };
}();

isNode && (module.exports = dom);

var experiment_template = function() {
    Math.PI;
    var sw, cx, cy, stage = dom.canvas(1, 1), ctx = stage.ctx;
    var experiment = {
        stage: stage.canvas,
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
            cx = sw / 2, cy = sh / 2, ctx.clearRect(0, 0, sw, sh), ctx.fillStyle = "#0f0", ctx.fillRect(cx - 20, cy - 20, 40, 40);
        }
    };
    return progress("render:complete", stage.canvas), experiment;
};

(isNode = "undefined" != typeof module) ? module.exports = experiment_template() : define("experiment_template", experiment_template);

var progressBar, experiment_template_babel = function() {
    var stage = dom.canvas(1, 1), canvas = stage.canvas, ctx = stage.ctx, sw = void 0, sh = void 0, size = void 0, init = function(options) {
        size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
        colours.getRandomPalette(), render();
    }, render = function() {
        ctx.fillRect(0, 0, sw, sh);
        for (var points = []; points.length < 4; ) points.push({
            x: rand.getNumber(.1, .9),
            y: rand.getNumber(.1, .9)
        });
        var intersects = geom.intersectionBetweenPoints.apply(null, points);
        intersects && points.push(intersects), points.forEach(function(p) {
            ctx.fillStyle = colours.getNextColour(), ctx.beginPath(), ctx.drawCircle(p.x * sw, p.y * sh, 15), 
            ctx.fill();
        });
    };
    return progress("render:complete", canvas), {
        init: init,
        render: render,
        settings: {},
        stage: canvas,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
};

function progress(eventName, eventParam) {
    switch (con.log("experiments progress", eventName, eventParam), eventName) {
      case "render:progress":
        progressBar.style.width = 100 * eventParam + "%", progressBar.style.height = "10px";
        break;

      case "render:complete":
        progressBar.style.height = "0px";
    }
}

function exps(experimentsDetails) {
    var experiments = experimentsDetails.list;
    return function() {
        var info, interactedShowing = !1;
        progressBar = dom.element("div", {
            id: "progress",
            style: {
                width: 0,
                height: 0
            }
        }), document.body.appendChild(progressBar);
        var holder = dom.element("div", {
            id: "experiment-holder"
        });
        document.body.appendChild(holder);
        var buttonsNav = dom.element("div", {
            className: "exps-buttons"
        });
        document.body.appendChild(buttonsNav);
        var buttonClose = dom.button("X", {
            className: "exps-button"
        });
        buttonsNav.appendChild(buttonClose), dom.on(buttonClose, [ "click", "touchend" ], function(e) {
            window.location = "/";
        });
        var buttonInfo = dom.button("?", {
            className: "exps-button"
        });
        buttonsNav.appendChild(buttonInfo), dom.on(buttonInfo, [ "click", "touchend" ], function() {
            !0, panelInfo.classList.add("displayed"), panelInfoDetails.innerHTML = "<h4>Experimental Graphics</h4><h1>" + info.title + "</h1>" + info.description + "<p><a href='https://github.com/raurir/experimental-graphics/blob/master/js/" + info.key + ".js' target='_blank'>SRC on Github</a></p>";
        });
        var currentExperiment, panelInfo = dom.element("div", {
            className: "exps-info"
        }), panelInfoDetails = dom.element("div", {
            className: "exps-info-details"
        }), panelNav = dom.element("div", {
            className: "exps-buttons interacted"
        }), panelButtonClose = dom.button("X", {
            className: "exps-button"
        });
        function loadExperiment(index) {
            var src = experiments[index];
            require(src, function(experiment) {
                experiment ? (con.log("require loaded...", experiment), function(exp) {
                    (currentExperiment = exp).stage ? holder.appendChild(currentExperiment.stage) : con.warn("experimentLoaded, but no stage:", currentExperiment.stage);
                    dom.on(window, [ "resize" ], resize), currentExperiment.init({
                        size: 800
                    }), resize();
                }(experiment)) : con.warn("require loaded... but experiment is null", experiment, arguments);
            });
        }
        if (dom.on(panelButtonClose, [ "click", "touchend" ], function() {
            panelInfo.classList.remove("displayed"), !1;
        }), document.body.appendChild(panelInfo), panelInfo.appendChild(panelNav), panelNav.appendChild(panelButtonClose), 
        panelInfo.appendChild(panelInfoDetails), window.location.search) {
            var key = window.location.search.split("?")[1], index = 0, found = !1, seed = key.split(",");
            for (seed[1] ? (key = seed[0], seed = seed[1], rand.setSeed(seed)) : rand.setSeed(); index < experiments.length && 0 == found; ) experiments[index][0] == key ? found = !0 : index++;
            loadExperiment(index), (info = experimentsDetails.getDetails(key)) ? info.key = key : buttonsNav.removeChild(buttonInfo), 
            dom.on(document.body, [ "click", "touchstart" ], function(e) {
                interactedShowing || (interactedShowing = !0, buttonsNav.classList.add("interacted"));
            });
        } else !function() {
            for (var e in buttonClose.style.display = "none", buttonInfo.style.display = "none", 
            experiments) {
                var button = dom.element("button", {
                    className: "exp"
                });
                dom.on(button, [ "click" ], function(event) {
                    window.location = "?" + event.target.key;
                });
                var key = experiments[e][0], title = key, expDetails = experimentsDetails.getDetails(key);
                expDetails && expDetails.title && (title = expDetails.title), button.key = key, 
                button.innerHTML = title, document.body.appendChild(button);
            }
        }();
        function resize() {
            var sw = window.innerWidth, sh = window.innerHeight;
            currentExperiment.resize && currentExperiment.resize(sw, sh);
        }
        return {
            load: loadExperiment,
            experiments: experiments
        };
    };
}

(isNode = "undefined" != typeof module) ? module.exports = experiment_template_babel() : define("experiment_template_babel", experiment_template_babel), 
define("exps", [ "exps_details" ], exps), define("exps_details", function() {
    var details = {
        ball_and_chain: {
            title: "Ball and Chain",
            description: "<p>In the celebration of the <a href='http://www.abc.net.au/news/2017-11-15/australia-reacts-to-the-same-sex-marriage-survey-results/9151826' target='_blank'>Yes</a> Vote, started making this ball and chain in THREE + Cannon. Took a bit longer than expected, hopefully I can make a rainbow happy one for legalisation day.</p><p>Something along the lines of \"It's raining ball and chains\"</p>"
        },
        cube_fractal_zoom: {
            title: "Cube Fractal Zoom",
            description: "<p>Zooming into a cube that subdivides into muliple cubes.</p><p>Envisioned version is for each subdivision to be variable slice amounts rather than 2x2x2. Someday.</p><p>Also would like some kind of infinite shader, potentially perlin noise.</p>"
        },
        cube_pixelator: {
            title: "Cube pixelator",
            description: "<p>Should be called 'Plane pixelator' since they are planes, not cubes.</p><p>Planes are distributed through a 2 dimensional grid with each plane representing a pixel.</p><p>Each plane is exactly the same colour and this colour never changes. Instead, each plane rotates accordingly to catch the lighting within the scene and by doing so adapts its apparent shade, and thereby creates an image.</p>"
        },
        frame_inverse: {
            title: "Frame Inverse",
            description: "<p>Drawing rectangles, aye...</p><p>listen to <a href='https://youngerbrothermusic.bandcamp.com/album/the-last-days-of-gravity' target='_blank'>Younger Brother - Last Days of Gravity</a>.</p>"
        },
        fur: {
            title: "Fur",
            description: "<p>2 channels of perlin noise affect x and y lean of each hair of fur.</p>"
        },
        hex_rounded: {
            title: "Hex Rounded",
            description: "<p>Hex Rounded? Some title, but that's what it's been dubbed since inception in 2014 or so. Never worked properly, so fixed it up for Codevember 2017.</p>"
        },
        infinite_scrolling_cogs: {
            title: "Infinite Scrolling Cogs",
            description: "<p>Remake of <a href='https://codepen.io/raurir/pen/eknLg' target='_blank'>an old experiment</a> this time it's scrolling, non ineractive and more of a toon rendering style.</p><p>The thing I liked the best about the original, and this algorithm, is the cogs are very close to mathematically correct; not only do they animate in a life like fashion on screen, I am confident a 3D print of the geometry involved would result in a smoothly running friction free machine.</p><p>This algorithm continually creates canvases with no garbage collection. It will crash the browser eventually, I imagine, but you'd be bored after a minute anyway?</p>"
        },
        infinite_stairs: {
            title: "Infinite Stairs",
            description: "<p>Work in progress</p><p>Trying to make an infinite staircase, potentially spooky.</p>"
        },
        isometric_words: {
            title: "Isometric Words",
            description: "<p>Muddling up cubes by using the simplicity of Isometric projection.</p><p>Randomly offset the objects along the same axis the camera is looking down.</p>"
        },
        lego_stack: {
            title: "Lego Stack",
            description: "<p>Important scientifically realistic simulation to study how high lego can be stacked.</p>"
        },
        recursive_circle: {
            title: "Recursive Circle",
            description: "<p>Recursive rendering. Managed to not crash my browser creating this! Life achievement.</p>"
        },
        seven_four_sevens: {
            title: "Seven Four Sevens",
            description: "<p>An old flash experiment remade in javascript.</p><p>Thanks to the demise of flash I will lose heaps of graphical experiments, some irretrievably lost due to inability to open .FLAs - luckily this one had the source in a .as file.</p>"
        },
        synth_ambient: {
            title: "Synth Ambient",
            description: "<h2>This will be loud!</h2><p>A quick trip into audio synthesis in the browser.</p><p>That's the thing about synthesis, you can create out of control waveforms quite easily, hence the volume.</p><p>Using <a href='https://github.com/Tonejs/Tone.js' target='_blank'>Tone.js</a> for all the audio generation, this experiment creates a number of randomised effects, a bunch of randomised synthesizers, and with those creates a randomised drum track, randomised chords and a ranomised arpeggio.</p>"
        },
        triangles: {
            title: "Triangles",
            description: "<p>A plane of triangles fall away as they zoom towards the screen.</p><p>Probably a bit heavy for phones.</p>"
        }
    };
    return {
        list: [ [ "additive" ], [ "aegean_sun" ], [ "alien" ], [ "anemone_three", "THREE" ], [ "any_image_url" ], [ "attractor" ], [ "ball_and_chain", "THREE" ], [ "bezier_flow" ], [ "box", "maze" ], [ "circle_packing" ], [ "circle_packing_zoom_loop" ], [ "circle_sectors" ], [ "codevember", "THREE", "TweenMax" ], [ "corona_sine" ], [ "creature" ], [ "cube_fractal_zoom", "THREE", "TweenMax" ], [ "cube_pixelator", "THREE", "TweenMax" ], [ "experiment_template_babel" ], [ "fool", "css/fool" ], [ "fur" ], [ "frame_inverse" ], [ "hexagon_tile" ], [ "hex_rounded", "THREE" ], [ "infinite_scrolling_cogs" ], [ "infinite_stairs", "THREE" ], [ "isometric_cubes" ], [ "isometric_words", "THREE", "TweenMax" ], [ "lego_stack", "THREE" ], [ "linked_line" ], [ "mandala" ], [ "maze" ], [ "maze_cube", "linked_line", "THREE" ], [ "meandering_polygons" ], [ "mining_branches" ], [ "molecular_three", "THREE" ], [ "nested_rotating_polygon", "ease" ], [ "oscillate_curtain" ], [ "oscillator" ], [ "overflow" ], [ "pattern_check", "css/pattern_check" ], [ "pattern_circles" ], [ "perlin_grid", "THREE", "TweenMax" ], [ "perlin_leaves" ], [ "perlin_noise" ], [ "polyhedra", "3d" ], [ "polyhedra_three", "THREE", "../lib/stemkoski/polyhedra" ], [ "pine_three", "THREE" ], [ "race_lines_three", "THREE", "TweenMax" ], [ "rainbow_particles" ], [ "rectangular_fill" ], [ "recursive" ], [ "recursive_circle" ], [ "recursive_polygon" ], [ "seven_four_sevens" ], [ "spiral_even" ], [ "squaretracer" ], [ "synth_ambient", "Tone" ], [ "tea" ], [ "tentacle" ], [ "tetris_cube", "THREE", "TweenMax" ], [ "text_grid" ], [ "triangles", "THREE", "TweenMax" ], [ "tunnel_tour_three", "THREE", "TweenMax" ], [ "typography" ], [ "voronoi_stripes", "voronoi" ], [ "zoned_particles" ] ],
        getDetails: function(exp) {
            return details[exp] || !1;
        },
        getFeature: function(key) {
            return {
                codevember: [ {
                    day: 1,
                    title: details.cube_pixelator.title,
                    link: "cube_pixelator"
                }, {
                    day: 2,
                    title: details.synth_ambient.title,
                    link: "synth_ambient"
                }, {
                    day: 3,
                    title: "Refactored Experiments"
                }, {
                    day: 4,
                    title: "Made Codevember"
                }, {
                    day: 5,
                    title: "fail :("
                }, {
                    day: 6,
                    title: details.isometric_words.title,
                    link: "isometric_words"
                }, {
                    day: 7,
                    title: "fail ..."
                }, {
                    day: 8,
                    title: details.cube_fractal_zoom.title,
                    link: "cube_fractal_zoom"
                }, {
                    day: 9,
                    title: details.infinite_scrolling_cogs.title,
                    link: "infinite_scrolling_cogs"
                }, {
                    day: 10,
                    title: "nope :|"
                }, {
                    day: 11,
                    title: details.infinite_stairs.title,
                    link: "infinite_stairs"
                }, {
                    day: 12,
                    title: "much fail."
                }, {
                    day: 13,
                    title: details.seven_four_sevens.title,
                    link: "seven_four_sevens"
                }, {
                    day: 14,
                    title: details.triangles.title,
                    link: "triangles"
                }, {
                    day: 15,
                    title: "very..."
                }, {
                    day: 16,
                    title: "...lame!"
                }, {
                    day: 17,
                    title: details.ball_and_chain.title,
                    link: "ball_and_chain"
                }, {
                    day: 18,
                    title: details.fur.title,
                    link: "fur"
                }, {
                    day: 19,
                    title: details.recursive_circle.title,
                    link: "recursive_circle"
                }, {
                    day: 20,
                    title: details.lego_stack.title,
                    link: "lego_stack"
                }, {
                    day: 21,
                    title: details.hex_rounded.title,
                    link: "hex_rounded"
                }, {
                    day: 22,
                    title: "faily McFail O'clock"
                }, {
                    day: 23,
                    title: details.frame_inverse.title,
                    link: "frame_inverse"
                } ]
            }[key] || !1;
        }
    };
});

sw = window.innerWidth, sh = window.innerHeight;

var navOpen = !0;

function navClass() {
    return "nav" + (navOpen ? " open" : "");
}

var container = dom.element("div", {
    className: "container",
    style: {
        width: sw + "px",
        height: sh + "px"
    }
}), nav = dom.element("div", {
    className: navClass()
}), navMenu = dom.element("div", {
    className: "menu"
}), navTab = dom.element("div", {
    className: "tab"
}), navIcon = dom.element("ul", {
    className: "icon",
    innerHTML: [ "first", "second", "third" ].map(function(a, i) {
        return "<li class='" + a + "'></li>";
    }).join("")
}), space = dom.element("div", {
    innerHTML: "Hello World!",
    className: "space"
});

container.appendChild(nav), nav.appendChild(navMenu), nav.appendChild(navTab), navTab.appendChild(navIcon), 
container.appendChild(space), document.body.appendChild(container), navTab.addEventListener("click", function() {
    navOpen = !navOpen, nav.className = navClass();
});

var options = [ {
    label: "Hello",
    items: [ {
        label: "A"
    }, {
        label: "B"
    } ]
}, {
    label: "World"
}, {
    label: "There",
    items: [ {
        label: "May or"
    }, {
        label: "May not"
    }, {
        label: "Exist"
    }, {
        label: "A"
    }, {
        label: "Situation"
    } ]
}, {
    label: "Is",
    items: [ {
        label: "A Computer"
    }, {
        label: "Behind you"
    } ]
} ], itemHeight = 20;

function navY(items) {
    return (items + options.length) / 2 * -itemHeight + "px";
}

function createOption(option) {
    var main = dom.element("div", {
        className: "main"
    }), button = dom.element("div", {
        className: "option",
        innerHTML: option.label
    });
    if (navMenu.appendChild(main), main.appendChild(button), option.items) {
        var suboptions = dom.element("div", {
            className: "sub-options"
        });
        main.appendChild(suboptions);
        for (var j = 0; j < option.items.length; j++) {
            var suboption = option.items[j], sub = dom.element("div", {
                className: "sub-option",
                innerHTML: suboption.label
            });
            suboptions.appendChild(sub);
        }
        button.addEventListener("click", function(e) {
            if (lastSub) {
                if (lastSub == suboptions) return;
                lastSub.style.height = 0;
            }
            setTimeout(function() {
                suboptions.style.height = option.items.length * itemHeight + "px";
            }, 400), lastSub = suboptions, navMenu.style.marginTop = navY(option.items.length);
        });
    } else button.addEventListener("click", function(e) {
        navMenu.style.marginTop = navY(0), lastSub && (lastSub.style.height = 0, lastSub = null);
    });
}

var lastSub = null;

for (i = 0; i < options.length; i++) createOption(options[i]);

navMenu.style.marginTop = navY(0), window.addEventListener("resize", function() {
    sw = window.innerWidth, sh = window.innerHeight, container.setSize(sw, sh);
}), define("frame_inverse", function() {
    var sw = window.innerWidth, sh = window.innerHeight, maxSize = rand.getInteger(100, 300), minSize = rand.getInteger(4, 10), maxBoxes = Math.floor(sw * sh / 200), cols = colours.getRandomPalette(), canvas = dom.canvas(sw, sh), ctx = canvas.ctx, pixels = [], boxes = 0, renders = 0, f = rand.getNumber(0, 1), force = null, VERTICAL = 1, HORIZONTAL = 2, SQUARE = 3;
    .9 < f ? force = VERTICAL : .8 < f ? force = HORIZONTAL : .7 < f && (force = SQUARE);
    for (var i = 0; i < sw; ) {
        pixels[i] = [];
        for (var j = 0; j < sh; ) pixels[i][j] = 0, j++;
        i++;
    }
    function getPixel(x, y) {
        return pixels[x][y];
    }
    function go() {
        if (boxes < maxBoxes) if (renders % 20) {
            requestAnimationFrame(go);
            for (var t = 0; t < 2e3; t++) hitit();
        } else progress("render:progress", boxes / maxBoxes), setTimeout(go, 200); else progress("render:complete", canvas.canvas);
        renders++;
    }
    function hitit() {
        var i = rand.getInteger(0, sw - 1), j = rand.getInteger(0, sh - 1), targColor = getPixel(i, j), dimLarge = rand.getNumber(minSize, maxSize), dimSmall = rand.getNumber(1, minSize), sizeX = dimLarge, sizeY = dimSmall;
        switch (force) {
          case HORIZONTAL:
            break;

          case VERTICAL:
            sizeX = dimSmall, sizeY = dimLarge;
            break;

          case SQUARE:
            sizeY = sizeX = dimLarge;
            break;

          default:
            .5 < rand.getNumber(0, 1) && (sizeX = dimSmall, sizeY = dimLarge);
        }
        if (!(sw < i + sizeX || sh < j + sizeY)) {
            for (var k = i; k < i + sizeX; ) {
                for (var l = j; l < j + sizeY; ) {
                    if (getPixel(k, l) != targColor) return !1;
                    l++;
                }
                k++;
            }
            if (sizeY -= 2, 1 <= (sizeX -= 2) && 1 <= sizeY) (function(x, y, w, h, colour) {
                ctx.fillStyle = colour, ctx.fillRect(x, y, w, h);
                for (var iw = x + w, jh = y + h, i = x; i < iw; ) {
                    for (var j = y; j < jh; ) pixels[i][j] = colour, j++;
                    i++;
                }
                boxes++;
            })(i + 1, j + 1, sizeX, sizeY, cols[parseInt(5 * Math.random())]);
        }
    }
    return {
        init: function() {
            var bg = colours.getRandomColour();
            cols.splice(cols.indexOf(bg), 1), ctx.fillStyle = bg, ctx.fillRect(0, 0, sw, sh), 
            go();
        },
        stage: canvas.canvas
    };
}), define("fur", [ "perlin" ], function(perlin) {
    for (var pixel = 4, furSize = 20, w = 160, h = 160, sw = w * pixel, sh = h * pixel, c = dom.canvas(sw, sh), d = c.ctx, channelX = perlin.noise(w, h), channelY = perlin.noise(w, h), distort = [], i = 0, il = w * h; i < il; i++) {
        var r = rand.getInteger(125, 145), g = rand.getInteger(105, 125), b = rand.getInteger(75, 95);
        distort.push({
            x: 4 * rand.getNumber(-1, 1),
            y: 4 * rand.getNumber(-1, 1),
            colour: "rgba(" + r + "," + g + "," + b + ",0.5)"
        });
    }
    function drawIt(time) {
        requestAnimationFrame(drawIt);
        var t = .002 * time, leanX = channelX.cycle(t, .004), leanY = channelY.cycle(t, .004);
        d.fillStyle = "black", d.fillRect(0, 0, sw, sh);
        for (var i = 0, il = w * h; i < il; i++) {
            var xi = i % w, yi = Math.floor(i / w), lx = leanX[i] - .5, ly = leanY[i] - .5, x = (distort[i].x + xi + .5) * pixel, y = (distort[i].y + yi + .5) * pixel;
            d.strokeStyle = distort[i].colour, d.beginPath(), d.moveTo(x, y), d.lineTo(x + 15 + lx * furSize, y + 5 + ly * furSize), 
            d.stroke();
        }
    }
    return {
        resize: function(w, h) {
            c.setSize(w, h, !0);
        },
        init: function() {
            drawIt(0);
        },
        stage: c.canvas
    };
});

con = con || console, geom = function() {
    function linearEquationFromPoints(p0, p1) {
        var dx = p1.x - p0.x, dy = p1.y - p0.y;
        if (0 == dx || -1e-6 < dx && dx < 1e-6) return con.warn("divide by zero error in geom.linearEquationFromPoints"), 
        {
            c: null,
            m: 0 < dy ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY,
            x: p0.x
        };
        var m = dy / dx;
        return {
            c: p0.y - m * p0.x,
            m: m
        };
    }
    function intersectionAnywhere(p0, p1, p2, p3) {
        var intersectionX, intersectionY, line0 = linearEquationFromPoints(p0, p1), line1 = linearEquationFromPoints(p2, p3), isLine1Vertical = null === line0.c, isLine2Vertical = null === line1.c;
        if (isLine1Vertical && isLine2Vertical) return null;
        if (isLine1Vertical) intersectionX = line0.x, intersectionY = line1.m * intersectionX + line1.c; else if (isLine2Vertical) intersectionX = line1.x, 
        intersectionY = line0.m * intersectionX + line0.c; else {
            if (line0.m - line1.m == 0) return null;
            intersectionX = (line1.c - line0.c) / (line0.m - line1.m), intersectionY = line0.m * intersectionX + line0.c;
        }
        return 0 == intersectionY && (con.log("intersectionY IS 0!", isLine1Vertical, isLine2Vertical, line0, line1), 
        con.log("intersectionY p0 p1", p0, p1), con.log("intersectionY p2 p3", p2, p3)), 
        {
            x: intersectionX,
            y: intersectionY
        };
    }
    function pointInPolygon(polygon, point) {
        var nvert = polygon.length;
        if (nvert && 3 <= nvert && void 0 !== point.x && void 0 !== point.y) {
            var i, j, testx = point.x, testy = point.y, c = !1;
            for (i = 0, j = nvert - 1; i < nvert; j = i++) {
                var vxi = polygon[i].x, vyi = polygon[i].y, vxj = polygon[j].x, vyj = polygon[j].y;
                testy < vyi != testy < vyj && testx < (vxj - vxi) * (testy - vyi) / (vyj - vyi) + vxi && (c = !c);
            }
            return c;
        }
        return nvert < 3 ? con.warn("pointInPolygon error - polygon has less than 3 points", polygon) : con.warn("pointInPolygon error - invalid data vertices:", nvert, "polygon:", polygon, "point:", point), 
        null;
    }
    function perpendincularPoint(a, b, distance) {
        var p = {
            x: a.x - b.x,
            y: a.y - b.y
        }, n = {
            x: -p.y,
            y: p.x
        }, normalisedLength = Math.sqrt(n.x * n.x + n.y * n.y);
        return n.x /= normalisedLength, n.y /= normalisedLength, {
            x: distance * n.x,
            y: distance * n.y
        };
    }
    function parallelPoints(p0, p1, offset) {
        var per = perpendincularPoint(p0, p1, offset);
        return [ {
            x: p0.x + per.x,
            y: p0.y + per.y
        }, {
            x: p1.x + per.x,
            y: p1.y + per.y
        } ];
    }
    return {
        insetPoints: function(points, offset) {
            for (var parallels = [], insets = [], i = 0, il = points.length; i < il; i++) {
                var pp0 = points[i], pp1 = points[(i + 1) % il];
                parallels.push(parallelPoints(pp0, pp1, offset));
            }
            for (con.log("parallels.length", parallels.length), i = 0, il = parallels.length; i < il; i++) {
                var parallel0 = parallels[i], parallel1 = parallels[(i + 1) % il], intersection = intersectionAnywhere(parallel0[0], parallel0[1], parallel1[0], parallel1[1]);
                if (con.log("intersection", intersection), !pointInPolygon(points, intersection)) return con.warn("geom.insetPoints fail, not inside"), 
                null;
                insets.push(intersection);
            }
            return insets;
        },
        intersectionAnywhere: intersectionAnywhere,
        intersectionBetweenPoints: function(p0, p1, p2, p3) {
            var s1_x, s1_y, s2_x, s2_y, s, t, p0_x = p0.x, p0_y = p0.y, p1_x = p1.x, p1_y = p1.y, p2_x = p2.x, p2_y = p2.y, p3_x = p3.x, p3_y = p3.y;
            return p0_x == p2_x && p0_y == p2_y ? null : p0_x == p3_x && p0_y == p3_y ? null : p1_x == p2_x && p1_y == p2_y ? null : p1_x == p3_x && p1_y == p3_y ? null : (t = ((s2_x = p3_x - p2_x) * (p0_y - p2_y) - (s2_y = p3_y - p2_y) * (p0_x - p2_x)) / (-s2_x * (s1_y = p1_y - p0_y) + (s1_x = p1_x - p0_x) * s2_y), 
            0 <= (s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y)) && s <= 1 && 0 <= t && t <= 1 ? {
                x: p0_x + t * s1_x,
                y: p0_y + t * s1_y
            } : null);
        },
        lerp: function(a, b, ratio) {
            return {
                x: a.x + (b.x - a.x) * ratio,
                y: a.y + (b.y - a.y) * ratio
            };
        },
        linearEquationFromPoints: linearEquationFromPoints,
        parallelPoints: parallelPoints,
        perpendincularPoint: perpendincularPoint,
        pointInPolygon: pointInPolygon
    };
}();

"undefined" != typeof module && (module.exports = geom), define("hex_rounded", function() {
    var camera, renderer, stageWidth = 500, stageHeight = 500;
    return {
        init: function() {
            var interaction = !1, mouse = {
                x: 0,
                y: 0
            }, scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0, 100, 5e3);
            var cameraTarget = {
                x: 0,
                y: 0,
                z: 0
            };
            (camera = new THREE.PerspectiveCamera(100, stageWidth / stageHeight, 1, 2e4)).position.x = 0, 
            camera.position.z = -5e3;
            var lightWhite = new THREE.PointLight(16777215, 1, 1e4);
            scene.add(lightWhite), lightWhite.position.set(0, 0, -5e3);
            var group = new THREE.Object3D();
            scene.add(group), (renderer = new THREE.WebGLRenderer()).setSize(stageWidth, stageHeight), 
            document.body.appendChild(renderer.domElement);
            var hexs = [], hexsTargetable = [], fireflies = [], radius = 600, numHexs = 121, xGap = 2 * radius * -Math.cos(30 * Math.PI / 180), yGap = 3 * radius * Math.sin(30 * Math.PI / 180), xOffset = 5.5 * -xGap, yOffset = 5.5 * -yGap, numFireflies = 10;
            function ran(max) {
                return (Math.random() - .5) * max;
            }
            function addHex(x, y, z, isEdge) {
                var bevelThickness = .1 * radius, innerRadius = .8 * (radius - bevelThickness), shape = new THREE.Shape();
                function polygon(i, edges) {
                    var angle = i / edges * Math.PI * 2, nextAngle = (i + 1) / edges * Math.PI * 2, nextNextAngle = (i + 2) / edges * Math.PI * 2, xp = Math.sin(angle) * innerRadius, yp = Math.cos(angle) * innerRadius, nxp = Math.sin(nextAngle) * innerRadius, nyp = Math.cos(nextAngle) * innerRadius, startStraightX = xp + .2 * (nxp - xp), startStraightY = yp + .2 * (nyp - yp), endStraightX = nxp - .2 * (nxp - xp), endStraightY = nyp - .2 * (nyp - yp), endCurveX = nxp + .2 * (Math.sin(nextNextAngle) * innerRadius - nxp), endCurveY = nyp + .2 * (Math.cos(nextNextAngle) * innerRadius - nyp);
                    0 == i && shape.moveTo(startStraightX, startStraightY), shape.lineTo(endStraightX, endStraightY), 
                    shape.quadraticCurveTo(nxp, nyp, endCurveX, endCurveY);
                }
                for (var i = 0; i < 6; i++) polygon(i, 6);
                var height = 100 + Math.random() * radius, colour = .9 * radius < height ? 9453568 : 5263440, extrudeSettings = {
                    amount: height,
                    bevelEnabled: !0,
                    bevelSegments: 1,
                    steps: 1,
                    bevelThickness: bevelThickness
                }, g = shape.extrude(extrudeSettings), m = new THREE.MeshPhongMaterial({
                    color: colour
                }), hex = new THREE.Mesh(g, m);
                return group.add(hex), hex.move = function() {
                    this.undecided += ran(.5), this.kindadecided -= .1 * (this.kindadecided - this.undecided), 
                    this.dir -= .1 * (this.dir - this.kindadecided), this.position.z += this.dir;
                }, hex.reset = function() {
                    hex.undecided = ran(.5), hex.kindadecided = ran(.5), hex.dir = hex.kindadecided, 
                    hex.position.set(x, y, z - height);
                }, hex.reset(), hex;
            }
            for (var i = 0; i < numHexs; i++) {
                var row = Math.floor(i / 11), col = i % 11 + (row % 2 == 0 ? .5 : 0), isEdge = col < 2 || 8.5 < col || row < 2 || 8.5 < row, hex = addHex(xOffset + col * xGap, yOffset + row * yGap, 0);
                hexs.push(hex), isEdge || hexsTargetable.push(hex);
            }
            function addFirefly() {
                var fly = new THREE.Object3D();
                group.add(fly);
                var below = .7 < Math.random();
                function light() {
                    return 160 + ran(96);
                }
                var colour = light() << 16 | light() << 8 | light(), light = (new THREE.BoxGeometry(200, 200, 200), 
                new THREE.MeshPhongMaterial({
                    color: colour,
                    shininess: 1,
                    shading: THREE.SmoothShading
                }), new THREE.PointLight(colour, 5, 2e3));
                return fly.add(light), fly.position.set(ran(1e3), ran(1e3), below ? 200 : -2e3 + ran(1e3)), 
                fly.v = 20 + ran(10), fly.vx = ran(10), fly.vy = ran(10), fly.vz = ran(10), fly.undecided = ran(Math.PI), 
                fly.kindadecided = ran(Math.PI), fly.dir = fly.kindadecided, fly.move = function() {
                    this.undecided += ran(.5), this.kindadecided -= .1 * (this.kindadecided - this.undecided), 
                    this.dir -= .1 * (this.dir - this.kindadecided), this.ax = Math.sin(this.dir) * this.v, 
                    this.ay = Math.cos(this.dir) * this.v, this.position.x += this.ax, this.position.y += this.ay, 
                    this.position.x < -4e3 && (this.position.x = 4e3), 4e3 < this.position.x && (this.position.x = -4e3), 
                    this.position.y < -4e3 && (this.position.y = 4e3), 4e3 < this.position.y && (this.position.y = -4e3);
                }, fly;
            }
            for (i = 0; i < numFireflies; i++) fireflies[i] = addFirefly();
            function pickOne() {
                return hexsTargetable[~~(Math.random() * hexsTargetable.length)];
            }
            var target = pickOne(), loop = 0;
            dom.on(window, [ "mousemove", "touchmove" ], function(e) {
                if (interaction) {
                    var event = e.changedTouches && e.changedTouches[0] || e;
                    event.x = event.x || event.pageX, event.y = event.y || event.pageY, mouse.x = event.x - stageWidth / 2, 
                    mouse.y = event.y - stageHeight / 2;
                }
            }), dom.on(window, [ "mousedown", "touchstart" ], function(e) {
                interaction = !0;
            }), dom.on(window, [ "mouseup", "touchend" ], function(e) {
                interaction = !1;
            }), function render(t) {
                if (requestAnimationFrame(render), loop < Math.floor(t / 4e3)) {
                    loop++, target = pickOne(), group.position.z = 2e3;
                    for (var i = 0; i < numHexs; i++) hexs[i].reset(t, i);
                }
                for (i = 0; i < numFireflies; i++) fireflies[i].move(t, i);
                for (i = 0; i < numHexs; i++) hexs[i].move(t, i);
                camera.position.x -= .02 * (camera.position.x - target.position.x), camera.position.y -= .02 * (camera.position.y - target.position.y), 
                cameraTarget.x -= .2 * (cameraTarget.x - 5 * mouse.x), cameraTarget.y -= .2 * (cameraTarget.y - 5 * mouse.y), 
                camera.lookAt(new THREE.Vector3(camera.position.x - cameraTarget.x, camera.position.y - cameraTarget.y, 0)), 
                group.position.z -= 35, target.position.z += 40, renderer.render(scene, camera);
            }(0);
        },
        resize: function(w, h) {
            stageWidth = w, stageHeight = h, renderer.setSize(w, h), camera.aspect = w / h, 
            camera.updateProjectionMatrix();
        }
    };
});

con = console;

if (isNode = "undefined" != typeof module) rand = require("./rand.js"), dom = require("./dom.js"), 
colours = require("./colours.js");

var hexagon_tile = function() {
    var spreadSeed;
    function getJitter() {
        return spreadSeed += 1.89127398, (Math.sin(spreadSeed) + Math.cos(2.12387891 * spreadSeed)) / 2 * .1;
    }
    var radiusOuter, strokeSize, radiusInner, smoothSize, randomHexes, hexagons, hexs, batches, stage, inner, size = 100, vector = !1, sw = size, sh = size, angle60 = 2 * Math.PI / 6, batchSize = 1e3, currentBatch = 0, settings = {
        spread: {
            type: "Number",
            label: "Spread",
            min: 1,
            max: 10,
            cur: 10
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !0
        }
    };
    function init(options) {
        spreadSeed = rand.getSeed(), .5 * rand.getLastRandom(), size = options.size, sw = options.sw || size, 
        sh = options.sh || size, stage.setSize(sw, sh), settings.spread.cur = 10, settings.background.cur = !0, 
        options.settings && (settings = options.settings), progress("settings:initialised", settings);
        colours.getRandomPalette();
        var backgroundColor = colours.getRandomColour();
        if (radiusOuter = (5 + 25 * rand.random()) / 1e3, strokeSize = rand.random() * rand.random() * rand.random() * radiusOuter, 
        radiusInner = radiusOuter - strokeSize + .01 * strokeSize, smoothSize = .01 + 10 * rand.random(), 
        vector) {
            for (;inner.firstChild; ) inner.removeChild(inner.firstChild);
            stage.setAttribute("style", "background-color:" + backgroundColor);
        } else settings.background.cur && (stage.ctx.fillStyle = backgroundColor, stage.ctx.fillRect(0, 0, size, size));
        for (var path = [], points = [], i = 0; i < 6; i++) {
            var angle = i * angle60, x = radiusInner * Math.cos(angle), y = radiusInner * Math.sin(angle);
            path[i] = (0 === i ? "M" : "L") + x + "," + y, points[i] = {
                x: x,
                y: y
            };
        }
        path.push("Z");
        var minHeight = radiusOuter * Math.sin(angle60), cols = Math.ceil(1 / radiusOuter / 3) + 1, rows = Math.ceil(1 / minHeight) + 1;
        hexagons = cols * rows, hexs = [];
        for (i = 0; i < hexagons; i++) {
            var hex, row = Math.floor(i / cols);
            x = (i % cols + (row % 2 == 0 ? .5 : 0)) * radiusOuter * 3, y = row * minHeight;
            if (vector) {
                var group = dom.svg("g");
                group.setAttribute("transform", "translate(" + x + "," + y + ")"), inner.appendChild(group), 
                hex = dom.svg("path", {
                    d: path.join(" ")
                }), group.appendChild(hex);
            } else hex = points;
            hexs[i] = {
                index: i,
                hex: hex,
                x: x,
                y: y,
                colour: null,
                rendered: !1
            };
        }
        randomHexes = rand.shuffle(hexs.slice()), render();
    }
    function batch() {
        var shouldRender = settings.spread.cur / settings.spread.max * 10;
        con.log("shouldRender", shouldRender);
        var loopStart = currentBatch * batchSize, loopEnd = loopStart + batchSize;
        hexagons < loopEnd && (loopEnd = hexagons);
        for (var h = loopStart; h < loopEnd; h++) {
            for (var colour, index = randomHexes[h].index, item = hexs[index], close = [], i = 0; i < hexagons; i++) if (i != h) {
                var otherItem = randomHexes[i];
                if (otherItem.rendered) {
                    var dx = item.x - otherItem.x, dy = item.y - otherItem.y;
                    Math.sqrt(dx * dx + dy * dy) < radiusOuter * smoothSize && close.push(otherItem.colour);
                }
            }
            if (colour = 0 < close.length ? colours.mixColours(close) : colours.getNextColour(), 
            vector) item.hex.setAttribute("style", "fill:" + colour); else {
                dx = item.x - .5 + getJitter(), dy = item.y - .5 + getJitter();
                if (Math.round(10 * Math.sqrt(dx * dx + dy * dy)) < shouldRender) {
                    stage.ctx.fillStyle = colour, stage.ctx.beginPath();
                    for (i = 0; i < 6; i++) {
                        var x = (item.x + item.hex[i].x) * size, y = (item.y + item.hex[i].y) * size;
                        0 === i ? stage.ctx.moveTo(x, y) : stage.ctx.lineTo(x, y);
                    }
                    stage.ctx.closePath(), stage.ctx.fill();
                }
            }
            hexs[index].rendered = !0, hexs[index].colour = colour;
        }
        ++currentBatch == batches ? progress("render:complete", experiment.stage) : (progress("render:progress", currentBatch / batches), 
        setTimeout(batch, 25));
    }
    function render() {
        batches = Math.ceil(hexagons / batchSize), currentBatch = 0, batch();
    }
    vector ? (stage = dom.svg("svg", {
        width: sw,
        height: sh
    }), inner = dom.svg("g"), stage.appendChild(inner)) : stage = dom.canvas(sw, sh);
    var experiment = {
        init: init,
        render: render,
        settings: settings,
        stage: vector ? stage : stage.canvas,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
    return experiment;
};

isNode ? module.exports = hexagon_tile() : define("hexagon_tile", hexagon_tile), 
define("infinite_scrolling_cogs", function() {
    var sw = window.innerWidth, sh = window.innerHeight;
    function makeCanvas(w, h) {
        var can = document.createElement("canvas");
        return can.width = w, can.height = h, can;
    }
    var stage = makeCanvas(sw, sh);
    return {
        init: function() {
            var prevCog, context = stage.getContext("2d"), padding = 5, cogs = [], pi = 3.14159265, pi2 = 2 * pi, dir = -1, cx = .5 * sw, cy = 0, tr = 0, ang = 0, speed = .02, cogNumber = 0, holeStyle = {
                fillStyle: "#000",
                lineWidth: 0
            }, curvature = 1.7;
            function number(min, max) {
                return Math.random() * (max - min) + min;
            }
            function integer(min, max) {
                return ~~number(min, max + 1);
            }
            function colourGrey(options) {
                var defaults = {
                    darkest: 0,
                    lightest: 255,
                    alpha: 1
                };
                for (var p in options) defaults[p] = options[p];
                var white = defaults.white ? defaults.white : integer(defaults.darkest, defaults.lightest);
                return "rgba(" + white + "," + white + "," + white + "," + defaults.alpha + ")";
            }
            function drawCircle(c, x, y, r, style, antiClockwise, renderNow) {
                c.moveTo(x + r, y), null == antiClockwise && (antiClockwise = !1);
                var defaults = {
                    fillStyle: "#fff",
                    lineWidth: 0,
                    strokeStyle: "#000"
                };
                for (var p in style) defaults[p] = style[p];
                c.fillStyle = defaults.fillStyle, c.lineWidth = defaults.lineWidth, c.strokeStyle = defaults.strokeStyle, 
                renderNow && c.beginPath(), c.arc(x, y, r, 0, pi2, antiClockwise), renderNow && (c.closePath(), 
                defaults.fillStyle && c.fill(), defaults.lineWidth && c.stroke());
            }
            function createCog(forceX, forceY) {
                var ctx, size;
                if (prevCog = cogs[cogNumber - 1], forceX && forceY && prevCog) {
                    var dy = forceY - prevCog.yp, dx = forceX - prevCog.xp;
                    ang = Math.atan(dy / dx), ang += dx < 0 ? pi : 0, dx = Math.abs(dx), dy = Math.abs(dy), 
                    dx -= Math.abs(prevCog.size), dy -= Math.abs(prevCog.size), size = Math.sqrt(dx * dx + dy * dy);
                } else ang = number(0, pi2), size = number(60, 100);
                if (!(size < 50 || 400 < size)) {
                    var teeth = ~~(size / 10);
                    dir *= -1, cogNumber && (cx += (tr += size - 10) * Math.cos(ang), cy += tr * Math.sin(ang)), 
                    tr = size - 10;
                    for (var realX, realY, minRad = size - 25, maxRad = size, verts = [], step = pi2 / (4 * teeth), mod = 0, oddEven = 0, halfRadius = (maxRad - minRad) / curvature + minRad, j = 0; j < 4 * teeth; j++) {
                        var i = j * step, topBottomLand = ~~mod % 2, r = topBottomLand * (maxRad - minRad) + minRad;
                        mod += .5, oddEven += 1;
                        var angle = i - step / 2;
                        realX = r * Math.cos(angle), realY = r * Math.sin(angle);
                        var v = void 0;
                        v = oddEven % 2 == 0 ? {
                            tb: topBottomLand,
                            ex: realX,
                            ey: realY
                        } : {
                            tb: topBottomLand,
                            mp: !0,
                            ex: realX,
                            ey: realY,
                            mx: halfRadius * Math.cos(i - step),
                            my: halfRadius * Math.sin(i - step)
                        }, verts.push(v);
                    }
                    var cog = {
                        index: cogNumber,
                        size: size,
                        rotation: number(0, pi2),
                        teeth: teeth,
                        dir: dir,
                        xp: cx,
                        yp: cy,
                        canvas: null
                    };
                    cogNumber && (prevCog = cogs[cogNumber - 1], cog.rotation = prevCog.teeth / cog.teeth * -prevCog.rotation + ang * (prevCog.teeth + cog.teeth) / cog.teeth, 
                    cog.teeth % 2 == 0 && (cog.rotation += pi2 / (2 * cog.teeth))), cog.render = function() {
                        var dims = 2 * (this.size + padding);
                        this.canvas = makeCanvas(dims, dims), (ctx = this.canvas.getContext("2d")).save(), 
                        ctx.translate(this.size + padding, this.size + padding), ctx.shadowBlur = 2, ctx.shadowColor = "#000", 
                        ctx.beginPath(), v = verts[0], ctx.moveTo(v.ex, v.ey);
                        for (var i = 1; i < verts.length; i++) {
                            var v = verts[i];
                            v.mp ? ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey) : ctx.lineTo(v.ex, v.ey);
                        }
                        v = verts[0], ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey);
                        var axleSize = .2 * minRad;
                        drawCircle(ctx, 0, 0, .2 * minRad, holeStyle, !0), drawCutouts(axleSize + .1 * minRad, .9 * minRad), 
                        ctx.closePath(), ctx.fillStyle = colourGrey({
                            darkest: 70,
                            lightest: 200,
                            alpha: 1
                        }), ctx.fill(), ctx.stroke(), .5 < Math.random() && drawCircle(ctx, 0, 0, .16 * minRad, holeStyle, !0, !0), 
                        ctx.globalCompositeOperation = "source-atop", drawBand(axleSize, axleSize + .1 * minRad), 
                        drawBand(.9 * minRad, minRad);
                    }, cog.draw = function() {
                        cog.canvas || cog.render(), context.save(), context.translate(this.xp, this.yp), 
                        context.rotate(this.rotation), context.drawImage(this.canvas, -this.size - padding, -this.size - padding), 
                        context.restore();
                    }, cog.rotate = function() {
                        this.rotation += pi2 / this.teeth * this.dir * speed, this.draw();
                    }, cogs[cogNumber] = cog, cogNumber++;
                }
                function drawBand(minRadius, maxRadius) {
                    if (!(number(0, 1) < .3)) {
                        var bandSize = maxRadius - minRadius;
                        drawCircle(ctx, 0, 0, (maxRadius + minRadius) / 2, {
                            fillStyle: null,
                            strokeStyle: colourGrey({
                                darkest: 0,
                                lightest: 40,
                                alpha: .5
                            }),
                            lineWidth: bandSize
                        }, !1, !0);
                    }
                }
                function drawCutouts(minRadius, maxRadius) {
                    var midRadius = (maxRadius + minRadius) / 2, bandSize = maxRadius - minRadius;
                    0 == integer(0, 1) ? function(midRadius, bandSize) {
                        var holeSize = bandSize / 2 * number(.6, .9), holes = ~~(number(.5, .9) * pi2 * midRadius / holeSize / 2);
                        holeSize *= number(.5, .9);
                        for (var i = 0; i < holes; i++) {
                            var angle = i / holes * pi2;
                            drawCircle(ctx, midRadius * Math.cos(angle), midRadius * Math.sin(angle), holeSize, holeStyle, !0);
                        }
                    }(midRadius, bandSize) : function(midRadius, bandSize) {
                        for (var capped = 0 == integer(0, 1), segments = 1 + ~~Math.pow(teeth, 1 / integer(2, capped ? 4 : 3)), holeSize = number(.5, .8) * bandSize, segmentSize = (pi2 / segments - (Math.asin(holeSize / midRadius) * capped ? 1 : .5)) * number(.5, .9), innerRadius = midRadius - holeSize / 2, outerRadius = midRadius + holeSize / 2, i = 0; i < segments; i++) {
                            var startAngle = i / segments * pi2, endAngle = startAngle + segmentSize;
                            ctx.moveTo(Math.cos(startAngle) * innerRadius, Math.sin(startAngle) * innerRadius), 
                            ctx.arc(0, 0, innerRadius, startAngle, endAngle, !1), capped ? ctx.arc(Math.cos(endAngle) * midRadius, Math.sin(endAngle) * midRadius, holeSize / 2, endAngle + pi, endAngle, !0) : ctx.lineTo(Math.cos(endAngle) * outerRadius, Math.sin(endAngle) * outerRadius), 
                            ctx.arc(0, 0, outerRadius, endAngle, startAngle, !0), capped ? ctx.arc(Math.cos(startAngle) * midRadius, Math.sin(startAngle) * midRadius, holeSize / 2, startAngle, startAngle + pi, !0) : ctx.lineTo(Math.cos(startAngle) * innerRadius, Math.sin(startAngle) * innerRadius);
                        }
                    }(midRadius, bandSize);
                }
            }
            var scrollY = 0, y = 0;
            function incrementCog() {
                var newX = (cx < sw / 2 ? number(0, 3) : number(-3, 0)) * sw / 12;
                createCog(cx + newX, y), y = cy + number(0, 200);
            }
            for (var i = 0; i < 5; i++) incrementCog();
            document.body.appendChild(stage), function onLoop() {
                requestAnimationFrame(onLoop), --scrollY - sh - 200 < -cy && incrementCog(), context.fillStyle = "#ddd", 
                context.fillRect(0, 0, sw, sh), context.save(), context.translate(0, scrollY);
                for (var i = 0; i < cogs.length; i++) cogs[i].rotate();
                context.restore();
            }();
        },
        stage: stage
    };
}), define("infinite_stairs", function() {
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

sw = 400, sh = 400;

var ctx = (bmp = dom.canvas(sw, sh)).ctx, cx = sw / 2, cy = sh / 2, frame = 0;

function newLine() {
    ctx.clearRect(0, 0, sw, sh);
    var gap, rotation, dot = 70, anim = frame % 400, phase = Math.floor(anim / 100);
    switch (anim = (anim - 100 * phase) / 100, phase) {
      case 0:
        gap = 1 - anim, rotation = 1;
        break;

      case 1:
        gap = 0, rotation = 1 - anim;
        break;

      case 2:
        gap = anim, rotation = 0;
        break;

      case 3:
        gap = 1, rotation = anim;
    }
    var angle = 30 * rotation / 360 * Math.PI * 2, cos = dot * Math.cos(angle), sin = dot * Math.sin(angle);
    function drawCube(x, y, face) {
        var ax = x, ay = y, bx = x + cos * rotation, by = y - sin, cx = x + cos + cos * rotation, cy = y, dx = cx, dy = y + dot, ex = x + cos, ey = y + sin + dot, fx = x, fy = y + dot, gx = ex, gy = y + sin;
        switch (ctx.beginPath(), face) {
          case 0:
            ctx.fillStyle = "#444", ctx.moveTo(ax, ay), ctx.lineTo(gx, gy), ctx.lineTo(ex, ey), 
            ctx.lineTo(fx, fy);
            break;

          case 1:
            ctx.fillStyle = "#666", ctx.moveTo(gx, gy), ctx.lineTo(cx, cy), ctx.lineTo(dx, dy), 
            ctx.lineTo(ex, ey);
            break;

          case 2:
            ctx.fillStyle = "#888", ctx.moveTo(ax, ay), ctx.lineTo(gx, gy), ctx.lineTo(cx, cy), 
            ctx.lineTo(bx, by);
        }
        ctx.closePath(), ctx.fill();
    }
    for (var gapX = gapY = .4 + .6 * gap, i = 0; i < 9; i++) for (var x = i * cos * 2 * gapX - 10, j = 12; -1 < j; j--) {
        var y = j * dot * 2 * gapY - 300 + i * sin * 2 * gapY;
        drawCube(x, y, 1), drawCube(x, y, 2), drawCube(x, y, 0);
    }
    frame += .5, requestAnimationFrame(newLine);
}

document.body.appendChild(bmp.canvas), newLine(), define("isometric_words", [], function() {
    var camera, scene, renderer, pic = "\n   █████        █████     ████████     ██████████\n █████████    █████████   ██████████   ██████████\n████   ████  ████   ████  ████   ████  ████\n████         ████   ████  ████   ████  ████\n████         ████   ████  ████   ████  ██████████\n████         ████   ████  ████   ████  ██████████\n████         ████   ████  ████   ████  ████\n████   ████  ████   ████  ████   ████  ████\n █████████    █████████   ██████████   ██████████\n   █████        █████     ████████     ██████████\n\n", cubeSize = 10;
    var direction, d, holder, camPos = {
        x: -(direction = 1) * (d = 1e3 * direction),
        y: 1 * d,
        z: 1 * d
    }, sw = window.innerWidth, sh = window.innerHeight;
    function randomRotate() {
        return 1 * (Math.random() - .5);
    }
    var weird = !0;
    function morph() {
        var rotateMod = (weird = !weird) ? 1 : 0;
        TweenMax.to(holder.rotation, 5, {
            x: rotateMod * randomRotate(),
            y: rotateMod * randomRotate(),
            z: rotateMod * randomRotate(),
            ease: Quint.easeInOut,
            onComplete: morph
        });
    }
    function render(time) {
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            colours.getRandomPalette(), scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(sw / -2, sw / 2, sh / 2, sh / -2, 1, 2e4), 
            scene.add(camera), camera.position.set(camPos.x, camPos.y, camPos.z), camera.lookAt(scene.position);
            var lightAbove = new THREE.DirectionalLight(16765136, 1);
            lightAbove.position.set(0, 1, 0), scene.add(lightAbove);
            var lightLeft = new THREE.DirectionalLight(13696976, 1);
            lightLeft.position.set(1, 0, 0), scene.add(lightLeft);
            var lightBelow = new THREE.DirectionalLight(13684991, 1);
            lightBelow.position.set(0, 0, 1), scene.add(lightBelow);
            var light = new THREE.AmbientLight(6316128);
            scene.add(light), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder), holder.rotation.set(randomRotate(), randomRotate(), randomRotate());
            var lines = pic.split("\n"), width = lines.reduce(function(a, b) {
                return Math.max(a, b.length);
            }, 0), height = lines.length;
            lines.forEach(function(line, y) {
                line.split("").forEach(function(pixel, x) {
                    if ("█" === pixel) {
                        var c = (colour = colours.getNextColour(), material = new THREE.MeshLambertMaterial({
                            color: colour
                        }), geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize), new THREE.Mesh(geometry, material));
                        holder.add(c);
                        var magicOffset = rand.getInteger(-10, 10);
                        c.position.set((x - width / 2 + magicOffset) * cubeSize, (height / 2 - y - magicOffset) * cubeSize, -magicOffset * cubeSize);
                    }
                    var colour, material, geometry;
                });
            }), document.body.appendChild(renderer.domElement), render(), morph();
        }
    };
}), define("lego_stack", [ "lib/schteppe/cannon.0.6.2.min.js", "cannon_demo" ], function(cn, CannonDemo) {
    !function check() {
        con.log("check"), "undefined" == typeof THREE ? setTimeout(check, 10) : function() {
            var demo = new CannonDemo({
                trackballControls: !0
            }), world = function(demo) {
                var world = demo.getWorld();
                world.gravity.set(0, 0, -40), world.broadphase = new CANNON.NaiveBroadphase(), world.solver.iterations = 10;
                var groundShape = new CANNON.Plane(), groundBody = new CANNON.Body({
                    mass: 0
                });
                return groundBody.addShape(groundShape), groundBody.position.set(0, 0, 1), world.addBody(groundBody), 
                demo.addVisual(groundBody), world.quatNormalizeFast = !1, world.quatNormalizeSkip = 0, 
                world;
            }(demo);
            world.gravity.set(0, 0, -10);
            var blocks = [];
            function createBlock() {
                var length = 2 * rand.getInteger(1, 4), height = rand.getInteger(1, 2), knob = new CANNON.Cylinder(.5, .5, .5, 12), roof = new CANNON.Box(new CANNON.Vec3(2, length, .2)), bodyT = new CANNON.Box(new CANNON.Vec3(2, .2, height)), bodyR = new CANNON.Box(new CANNON.Vec3(.2, length, height)), bodyB = new CANNON.Box(new CANNON.Vec3(2, .2, height)), bodyL = new CANNON.Box(new CANNON.Vec3(.2, length, height)), block = new CANNON.Body({
                    mass: .1
                });
                block.addShape(roof, new CANNON.Vec3(0, 0, height)), block.addShape(bodyT, new CANNON.Vec3(0, length - .2, 0)), 
                block.addShape(bodyR, new CANNON.Vec3(1.8, 0, 0)), block.addShape(bodyB, new CANNON.Vec3(0, .2 - length, 0)), 
                block.addShape(bodyL, new CANNON.Vec3(-1.8, 0, 0));
                for (var w = 0; w < 2; w++) for (var l = 0; l < length; l++) {
                    var knobPosition = new CANNON.Vec3(2 * (w - 1 + .5), 2 * (l - length / 2 + .5), height + .25);
                    block.addShape(knob, knobPosition);
                }
                block.position.set(0, 0, 10 + 5 * blocks.length);
                var colour = [ 14483456, 17408, 16759552, 2237166 ][rand.getInteger(0, 3)];
                world.add(block), demo.addVisual(block, new THREE.MeshPhongMaterial({
                    color: colour
                })), block.linearDamping = .1, block.angularDamping = .1, blocks.push(block);
            }
            function update(time) {
                requestAnimationFrame(update), blocks.length < 100 && blocks.length < Math.floor(time / 1e3) && createBlock();
            }
            demo.create(function() {
                createBlock(), update();
            }), demo.start();
        }();
    }();
});

var linked_line = function() {
    return {
        generate: function(size, preoccupied) {
            return new Promise(function(resolve, reject) {
                if (Math.round(size / 2) === size / 2 || Math.round(size) !== size) return alert("linked_line - invalid size, needs to be odd integer - you supplied: " + size), 
                con.warn("linked_line - invalid size, needs to be odd integer - you supplied:", size);
                var first, attempts = 0, wid = size, hei = size, sw = 2 * (wid + .5), sh = 2 * (hei + .5), swZ = 2 * (wid + .5) * 4, shZ = 2 * (hei + .5) * 4, bmp = dom.canvas(sw, sh), bmpZ = dom.canvas(swZ, shZ), bmpW = dom.canvas(swZ, shZ), bmpR = dom.canvas(swZ, shZ), ctx = bmp.ctx, ctxZ = bmpZ.ctx, ctxW = bmpW.ctx, ctxR = bmpR.ctx, debug = dom.element("div"), occupied = {
                    array: [],
                    oneD: [],
                    monkeys: []
                }, backup = {}, preoccupy = function(options) {
                    var item = {
                        x: options.x,
                        y: options.y,
                        type: "NULL"
                    };
                    occupied.oneD[getIndex(item.x, item.y)] = item, occupied.array.push(item);
                }, makeItem = function(options) {
                    var x = null == options.x ? rand.random() : options.x, y = null == options.y ? rand.random() : options.y, item = {
                        x: x,
                        y: y,
                        type: "TUNNEL",
                        surrounded: !1,
                        prev: options.prev,
                        next: options.next
                    };
                    return occupied.oneD[getIndex(x, y)] = item, occupied.array.push(item), item;
                }, getIndex = function(x, y) {
                    return y * wid + x;
                }, checkDir = function(x, y, dir) {
                    switch (dir) {
                      case 0:
                        y--;
                        break;

                      case 1:
                        x++;
                        break;

                      case 2:
                        y++;
                        break;

                      case 3:
                        x--;
                    }
                    var index = getIndex(x, y);
                    return {
                        ok: 0 <= x && x < wid && 0 <= y && y < hei && -1 === occupied.oneD[index],
                        x: x,
                        y: y
                    };
                }, insertItemAnywhere = function() {
                    var index = rand.getInteger(0, occupied.array.length - 1), item = occupied.array[index];
                    item && (debug.innerHTML = "item " + occupied.array.length, function(item) {
                        for (var i = -1; i < 2; i++) for (var j = -1; j < 2; j++) {
                            var x = item.x + i, y = item.y + j;
                            if (0 <= x && x < wid && 0 <= y && y < hei) {
                                var index = getIndex(x, y);
                                if (-1 === occupied.oneD[index]) return !1;
                            }
                        }
                        return item.surrounded = !0;
                    }(item) ? occupied.array.splice(index, 1) : item && item.next && item.prev && insertItemAfter(item));
                }, insertItemAfter = function(afterItem) {
                    backup.array = occupied.array.slice(), backup.oneD = occupied.oneD.slice();
                    var prev = afterItem, next = afterItem.next, x = afterItem.x, y = afterItem.y, startDir = rand.getInteger(0, 3), nextDir = rand.getInteger(0, 3), pending0 = checkDir(x, y, startDir), pending1 = checkDir(pending0.x, pending0.y, nextDir), inline = function() {
                        for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) points[_key] = arguments[_key];
                        for (var i = 0, il = points.length - 1; i < il; i++) {
                            var p0 = points[i], p1 = points[i + 1];
                            if (0 !== Math.abs(p0.x - p1.x) && 0 !== Math.abs(p0.y - p1.y)) return !1;
                        }
                        return !(points[0].x === points[1].x && points[1].x === points[2].x || points[0].y === points[1].y && points[1].y === points[2].y);
                    }(prev, pending0, pending1, next);
                    if (pending0.ok && pending1.ok && inline) {
                        var newItem0 = makeItem({
                            x: pending0.x,
                            y: pending0.y
                        }), newItem1 = makeItem({
                            x: pending1.x,
                            y: pending1.y
                        });
                        (prev.next = newItem0).prev = prev, (newItem0.next = newItem1).prev = newItem0, 
                        (newItem1.next = next).prev = newItem1;
                    } else occupied.array = backup.array.slice(), occupied.oneD = backup.oneD.slice();
                };
                ctxZ.scale(4, 4), ctxZ.imageSmoothingEnabled = !1, ctxW.scale(4, 4), ctxW.imageSmoothingEnabled = !1;
                var arrLen = 0, done = 0, render = function render(time) {
                    attempts++, ctx.fillStyle = "#fff", ctx.fillRect(0, 0, sw, sh);
                    for (var i = 0; i < 40; i++) insertItemAnywhere();
                    ctx.beginPath(), ctx.lineWidth = .25;
                    for (var item = first; item; ) {
                        var x = 2 * (item.x + .75), y = 2 * (item.y + .75);
                        item == first ? ctx.moveTo(x - 2, y) : item.next ? ctx.lineTo(x, y) : (ctx.lineTo(x, y), 
                        ctx.lineTo(x, y + 2)), item = item.next;
                    }
                    for (ctx.stroke(), i = 0; i < occupied.array.length; i++) item = occupied.array[i], 
                    ctx.fillStyle = "NULL" == item.type ? "#f00" : "#00ff00", ctx.fillRect(2 * item.x + 1, 2 * item.y + 1, 1, 1);
                    ctxZ.drawImage(bmp.canvas, 0, 0), arrLen === occupied.array.length ? done++ : (arrLen = occupied.array.length, 
                    done = 0), done < 300 ? attempts % 50 == 0 ? (con.log("having a breather... ", done), 
                    setTimeout(render, 20)) : render() : function() {
                        var pixels = ctx.getImageData(0, 0, sw, sh).data;
                        ctxW.fillStyle = "#fff", ctxW.fillRect(0, 0, sw, sh);
                        for (var index, walls = [], i = 0, j = 0, il = pixels.length; i < il; i += 4, j++) {
                            var xy = {
                                x: (index = j) % sw,
                                y: Math.floor(index / sw)
                            };
                            255 == pixels[i] && (ctxW.fillStyle = "#f00", ctxW.fillRect(xy.x, xy.y, 1, 1), walls.push(xy));
                        }
                        var w, wallrects = [], row = -1;
                        for (i = 0, il = walls.length; i < il; i++) row != (w = walls[i]).y ? (row = w.y, 
                        wallrects.push({
                            x: w.x,
                            y: w.y,
                            w: 1,
                            h: 1
                        })) : walls[i - 1].x == w.x - 1 ? wallrects[wallrects.length - 1].w++ : wallrects.push({
                            x: w.x,
                            y: w.y,
                            w: 1,
                            h: 1
                        });
                        for (i = 0, il = wallrects.length; i < il; i++) {
                            var w0 = wallrects[i];
                            for (j = i + 1; j < il; j++) {
                                var w1 = wallrects[j];
                                w0 && w1 && w0.x == w1.x && w0.w == w1.w && w0.y + w0.h == w1.y && (wallrects[i].h++, 
                                wallrects[j] = null);
                            }
                        }
                        for (wallrects = wallrects.filter(function(item) {
                            return item;
                        }), ctxR.fillStyle = "#fff", ctxR.fillRect(0, 0, swZ, shZ), i = 0, il = wallrects.length; i < il; i++) (w = wallrects[i]) && (ctxR.beginPath(), 
                        ctxR.rect(4 * w.x + 2, 4 * w.y + 2, 4 * w.w - 4, 4 * w.h - 4), ctxR.lineWidth = 1, 
                        ctxR.lineStyle = "rgba(0,0,0,0.00)", ctxR.closePath(), ctxR.stroke());
                        resolve({
                            walls: walls,
                            wallrects: wallrects
                        });
                    }();
                };
                !function() {
                    for (var y = 0; y < hei; y++) for (var x = 0; x < wid; x++) occupied.oneD.push(-1), 
                    ctx.fillRect(2 * x - 2 + 1, 2 * y - 2 + 1, 4, 4);
                    var newItem, lastItem;
                    preoccupied && preoccupied.forEach(preoccupy);
                    for (var i = 0; i < hei; i++) i < hei / 2 ? (x = i, y = hei / 2 - .5) : (x = wid / 2 - .5, 
                    y = i), 0 == i ? (newItem = makeItem({
                        x: x,
                        y: y
                    }), first = newItem) : (newItem = makeItem({
                        x: x,
                        y: y,
                        prev: lastItem
                    }), lastItem.next = newItem), lastItem = newItem;
                    render(0);
                }();
            });
        }
    };
};

define("linked_line", linked_line);

var mandala = function() {
    var sw, sh, centre, spokes, settings = {
        spread: {
            type: "Number",
            label: "Spread",
            min: 1,
            max: 10,
            cur: 10
        }
    }, TAU = 2 * Math.PI, stage = dom.canvas(1, 1);
    stage.ctx;
    function init(options) {
        size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
        centre = sh / 2;
        var palette = colours.getRandomPalette();
        con.log("Mandala init", palette), spokes = 2 * rand.getInteger(2, 40), settings.spread.cur = 10, 
        options.settings && (settings = options.settings), progress("settings:initialised", settings), 
        render();
    }
    function render() {
        var spread = settings.spread.cur / settings.spread.max;
        con.log("spread", spread);
        var a = 1 / spokes * TAU, maxR = Math.sqrt(.5), r = maxR * size, bgColour = colours.getRandomColour(), masker = dom.canvas(sw, sh);
        masker.ctx.translate(2, 2), masker.ctx.lineCap = "flat", masker.ctx.beginPath(), 
        masker.ctx.moveTo(0, 0), masker.ctx.lineTo(Math.sin(0) * r, Math.cos(0) * r), masker.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r), 
        masker.ctx.lineTo(0, 0), masker.ctx.fillStyle = "red", masker.ctx.strokeStyle = "red", 
        masker.ctx.lineWidth = 2, masker.ctx.stroke();
        var pattern = dom.canvas(sw, sh);
        pattern.ctx.translate(2, 2), pattern.ctx.beginPath(), pattern.ctx.moveTo(0, 0), 
        pattern.ctx.lineTo(Math.sin(0) * r, Math.cos(0) * r), pattern.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r), 
        pattern.ctx.lineTo(0, 0), pattern.ctx.fillStyle = bgColour, pattern.ctx.strokeStyle = bgColour, 
        pattern.ctx.lineWidth = 2, pattern.ctx.stroke(), pattern.ctx.fill(), document.body.appendChild(masker.canvas), 
        document.body.appendChild(pattern.canvas);
        var max = 7;
        function sorter(a, b) {
            return a < b ? -1 : 1;
        }
        var bandSets = rand.getInteger(0, max);
        max -= bandSets;
        var regionSets = 2, circleSets = max -= regionSets;
        con.log(bandSets, regionSets, circleSets), function() {
            for (var regionSizes = {
                left: [],
                right: []
            }, i = 0; i < regionSets; i++) regionSizes.left.push(rand.random()), regionSizes.right.push(rand.random());
            for (regionSizes.left.sort(sorter), regionSizes.right.sort(sorter), i = 0; i < regionSets - 1; i++) {
                pattern.ctx.fillStyle = colours.getNextColour();
                var x0 = Math.sin(0) * regionSizes.left[i], y0 = Math.cos(0) * regionSizes.left[i], x1 = Math.sin(a) * regionSizes.right[i], y1 = Math.cos(a) * regionSizes.right[i], x2 = Math.sin(a) * regionSizes.right[i + 1], y2 = Math.cos(a) * regionSizes.right[i + 1], x3 = Math.sin(0) * regionSizes.left[i + 1], y3 = Math.cos(0) * regionSizes.left[i + 1];
                pattern.ctx.beginPath(), pattern.ctx.moveTo(x0 * r, y0 * r), pattern.ctx.lineTo(x1 * r, y1 * r), 
                pattern.ctx.lineTo(x2 * r, y2 * r), pattern.ctx.lineTo(x3 * r, y3 * r), pattern.ctx.closePath(), 
                pattern.ctx.fill(), pattern.ctx.strokeStyle = "black", pattern.ctx.stroke();
                var points = [ {
                    x: x0,
                    y: y0
                }, {
                    x: x1,
                    y: y1
                }, {
                    x: x2,
                    y: y2
                }, {
                    x: x3,
                    y: y3
                } ], insetPoints = geom.insetPoints(points, -.01);
                if (con.log("duble", points, insetPoints), insetPoints) {
                    for (pattern.ctx.beginPath(), pattern.ctx.fillStyle = colours.getNextColour(), i = 0; i < insetPoints.length; i++) {
                        var p = insetPoints[i];
                        pattern.ctx[0 == i ? "moveTo" : "lineTo"](p.x * r, p.y * r);
                    }
                    pattern.ctx.fill();
                }
            }
        }();
        for (var i = 0; i < spokes; i++) stage.ctx.save(), i % 2 == 1 ? (stage.ctx.scale(-1, 1), 
        stage.ctx.translate(-centre, centre), stage.ctx.rotate((i - 1) * a)) : (stage.ctx.translate(centre, centre), 
        stage.ctx.rotate(i * a)), stage.ctx.drawImage(pattern.canvas, -2, -2), stage.ctx.restore();
    }
    var experiment = {
        init: init,
        render: render,
        settings: settings,
        stage: stage.canvas,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
    return progress("render:complete", stage.canvas), experiment;
};

(isNode = "undefined" != typeof module) ? module.exports = mandala() : define("mandala", mandala), 
function() {
    var borderIndex, can, carve, check, con, ctx, d, draw, e, entry, exits, field, fill, frontier, harden, init, iterations, iterativeDraw, keepDrawing, logShape, maze, random, row, x, y, y1, _i, _j, _k, _l, _m;
    for (con = console, d = document, ctx = null, can = d.createElement("canvas"), 0, 
    16, Math.random(), random = {
        randint: function(min, max) {
            return parseInt(min + Math.random() * (max - min));
        },
        shuffle: function(array) {
            var i, m, t;
            for (m = array.length; m; ) i = Math.floor(Math.random() * m--), t = array[m], array[m] = array[i], 
            array[i] = t;
            return array;
        }
    }, logShape = function() {
        var s, x, y, _i, _j;
        for (s = "", y = _i = 0; _i < 16; y = ++_i) {
            for (x = _j = 0; _j < 16; x = ++_j) s += field[y][x];
            s += "\n";
        }
        return con.log(s);
    }, field = [], y = _i = 0; _i < 16; y = ++_i) {
        for (row = [], x = _j = 0; _j < 16; x = ++_j) row.push("?");
        field.push(row);
    }
    for (frontier = [], carve = function(y, x) {
        var extra, i, _k, _len, _results;
        for (extra = [], field[y][x] = ".", 0 < x && "?" === field[y][x - 1] && (field[y][x - 1] = ",", 
        extra.push([ y, x - 1 ])), x < 15 && "?" === field[y][x + 1] && (field[y][x + 1] = ",", 
        extra.push([ y, x + 1 ])), 0 < y && "?" === field[y - 1][x] && (field[y - 1][x] = ",", 
        extra.push([ y - 1, x ])), y < 15 && "?" === field[y + 1][x] && (field[y + 1][x] = ",", 
        extra.push([ y + 1, x ])), _results = [], _k = 0, _len = (extra = random.shuffle(extra)).length; _k < _len; _k++) i = extra[_k], 
        _results.push(frontier.push(i));
        return _results;
    }, harden = function(y, x) {
        return field[y][x] = "#";
    }, check = function(y, x, nodiagonals) {
        var edgestate;
        if (null == nodiagonals && (nodiagonals = !0), (edgestate = 0) < x && "." === field[y][x - 1] && (edgestate += 1), 
        x < 15 && "." === field[y][x + 1] && (edgestate += 2), 0 < y && "." === field[y - 1][x] && (edgestate += 4), 
        y < 15 && "." === field[y + 1][x] && (edgestate += 8), nodiagonals) {
            if (1 === edgestate) {
                if (x < 15) {
                    if (0 < y && "." === field[y - 1][x + 1]) return !1;
                    if (y < 15 && "." === field[y + 1][x + 1]) return !1;
                }
                return !0;
            }
            if (2 === edgestate) {
                if (0 < x) {
                    if (0 < y && "." === field[y - 1][x - 1]) return !1;
                    if (y < 15 && "." === field[y + 1][x - 1]) return !1;
                }
                return !0;
            }
            if (4 === edgestate) {
                if (y < 15) {
                    if (0 < x && "." === field[y + 1][x - 1]) return !1;
                    if (x < 15 && "." === field[y + 1][x + 1]) return !1;
                }
                return !0;
            }
            if (8 === edgestate) {
                if (0 < y) {
                    if (0 < x && "." === field[y - 1][x - 1]) return !1;
                    if (x < 15 && "." === field[y - 1][x + 1]) return !1;
                }
                return !0;
            }
            return !1;
        }
        return -1 !== [ 1, 2, 4, 8 ].indexOf(edgestate);
    }, 60, exits = [], exits = [ 8, 52 ], y = _k = borderIndex = 0; _k < 16; y = ++_k) for (x = _l = 0; _l < 16; x = ++_l) if (0 === x || 0 === y || 15 === x || 15 === y) {
        if (-1 === exits.indexOf(borderIndex)) harden(y, x); else for (0, carve(y, x), d = 0 === y ? 1 : -1, 
        entry = _m = 1; _m <= 4; entry = ++_m) harden(y1 = y + entry * d, x - 2), harden(y1, x - 1), 
        harden(y1, x + 1), harden(y1, x + 2);
        borderIndex++;
    }
    logShape(), e = Math.E, iterations = 0, init = function(cb, _xwide, _yhigh) {
        return can.width = 256, can.height = 256, ctx = can.getContext("2d"), draw(cb);
    }, keepDrawing = function() {
        return 2 < frontier.length && iterations < 1e10;
    }, iterativeDraw = function() {
        var choice, index, pos;
        return keepDrawing() && (pos = Math.random(), (1 <= (pos = Math.pow(pos, Math.pow(e, -10))) || pos < 0) && console.log(pos), 
        index = Math.floor(pos * frontier.length), choice = frontier[index], check(choice[0], choice[1]) ? carve(choice[0], choice[1]) : harden(choice[0], choice[1]), 
        frontier.splice(index, 1)), iterations++;
    }, fill = function() {
        var f, rgb, _n, _results;
        for (_results = [], y = _n = 0; _n < 16; y = ++_n) _results.push(function() {
            var _o, _results1;
            for (_results1 = [], x = _o = 0; _o < 16; x = ++_o) f = field[y][x], rgb = {
                "#": 50,
                ".": 150,
                "?": 200,
                ",": 200
            }[f], ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1)", _results1.push(ctx.fillRect(16 * x, 16 * y, 16, 16));
            return _results1;
        }());
        return _results;
    }, draw = function(cb) {
        var f, _n, _o, _p;
        for (.5, d = _n = 0; _n < 1; d = ++_n) iterativeDraw();
        if (keepDrawing()) console.log("drawing"), requestAnimationFrame(draw); else for (console.log("done"), 
        y = _o = 0; _o < 16; y = ++_o) for (x = _p = 0; _p < 16; x = ++_p) "?" !== (f = field[y][x]) && "," !== f || (field[y][x] = "#");
        return fill();
    }, maze = {
        getMaze: function() {
            return field;
        },
        init: init,
        stage: can,
        resize: function() {
            return console.log("resize maze not implemented!");
        },
        kill: function() {
            return console.log("kill maze not implemented!");
        }
    }, window.maze = maze, define("maze", window.maze);
}.call(this), define("maze_cube", [ "linked_line" ], function(linkedLine) {
    var camera, scene, renderer, holder, blocks = 11, cubeSize = 1512, size = cubeSize / blocks, mouse = {
        x: 0,
        y: 0,
        toggle: !0
    }, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    function cube(w, h, d, colour) {
        var group = new THREE.Group(), material = new THREE.MeshPhongMaterial({
            color: colour,
            emissive: 8400896,
            specular: 10518656,
            shininess: 40
        }), geometry = new THREE.BoxGeometry(w, h, d), object = new THREE.Mesh(geometry, material);
        return object.castShadow = !0, object.receiveShadow = !0, group.add(object), group;
    }
    function render(time) {
        mouse.toggle && (holder.rotation.x += .005 * Math.PI, holder.rotation.z -= .002 * Math.PI), 
        camPos.z = 5e3, camera.position.set(camPos.x, camPos.y, camPos.z), camera.lookAt(scene.position), 
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            var mazes = [], face = function(preoccupied) {
                return linkedLine.generate(blocks, preoccupied);
            }, add = function(maze) {
                con.log("adding walls:", mazes.length, maze.wallrects.length), mazes.push(maze.wallrects), 
                progress("render:progress", mazes.length / 6);
            };
            perf.start("gen"), face().then(add).then(function() {
                return face([ {
                    x: 1,
                    y: 2
                }, {
                    x: 1,
                    y: 3
                }, {
                    x: 3,
                    y: 3
                } ]);
            }).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(face).then(add).then(function() {
                con.log("success"), perf.end("gen"), function(mazes) {
                    (scene = new THREE.Scene()).fog = new THREE.FogExp2(0, 2e-4), camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 2e4), 
                    scene.add(camera);
                    var lightAbove = new THREE.DirectionalLight(9474192, 1.5);
                    lightAbove.castShadow = !0, lightAbove.position.set(0, 200, 0), scene.add(lightAbove), 
                    (renderer = new THREE.WebGLRenderer()).setSize(sw, sh), renderer.shadowMap = {
                        type: THREE.BasicShadowMap,
                        enabled: !0
                    }, holder = new THREE.Group(), scene.add(holder);
                    var c = cube(2 * cubeSize - size, 2 * cubeSize - size, 2 * cubeSize - size, 4206624);
                    holder.add(c);
                    var makeFace = function(options) {
                        var face = new THREE.Group();
                        holder.add(face), options.maze.forEach(function(item) {
                            var x = (item.x + item.w / 2 - blocks - .5) * size, y = (item.y + item.h / 2 - blocks - .5) * size, z = cubeSize + 1, c = cube(item.w * size, item.h * size, size, 9474192);
                            c.position.set(x, y, z), face.add(c);
                        }), options.rotation.x && (face.rotation.x = options.rotation.x * Math.PI), options.rotation.y && (face.rotation.y = options.rotation.y * Math.PI), 
                        options.rotation.z && (face.rotation.z = options.rotation.z * Math.PI);
                    };
                    function toggle() {
                        mouse.toggle = !mouse.toggle;
                    }
                    makeFace({
                        maze: mazes[0],
                        rotation: {
                            x: 0
                        },
                        colour: 16711680
                    }), makeFace({
                        maze: mazes[1],
                        rotation: {
                            x: 1,
                            z: 1.5
                        },
                        colour: 65280
                    }), makeFace({
                        maze: mazes[2],
                        rotation: {
                            x: .5,
                            z: .5
                        },
                        colour: 255
                    }), makeFace({
                        maze: mazes[3],
                        rotation: {
                            x: 1.5,
                            z: 1
                        },
                        colour: 16776960
                    }), makeFace({
                        maze: mazes[4],
                        rotation: {
                            y: .5,
                            z: 1.5
                        },
                        colour: 16711935
                    }), makeFace({
                        maze: mazes[5],
                        rotation: {
                            y: 1.5,
                            z: 1
                        },
                        colour: 65535
                    }), document.body.appendChild(renderer.domElement), progress("render:complete", renderer.domElement), 
                    render(), window.addEventListener("click", toggle), window.addEventListener("touchstart", toggle);
                }(mazes);
            }).catch(function(err) {
                con.warn("fail", err);
            });
        }
    };
});

var meandering_polygons = function() {
    var sw = 1e3, sh = 1e3, dots = (colours.getNextColour(), 24), arrDots = [], bmp = dom.canvas(sw, sh), ctx = bmp.ctx, range = .2;
    function white() {
        var b = ~~(230 + 25 * Math.random());
        return "rgba(" + b + "," + b + "," + b + "," + Math.round(100 * (.7 + .3 * Math.random())) / 100 + ")";
    }
    var lines = [];
    function uniqueId(j, k) {
        return j * (j - 1) / 2 + k;
    }
    for (var j = 0; j < dots; j++) for (var k = 0; k < j; k++) lines[uniqueId(j, k)] = {
        points: [ j, k ],
        lineWidth: 0,
        colour: white(),
        dashes: ~~(5 * Math.random())
    };
    function render() {
        ctx.fillStyle = "rgba(180,180,200,1)", ctx.fillRect(0, 0, sw, sh);
        for (var j = 0; j < dots; j++) {
            var dot = arrDots[j];
            dot.move(), dot.draw();
            for (var k = 0; k < j; k++) {
                var lineId = uniqueId(j, k), other = arrDots[k], dx = dot.x - other.x, dy = dot.y - other.y, inRange = (d = Math.sqrt(dx * dx + dy * dy)) < range;
                (other.x < 0 || 1 < other.x || other.y < 0 || 1 < other.y) && (inRange = !1), inRange ? (dot.force(other, d, dx, dy), 
                other.force(dot, d, dx, dy), lines[lineId].lineWidth -= .01 * (lines[lineId].lineWidth - 3)) : (lines[lineId].lineWidth *= .9, 
                lines[lineId].lineWidth < .1 && (lines[lineId].lineWidth = 0));
            }
        }
        for (var m = 0, ml = lines.length; m < ml; m++) {
            var lineM = lines[m];
            if (pointsM = lineM.points, a = arrDots[pointsM[0]], b = arrDots[pointsM[1]], lineM.lineWidth) {
                for (k = 0; k < m; k++) {
                    var lineK = lines[k];
                    if (lineK.lineWidth) {
                        var pointsK = lineK.points, c = arrDots[pointsK[0]], d = arrDots[pointsK[1]], intersects = geom.intersectionBetweenPoints(a, b, c, d);
                        intersects && debugCircle(intersects, lineM.colour);
                    }
                }
                drawLine(a, b, lineM);
            }
        }
        requestAnimationFrame(render);
    }
    function drawLine(a, b, line) {
        0 < line.lineWidth && (ctx.save(), ctx.beginPath(), ctx.lineWidth = line.lineWidth, 
        ctx.strokeStyle = line.colour, 2 < line.dashes && ctx.setLineDash([ line.dashes ]), 
        ctx.lineCap = "round", ctx.moveTo(a.x * sw, a.y * sh), ctx.lineTo(b.x * sw, b.y * sh), 
        ctx.stroke(), ctx.restore());
    }
    function debugCircle(dot, colour) {
        ctx.beginPath(), ctx.fillStyle = colour, ctx.drawCircle(dot.x * sw, dot.y * sh, 3), 
        ctx.fill();
    }
    return {
        stage: bmp.canvas,
        resize: function(w, h) {
            sw = w, sh = h, bmp.canvas.width = sw, bmp.canvas.height = sh;
        },
        init: function() {
            for (var j = 0; j < dots; ) arrDots[j] = {
                x: Math.random(),
                y: Math.random(),
                fx: 0,
                fy: 0,
                vx: .001 * Math.random(),
                vy: .001 * Math.random(),
                dir: Math.random() * Math.PI * 2,
                dirFloat: 0,
                rotation: 0,
                rotationFloat: 0,
                type: ~~(2 * Math.random()),
                bmp: null,
                size: 0,
                generate: function() {
                    this.size = 6 + ~~(20 * Math.random());
                    var bmp = dom.canvas(this.size, this.size), ctx = bmp.ctx;
                    switch (this.type) {
                      case 0:
                        var lineWidth = 2 * Math.random(), radius = this.size / 2 - lineWidth;
                        ctx.beginPath(), ctx.lineWidth = lineWidth, ctx.strokeStyle = white(), ctx.drawCircle(this.size / 2, this.size / 2, radius), 
                        ctx.stroke(), radius *= Math.random(), ctx.beginPath(), ctx.fillStyle = white(), 
                        ctx.drawCircle(this.size / 2, this.size / 2, radius), ctx.fill();
                        break;

                      case 1:
                        var sides = 3 + ~~(7 * Math.random());
                        ctx.beginPath(), ctx.lineWidth = 2, ctx.strokeStyle = white(), ctx.drawCircle(this.size / 2, this.size / 2, radius - 1);
                        for (var i = 0; i < sides; i++) {
                            var angle = i / sides * Math.PI * 2, xp = this.size / 2 + this.size / 2 * .8 * Math.cos(angle), yp = this.size / 2 + this.size / 2 * .8 * Math.sin(angle);
                            0 == i ? ctx.moveTo(xp, yp) : ctx.lineTo(xp, yp);
                        }
                        ctx.closePath(), ctx.stroke();
                    }
                    this.bmp = bmp;
                },
                draw: function() {
                    null == this.bmp && this.generate(), ctx.save(), ctx.translate(this.x * sw, this.y * sh), 
                    ctx.rotate(this.rotation), ctx.drawImage(this.bmp.canvas, -this.size / 2, -this.size / 2), 
                    ctx.restore();
                },
                attraction: -1e-5,
                speed: 1e-4,
                friction: .9,
                move: function() {
                    this.rotationFloat += .5 * (.5 < Math.random() ? -1 : 1), this.rotation -= .01 * (this.rotation - this.rotationFloat), 
                    this.dirFloat += .1 * (.5 < Math.random() ? -1 : 1), this.dir -= .01 * (this.dir - this.dirFloat), 
                    this.vx += Math.sin(this.dir) * this.speed + this.fx, this.vy += Math.cos(this.dir) * this.speed + this.fy, 
                    this.vx *= this.friction, this.vy *= this.friction, this.x += this.vx, this.y += this.vy, 
                    this.x < -.2 && (this.x = 1.2), 1.2 < this.x && (this.x = -.2), this.y < -.2 && (this.y = 1.2), 
                    1.2 < this.y && (this.y = -.2);
                },
                force: function(opposite, distance, deltaX, deltaY) {
                    this.fx = deltaX / distance * this.attraction, this.fy = deltaY / distance * this.attraction;
                }
            }, j++;
            render();
            var isDown = !1, mouseTarget = null;
            addEventListener("mousedown", function(e) {
                isDown = !0;
                for (var mx = e.x / sw, my = e.y / sh, k = 0; k < dots; k++) {
                    var dot = arrDots[k], dx = dot.x - mx, dy = dot.y - my;
                    if (Math.sqrt(dx * dx + dy * dy) < .1) {
                        ctx.beginPath(), ctx.fillStyle = "red", ctx.drawCircle(dot.x * sw, dot.y * sh, 20), 
                        ctx.fill(), mouseTarget = k;
                        break;
                    }
                }
            }), addEventListener("mouseup", function(e) {
                isDown = !1, mouseTarget = null;
            }), addEventListener("mousemove", function(e) {
                if (isDown && null != mouseTarget) {
                    var mx = e.x / sw, my = e.y / sh;
                    arrDots[mouseTarget].x = mx, arrDots[mouseTarget].y = my;
                }
            });
        },
        kill: function() {}
    };
};

(isNode = "undefined" != typeof module) ? module.exports = meandering_polygons() : define("meandering_polygons", meandering_polygons);

var mining_branches = function() {
    var bmp, fgColour = colours.getRandomColour(), bgColour = colours.getNextColour(), planets = 200, size = 400;
    var canvases = dom.element("div");
    return {
        stage: canvases,
        resize: function(sw, sh) {},
        init: function() {
            for (;canvases.childNodes.length; ) canvases.removeChild(canvases.childNodes[0]);
            seed = ~~(1e9 * rand.random()), colours.getRandomPalette(), fgColour = colours.getRandomColour(), 
            bgColour = colours.getNextColour(), function(scale) {
                var sw = size * scale, sh = sw;
                (bmp = dom.canvas(sw, sh)).canvas.setSize(sw / scale, sh / scale);
                var i, j, lastPlanet, ctx = bmp.ctx, cx = (Math.PI, .5), cy = .5, arrPlanets = [], arrRings = [ [] ], ringIndex = 0, diameter = .01, ringSize = .01, rotation = 0, attempts = 0, settings = {
                    increaseMutation: .5 < rand.random(),
                    drawNodes: .5 < rand.random(),
                    straight: .5 < rand.random(),
                    megaNodes: .5 < rand.random(),
                    megaSubNodes: .5 < rand.random(),
                    constantMegaNodeSize: .5 < rand.random(),
                    constantMegaSubNodeSize: .5 < rand.random()
                };
                function createPlanet(index, planet) {
                    planet.index = index, lastPlanet = planet, arrPlanets[index] = planet, arrRings[ringIndex].push(planet);
                }
                function newPlanet(index) {
                    var planet = {
                        x: cx + Math.sin(rotation) * diameter + .05 * (rand.random() - .5),
                        y: cy + Math.cos(rotation) * diameter + .05 * (rand.random() - .5),
                        rotation: rotation,
                        distance: diameter
                    }, ok = !0, lastDistance = 1e7;
                    for (i = arrPlanets.length - 1; -1 < i && ok; ) {
                        var other = arrPlanets[i], dx = planet.x - other.x, dy = planet.y - other.y, distance = Math.sqrt(dx * dx + dy * dy);
                        distance < .04 ? ok = !1 : (lastDistance = Math.min(distance, lastDistance)) == distance && (planet.closest = arrPlanets[i]), 
                        i--;
                    }
                    planet.x == lastPlanet.x && planet.y == lastPlanet.y && (ok = !1), ok ? (attempts = 0, 
                    settings.increaseMutation ? planet.mutationRate = 1.04 * planet.closest.mutationRate : planet.mutationRate = .9 * planet.closest.mutationRate, 
                    planet.colour = colours.mutateColour(planet.closest.colour, planet.mutationRate), 
                    createPlanet(index, planet)) : (attempts < 40 ? rotation += 20 * rand.random() + Math.atan(1 / diameter) : (arrRings[++ringIndex] = [], 
                    diameter += rand.random() * ringSize + .0025), attempts++, newPlanet(index));
                }
                function drawNode(planet, xp, yp) {
                    var closest = planet.closest, colour = closest ? closest.colour : planet.colour, size = 1 - planet.distance;
                    if (settings.drawNodes) {
                        var radius = size * scale * 5;
                        ctx.beginPath(), ctx.fillStyle = colour, ctx.drawCircle(planet.x * sw, planet.y * sh, radius), 
                        ctx.fill();
                    }
                    if (closest) {
                        if (ctx.beginPath(), ctx.lineWidth = Math.pow(1.1, 6 * size) * scale, ctx.strokeStyle = colour, 
                        ctx.lineCap = "round", ctx.moveTo(xp * sw, yp * sh), settings.straight) ctx.lineTo(closest.x * sw, closest.y * sh); else if (closest.closest) {
                            var phx = closest.x + (closest.closest.x - closest.x) / 2, phy = closest.y + (closest.closest.y - closest.y) / 2, nx = closest.x + (closest.x - phx), ny = closest.y + (closest.y - phy);
                            ctx.quadraticCurveTo(nx * sw, ny * sh, closest.x * sw, closest.y * sh);
                        } else {
                            var hx = closest.x + (xp - closest.x) / 2, hy = closest.y + (yp - closest.y) / 2;
                            ctx.quadraticCurveTo(hx * sw, hy * sh, closest.x * sw, closest.y * sh);
                        }
                        ctx.stroke();
                    }
                }
                function drawInnerNode(planet, xp, yp) {
                    var radius = (1 - planet.distance) * scale * 5;
                    settings.megaNodes && (ctx.beginPath(), ctx.fillStyle = bgColour, ctx.drawCircle(planet.x * sw, planet.y * sh, .7 * radius * (settings.constantMegaNodeSize ? 1 : rand.random())), 
                    ctx.fill(), settings.megaSubNodes && .5 < rand.random() && (ctx.beginPath(), ctx.fillStyle = planet.colour, 
                    ctx.drawCircle(planet.x * sw, planet.y * sh, .9 * radius * (settings.constantMegaSubNodeSize ? 1 : rand.random())), 
                    ctx.fill()));
                }
                for (createPlanet(0, {
                    x: cx,
                    y: cy,
                    distance: 0,
                    rotation: 0,
                    colour: fgColour,
                    mutationRate: 10
                }), j = 1; j < planets; ) newPlanet(j), j++;
                !function() {
                    ctx.fillStyle = bgColour, ctx.fillRect(0, 0, sw, sh);
                    for (var j = arrPlanets.length - 1; -1 < j; ) drawNode(planet = arrPlanets[j], planet.x, planet.y), 
                    j--;
                    if (settings.megaNodes) for (j = arrPlanets.length - 1; -1 < j; ) {
                        var planet;
                        drawInnerNode(planet = arrPlanets[j], planet.x, planet.y), j--;
                    }
                }(), canvases.appendChild(bmp.canvas);
            }(1);
        }
    };
};

isNode ? module.exports = mining_branches() : define("mining_branches", mining_branches);

var render, _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
}, fs = (con = console, dom = require("./dom.js"), require("fs")), centre = (size = 300) / 2, gridY = 12, gridX = 4 * gridY, thirty = Math.PI / 6, sinThirty = Math.sin(thirty), cosThirty = Math.cos(thirty), c = dom.canvas(size, size), unit = (ctx = c.ctx, 
90), saveFile = function(canvas, frame, cb) {
    var filename = "/../export/" + (1 == String(frame).length ? "0" : "") + frame + ".png";
    canvas.toBuffer(function(err, buf) {
        err ? con.log("saveFile err", err) : fs.writeFile(__dirname + filename, buf, function() {
            con.log("saveFile success", void 0 === buf ? "undefined" : _typeof(buf), __dirname + filename), 
            cb();
        });
    });
}, draw = function(x, y) {
    var drawLeaf = function(angle) {
        ctx.save(), ctx.translate(x, y), ctx.rotate(angle), ctx.beginPath(), ctx.moveTo(0, 0), 
        ctx.lineTo(sinThirty * unit, cosThirty * unit), ctx.lineTo(0, cosThirty * unit * 2), 
        ctx.lineTo(-sinThirty * unit, cosThirty * unit), ctx.closePath(), ctx.fill(), ctx.restore();
    };
    drawLeaf(1 * thirty), drawLeaf(5 * thirty), drawLeaf(9 * thirty);
}, frames = 32, loops = 3;

(render = function render(frame) {
    var scale = Math.sin(frame / frames * Math.PI * 2 - Math.PI / 2) + 1.98;
    unit = 51;
    var angle = Math.floor(frame / frames) * Math.PI * 2 / 3 / 4;
    ctx.fillStyle = "#000", ctx.fillRect(0, 0, size, size), ctx.fillStyle = "#d11", 
    ctx.save(), ctx.translate(centre, centre), ctx.rotate(angle), ctx.translate(-centre, -centre);
    for (var gx = 0; gx++ < gridX; ) for (var gy = 0; gy++ < gridY; ) {
        draw(centre + (gx - gridX / 2) * cosThirty * unit * scale, centre + (gx % 2 * 3 + 6 * (gy - gridY / 2)) * sinThirty * unit * scale);
    }
    ctx.restore(), saveFile(c.canvas, frame, function() {
        ++frame < frames * loops && render(frame);
    });
})(0);

var molecular_three = function() {
    var camera, scene, renderer, mouse = {
        x: 0,
        y: 0
    }, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    function num(min, max) {
        return Math.random() * (max - min) + min;
    }
    var segmentLastCreated, holder, segmentCreationInterval = 0, segmentLengthInitial = 50, segmentLength = segmentLengthInitial, segmentRadius = num(4, 15), sphereRadius = segmentRadius * num(1, 3), branchingAngle = num(0, 10), vectors = [], generationComplete = !1, attempts = 0, bail = 300, renderMessage = dom.element("div", {
        innerHTML: "rendering",
        style: {
            color: "white",
            position: "absolute",
            top: "10px",
            width: "100%",
            textAlign: "center"
        }
    });
    function sphere(props) {
        var material = new THREE.MeshLambertMaterial({
            color: props.colour
        }), geometry = new THREE.SphereGeometry(props.radius, 10, 10);
        return new THREE.Mesh(geometry, material);
    }
    function cylinder(props) {
        var group = new THREE.Group(), material = new THREE.MeshLambertMaterial({
            color: props.colour
        }), geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 15), object = new THREE.Mesh(geometry, material);
        return object.position.y = props.height / 2, group.add(object), {
            colour: props.colour,
            group: group,
            object: object
        };
    }
    function getSectionEnd(cylinder) {
        var numVertices = cylinder.object.geometry.vertices.length, end = cylinder.object.geometry.vertices[numVertices - 2];
        return new THREE.Vector3(end.x + cylinder.object.position.x, end.y + cylinder.object.position.y, end.z + cylinder.object.position.z);
    }
    function render(time) {
        generationComplete && (holder.rotation.y += .01), camPos.z = 1e3, camera.position.set(camPos.x, camPos.y, camPos.z), 
        camera.lookAt(scene.position), renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            colours.getRandomPalette(), (scene = new THREE.Scene()).fog = new THREE.FogExp2(0, .0015), 
            camera = new THREE.PerspectiveCamera(80, sw / sh, 1, 1e4), scene.add(camera);
            var lightAbove = new THREE.DirectionalLight(16777215, 1.5);
            lightAbove.position.set(0, 200, 100), scene.add(lightAbove);
            var lightLeft = new THREE.DirectionalLight(16777215, 4);
            function checkDistance(reference) {
                var globalPosition = new THREE.Vector3();
                globalPosition.setFromMatrixPosition(reference.matrixWorld);
                for (var st = new Date().getTime(), distanceOk = !0, i = 0, il = vectors.length; i < il && distanceOk; i++) globalPosition == vectors[i] && con.log("same one", globalPosition, vectors[i]), 
                globalPosition.distanceTo(vectors[i]) < segmentLength - 5 && (distanceOk = !1);
                var proc = new Date().getTime() - st;
                return 3 < proc && con.warn("proc time = ", proc), {
                    vector: globalPosition,
                    ok: distanceOk
                };
            }
            function drawSection(parent, endPoint) {
                var colour = colours.mutateColour(parent.colour, 50), child = cylinder({
                    radius: segmentRadius,
                    height: segmentLength,
                    colour: colour
                });
                child.group.position.set(endPoint.x, endPoint.y, endPoint.z), child.group.rotation.z = 2 * num(-.5, .5) * Math.PI * attempts / bail * branchingAngle, 
                child.group.rotation.y = num(0, 2) * Math.PI;
                var end = getSectionEnd(child), endSphere = sphere({
                    radius: 3,
                    colour: 16711680
                });
                endSphere.position.set(end.x, end.y, end.z), child.group.add(endSphere), parent.group.add(child.group), 
                parent.group.updateMatrixWorld();
                var distance = checkDistance(endSphere);
                if (child.group.remove(endSphere), distance.ok) {
                    vectors.push(distance.vector);
                    var s = sphere({
                        radius: sphereRadius,
                        colour: colour
                    });
                    return s.position.set(distance.vector.x, distance.vector.y, distance.vector.z), 
                    holder.add(s), child;
                }
                return child.group.remove(endSphere), parent.group.remove(child.group), null;
            }
            function addSection(parent) {
                if (segmentLength = (2 - ++attempts / bail) * segmentLengthInitial / 2, attempts < bail) {
                    renderMessage.innerHTML = "Rendering " + Math.round(attempts / bail * 100) + "%";
                    for (var endPoint = getSectionEnd(parent), kids = parseInt(num(1, 3)), i = 0; i < kids; i++) {
                        var newSection = drawSection(parent, endPoint);
                        newSection && (segmentLastCreated = new Date().getTime(), function(a, p) {
                            setTimeout(function() {
                                generationComplete ? con.log("wanted to created another, but time out...") : addSection(p);
                            }, 10 * attempts);
                        }(0, newSection));
                    }
                } else generationComplete = !0, renderMessage && document.body.removeChild(renderMessage), 
                renderMessage = null;
            }
            lightLeft.position.set(-100, 0, 100), scene.add(lightLeft), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder), segmentCreationInterval = setInterval(function() {
                3e3 < new Date().getTime() - segmentLastCreated && (con.log("more than 3 seconds... bailing!"), 
                generationComplete = !0, clearInterval(segmentCreationInterval));
            }, 500);
            for (var seeds = parseInt(num(10, 50)), colour = colours.getRandomColour(), j = 0; j < seeds; j++) {
                var baseSection = cylinder({
                    radius: segmentRadius,
                    height: segmentLength,
                    colour: colour
                });
                baseSection.group.rotation.set(num(0, 2) * Math.PI, num(0, 2) * Math.PI, num(0, 2) * Math.PI), 
                holder.add(baseSection.group);
                var end = getSectionEnd(baseSection), endSphere = sphere({
                    radius: sphereRadius,
                    colour: colour
                });
                endSphere.position.set(end.x, end.y, end.z), baseSection.group.add(endSphere), baseSection.group.updateMatrixWorld();
                var distance = checkDistance(endSphere);
                distance.ok ? (vectors.push(distance.vector), addSection(baseSection)) : (baseSection.group.remove(endSphere), 
                holder.remove(baseSection.group));
            }
            function listen(eventNames, callback) {
                for (var i = 0; i < eventNames.length; i++) window.addEventListener(eventNames[i], callback);
            }
            document.body.appendChild(renderer.domElement), document.body.appendChild(renderMessage), 
            listen([ "resize" ], function(e) {
                sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
                renderer.setSize(sw, sh);
            }), listen([ "mousemove", "touchmove" ], function(e) {
                e.preventDefault(), e.changedTouches && e.changedTouches[0] && (e = e.changedTouches[0]), 
                mouse.x = e.clientX / sw * 2 - 1, mouse.y = -e.clientY / sh * 2 + 1;
            }), render();
        },
        resize: function() {}
    };
};

define("molecular_three", molecular_three);

var posJump;

_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(obj) {
    return typeof obj;
} : function(obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

(isNode = "undefined" != typeof module) ? (con = console, dom = require("./dom.js"), 
geom = require("./geom.js"), rand = require("./rand.js"), Ease = require("../lib/robertpenner/ease.js"), 
progress = function() {
    return fs = require("fs");
}, saveFile = function(canvas, frame, cb) {
    var filename = "/../export/" + (1 == String(frame).length ? "0" : "") + frame + ".png";
    canvas.toBuffer(function(err, buf) {
        err ? con.log("saveFile err", err) : fs.writeFile(__dirname + filename, buf, function() {
            con.log("saveFile success", void 0 === buf ? "undefined" : _typeof(buf), __dirname + filename), 
            cb();
        });
    });
}, posJump = .02) : posJump = .005;

var nested_rotating_polygon = function() {
    var size, sides, depthMax, TAU = 2 * Math.PI, bmp = dom.canvas(1, 1), ctx = bmp.ctx, pos = 0, half = 0, BLACK = "#000", WHITE = "#fff", frame = 0;
    function render() {
        frame++, ctx.fillStyle = depthMax % 2 ? BLACK : WHITE, ctx.fillRect(0, 0, size, size), 
        function create(parent) {
            var depth = parent.depth + 1;
            var points = [];
            if (parent.points) {
                var progress = Ease.easeInOutQuart(pos, 0, 1, 1) + half;
                for (i = 0; i < sides; i++) {
                    var point0 = parent.points[i], point1 = parent.points[(i + 1) % sides], p = geom.lerp({
                        x: point0.x,
                        y: point0.y
                    }, {
                        x: point1.x,
                        y: point1.y
                    }, progress / 2), xp = p.x, yp = p.y;
                    points.push(p);
                }
            } else for (i = 0; i < sides; i++) {
                var angle = i / sides * TAU + TAU / 4, xp = size / 2 + size / 2 * .98 * Math.cos(angle), yp = size / 2 + size / 2 * .98 * Math.sin(angle);
                points.push({
                    x: xp,
                    y: yp
                });
            }
            ctx.fillStyle = depth % 2 ? BLACK : WHITE;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.strokeStyle = "0";
            for (var i = 0; i < sides; i++) {
                var xp = points[i].x, yp = points[i].y;
                0 == i ? ctx.moveTo(xp, yp) : ctx.lineTo(xp, yp);
            }
            ctx.closePath();
            depth === depthMax && ctx.stroke();
            ctx.fill();
            depth < depthMax && create({
                depth: depth,
                points: points
            });
        }({
            depth: 0
        }), 1 <= (pos += posJump) && (pos = 0, half++, half %= 2), isNode ? saveFile(bmp.canvas, frame, function() {
            frame < 1 / posJump * 2 ? render() : con.log("stopping - frame:", frame, "pos:", pos);
        }) : requestAnimationFrame(render);
    }
    return {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size, bmp.setSize(size, size), sides = 3, depthMax = 6, progress("render:complete", bmp.canvas), 
            render();
        }
    };
};

isNode ? (module.exports = exp = nested_rotating_polygon(), con.log(exp), exp.init({
    size: 700
})) : define("nested_rotating_polygon", nested_rotating_polygon);

sw = 600, sh = 600;

function genRan(min, max) {
    return Math.random() * (max - min) + min;
}

var o, oscs = [], oscillators = 15;

for (o = 0; o < oscillators; o++) oscs[o] = [], oscs[o][0] = genRan(0, .1), oscs[o][1] = genRan(0, .1), 
oscs[o][2] = genRan(0, .1), oscs[o][3] = genRan(0, .1);

function getOsc(i, a, range) {
    var temp = 0;
    for (o = 0; o < oscillators; o++) temp += Math.sin(i * oscs[o][a]) * range;
    return temp /= oscillators;
}

var bmp = dom.canvas(sw, sh);

document.body.appendChild(bmp.canvas);

h = 0;

var xRange = 30, yRange = 30, xGap = sw / xRange * 1, yGap = sh / yRange * 1, xHalf = xRange / 2, yHalf = yRange / 2;

frame = 0;

function newLine() {
    bmp.ctx.clearRect(0, 0, sw, sh);
    for (var h = 0; h < yRange; h++) for (var v = 0; v < xRange; v++) {
        0;
        var xyIndex = v + h, xy = frame + xyIndex, xpos = (v + .5) * xGap + getOsc(xy, 2, 15), ypos = (h + .5) * yGap + getOsc(xy, 3, 15);
        bmp.ctx.fillStyle = "#000", bmp.ctx.fillText(Math.round(xyIndex), xpos - 2, ypos - 2);
    }
    (frame += 1) < 5e9 && requestAnimationFrame(newLine);
}

newLine(), define("oscillator", function() {
    var h, yo, sw = window.innerWidth, sh = window.innerHeight, bg = (colours.getRandomPalette(), 
    colours.getRandomColour()), fg = colours.getNextColour(), canvas = dom.canvas(sw, sh), ctx = canvas.ctx, circleSize = 1, oscRange = 10, range = Math.ceil(200), xGap = sw / range, yGap = sh / range, oscs = [], oscillators = 10;
    function getOsc(i, a, range) {
        for (var temp = 0, o = 0; o < oscillators; o++) 0, temp += Math.sin(i * oscs[o][a]) * range;
        return temp;
    }
    var start = rand.getInteger(0, 1e6);
    return {
        init: function() {
            !function() {
                for (var o = 0; o < oscillators; o++) oscs[o] = [], oscs[o][0] = rand.getNumber(0, .1), 
                oscs[o][1] = rand.getNumber(0, .1), oscs[o][2] = rand.getNumber(0, .1), oscs[o][3] = rand.getNumber(0, .1);
            }(), function(time) {
                ctx.fillStyle = bg, ctx.fillRect(0, 0, sw, sh), ctx.fillStyle = fg, h = .02 * time;
                for (var rows = yo = 0; rows < range; ) {
                    for (var i = 0; i < range; i++) {
                        var t = start + i, j = getOsc(t, 0, oscRange), k = getOsc(t, 1, oscRange), l = getOsc(t + h, 2, oscRange), m = getOsc(t - h, 3, oscRange), xp = l + j + xGap * i, yp = m + k + yo;
                        ctx.beginPath(), ctx.drawCircle(xp, yp, circleSize), ctx.fill();
                    }
                    h += .4, yo += yGap, rows++;
                }
            }(0);
        },
        stage: canvas.canvas
    };
});

var overflow = function() {
    var sw, TAU = 2 * Math.PI, stage = dom.canvas(1, 1), ctx = stage.ctx, polys = [];
    function createPolygon() {
        for (var poly = {
            colour: colours.getRandomColour(),
            points: []
        }, sides = rand.getInteger(3, 17), radius = rand.getNumber(.1, .4), cx = rand.getNumber(0, 1), cy = rand.getNumber(0, 1), i = 0; i < sides; i++) {
            var angle = i / sides * TAU, x = cx + Math.sin(angle) * radius, y = cy + Math.cos(angle) * radius;
            poly.points.push({
                x: x,
                y: y
            });
        }
        polys.push(poly);
    }
    var experiment = {
        stage: stage.canvas,
        init: function(options) {
            size = options.size, sw = options.sw || size, sh = options.sh || size, stage.setSize(sw, sh), 
            colours.getRandomPalette(), createPolygon(), createPolygon(), polys.forEach(function(poly) {
                ctx.strokeStyle = poly.colour, ctx.beginPath(), poly.points.forEach(function(_ref, i) {
                    var x = _ref.x, y = _ref.y, xs = x * sw, ys = y * sh;
                    i ? ctx.lineTo(xs, ys) : ctx.moveTo(xs, ys), con.log(xs, ys);
                }), ctx.closePath(), ctx.stroke();
            });
        }
    };
    return progress("render:complete", stage.canvas), experiment;
};

(isNode = "undefined" != typeof module) ? module.exports = overflow() : define("overflow", overflow);

sw = window.innerWidth, sh = window.innerHeight, ctx = (bmp = dom.canvas(sw, sh)).ctx;

var patternMonochrome, patternColoured, widths, pallete, palettePreview, preview, title, dot = 2, rotation = 0;

container = dom.element("div", {
    className: "container",
    style: {
        width: sw + "px",
        height: sh + "px"
    }
});

function newSize() {
    size = 10 * Math.ceil(10 * Math.random());
}

function newStripes() {
    var lines = 2 + ~~(5 * Math.random());
    for (widths = [ 0 ]; widths.length < lines; ) widths.push(2 * Math.ceil(1 + Math.random() * (size - 1) / 2));
    widths.push(size);
    var noDuplicates = [];
    widths.map(function(a, i) {
        widths.indexOf(a) == i && noDuplicates.push(a);
    }), widths = noDuplicates.sort(function(a, b) {
        return a < b ? -1 : 1;
    });
}

function newPalette() {
    colours.getRandomPalette(), palettePreview && (container.removeChild(palettePreview), 
    palettePreview.removeEventListener("click", changePalette)), (palettePreview = colours.showPalette()).addEventListener("click", changePalette), 
    container.appendChild(palettePreview);
}

function newColours() {
    palette = [];
    for (var attempts = 0; palette.length < widths.length - 1; ) {
        var newColour = colours.getRandomColour();
        (-1 == palette.indexOf(newColour) || 100 < attempts) && palette.push(newColour), 
        attempts++;
    }
}

function reset() {
    newSize(), newStripes(), newPalette(), newColours(), render();
}

function changeStripes() {
    newStripes(), newColours(), render();
}

function changeSize(size) {
    dot = size, render();
}

function changeRotation() {
    rotation += Math.PI / 4, render();
}

function changePalette() {
    newPalette(), newColours(), render();
}

function render() {
    patternColoured = dom.canvas(size * dot, size * dot), patternMonochrome && patternDetails.removeChild(patternMonochrome.canvas), 
    patternMonochrome = dom.canvas(size * dot, size * dot);
    for (var colourMonochrome = [ [ "#666", "#aaa" ], [ "#333", "#888" ] ], i = 0; i < widths.length - 1; i++) for (var x = widths[i], w = widths[i + 1] - x, colourColumn = palette[i], monoColumn = colourMonochrome[0][i % 2], j = 0; j < widths.length - 1; j++) for (var y = widths[j], h = widths[j + 1] - y, colourRow = palette[j], monoRow = colourMonochrome[1][j % 2], px = 0; px < w; px++) for (var py = 0; py < h; py++) patternColoured.ctx.fillStyle = (px + py) % 2 == 0 ? colourColumn : colourRow, 
    patternColoured.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot), patternMonochrome.ctx.fillStyle = (px + py) % 2 == 0 ? monoColumn : monoRow, 
    patternMonochrome.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot);
    patternDetails.appendChild(patternMonochrome.canvas), ctx.save(), ctx.rect(0, 0, sw, sh), 
    ctx.rotate(rotation), ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat"), 
    ctx.fill(), ctx.restore();
}

document.body.appendChild(container), container.appendChild(bmp.canvas);

var buttonsTop = dom.element("div", {
    className: "buttons top"
});

container.appendChild(buttonsTop);

var buttonsBottom = dom.element("div", {
    className: "buttons bottom"
});

container.appendChild(buttonsBottom);

var patternDetails = dom.element("div", {
    className: "pattern"
});

container.appendChild(patternDetails), patternDetails.addEventListener("click", changeStripes);

var buttonExport = dom.button("get css", {
    className: "button export"
});

function save(canvas, type) {
    var dataURL = canvas.toDataURL("image/jpeg"), filename = "check_" + type + "_" + (1e9 * Math.random() << 0).toString(16) + "-.jpg";
    dom.element("a", {
        href: dataURL,
        download: filename
    }).click();
}

buttonExport.addEventListener("click", function(e) {
    var img = patternColoured.canvas.toDataURL("image/jpeg");
    if (void 0 === preview) {
        preview = dom.element("div", {
            className: "preview"
        });
        var title = dom.element("div", {
            className: "title",
            innerHTML: "And the CSS..."
        });
        preview.appendChild(title);
        var close = dom.button("close", {
            className: "close"
        });
        close.addEventListener("click", function(e) {
            container.removeChild(preview);
        }), preview.appendChild(close), preview.css = dom.element("div", {
            className: "css"
        }), preview.appendChild(preview.css);
    }
    container.appendChild(preview);
    var r = "rotate(" + rotation + "rad)", cssArr = [ "background-image: url(" + img + ");", "background-repeat: repeat;", "-webkit-transform: " + r + ";", "-moz-transform: " + r + ";", "-ms-transform: " + r + ";", "-o-transform: " + r + ";", "transform: " + r + ";" ];
    preview.css.innerHTML = cssArr.join("<br>");
}), buttonsTop.appendChild(buttonExport);

var buttonSaveOne = dom.button("pattern image", {
    className: "button"
});

buttonSaveOne.addEventListener("click", function(e) {
    save(patternColoured.canvas, "pattern");
}), buttonsTop.appendChild(buttonSaveOne);

var buttonSaveTiled = dom.button("tiled image", {
    className: "button"
});

buttonSaveTiled.addEventListener("click", function(e) {
    save(bmp.canvas, "tiled");
}), buttonsTop.appendChild(buttonSaveTiled);

var sizes = [ 1, 2, 3, 4 ];

for (var s in sizes) {
    var size = sizes[s], buttonSize = dom.button(size + "x", {
        className: "button",
        size: size
    });
    buttonSize.addEventListener("click", function() {
        changeSize(this.size);
    }), buttonsBottom.appendChild(buttonSize);
}

var buttonRotation = dom.button("rotation", {
    className: "button"
});

buttonRotation.addEventListener("click", function() {
    changeRotation();
}), buttonsBottom.appendChild(buttonRotation), bmp.canvas.addEventListener("click", reset), 
window.addEventListener("resize", function() {
    bmp.canvas.width = sw = window.innerWidth, bmp.canvas.height = sh = window.innerHeight, 
    container.setSize(sw, sh), render();
}), reset();

var pattern_circles = function() {
    var sw, sh, circles, colourBG, rotation, bmp = dom.canvas(1, 1), ctx = bmp.ctx;
    return {
        stage: bmp.canvas,
        init: function(options) {
            size = options.size;
            var cx = (sw = size) / 2, cy = (sh = size) / 2;
            bmp.setSize(sw, sh), ctx.clearRect(0, 0, sw, sh), ctx.fillRect(cx - 2, cy - 2, 4, 4), 
            rotation = Math.random() * Math.PI / 2;
            for (var size = 10 + ~~(50 * Math.random()), lines = 2 + ~~(5 * Math.random()), widths = []; widths.length < lines; ) widths.push(Math.ceil(Math.random() * size));
            widths.push(size);
            var noDuplicates = [];
            widths.map(function(a, i) {
                widths.indexOf(a) == i && noDuplicates.push(a);
            }), widths = noDuplicates.sort(function(a, b) {
                return a < b ? -1 : 1;
            }), colours.getRandomPalette();
            for (var palette = []; palette.length < widths.length; ) palette.push(colours.getRandomColour());
            colourBG = colours.getRandomColour(), con.log("colourBG", colourBG);
            var patternSize = size + size * Math.random();
            circles = dom.canvas(patternSize, patternSize), document.body.appendChild(circles.canvas);
            for (var i = widths.length - 1; -1 < i; i--) {
                var radius = widths[i], colour = palette[i];
                circles.ctx.beginPath(), circles.ctx.fillStyle = colour, circles.ctx.drawCircle(size / 2, size / 2, radius / 2), 
                circles.ctx.fill(), circles.ctx.closePath(), con.log(i);
            }
            con.log("render"), ctx.save(), ctx.fillStyle = colourBG, ctx.rect(0, 0, sw, sh), 
            ctx.fill(), ctx.rotate(rotation), ctx.fillStyle = ctx.createPattern(circles.canvas, "repeat"), 
            ctx.fill(), ctx.restore(), progress("render:complete", bmp.canvas);
        }
    };
};

(isNode = "undefined" != typeof module) ? module.exports = pattern_circles() : define("pattern_circles", pattern_circles);

var perlin = function() {
    return {
        noise: function(w, h) {
            var s, u, v, r = Math.random;
            function z(uIndex, k, t, j) {
                var F = .5 - t * t - j * j;
                try {
                    var zz = F < 0 ? 0 : Math.pow(F, 4) * (s[k % 8][0] * t + s[k % 8][1] * j);
                } catch (err) {
                    con.log(err, k, uIndex);
                }
                return zz;
            }
            return function() {
                s = [], u = [], v = [];
                for (var i = 0; i < 8; i++) s.push([]), v.push([ r(), r() ]);
                for (i = 0; i < 262; i++) u.push(~~(256 * r()));
            }(), {
                cycle: function(time, scale) {
                    for (var i = 0; i < 8; i++) s[i][0] = Math.sin(v[i][0] * time), s[i][1] = Math.cos(v[i][1] * time);
                    for (var k, t, a, m, b, c, j, C, u0, u1, u2, channel = [], il = (i = 0, w * h); i < il; i++) {
                        var xp = i % w * scale, yp = Math.floor(i / w) * scale;
                        channel.push((a = void 0, c = (k = xp) - ((m = ~~(k + (a = .3 * (k + (t = yp))))) - (a = .2 * (m + (b = ~~(t + a))))), 
                        C = (j = t - (b - a)) < c, u0 = m + u[b], u1 = m + C + u[b + !C], u2 = m + 1 + u[b + 1], 
                        38 * (z(u0, u[u0], c, j) + z(u1, u[u1], c - C + .2, j - !C + .2) + z(u2, u[u2], c - .6, j - .6)) + .5));
                    }
                    return channel;
                }
            };
        }
    };
};

define("perlin", perlin);

var vertexShader = "varying vec2 vUv;\nvoid main()\n{\n  vUv = uv;\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  gl_Position = projectionMatrix * mvPosition;\n}", fragmentShader = "\nuniform float r;\nuniform float g;\nuniform float b;\nuniform float distance;\nuniform float pulse;\nuniform float rows;\nuniform float cols;\nvarying vec2 vUv;\nfloat checkerRows = 1.5;\nfloat checkerCols = 2.0;\nvoid main( void ) {\n  vec2 position = abs(-1.0 + 2.0 * vUv);\n\n  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 1.0);\n\n  float perc = 0.25 + distance * edging * 0.75;\n  vec2 checkPosition = vUv;\n  \n  float checkerX = mod(checkPosition.x, 1.0 / rows) * rows; // loop of 0 to 1 per row: /|/|/|//\n  checkerX = abs(checkerX - 0.5) * 2.0; // make up and down: /// \n  checkerX = pow(checkerX, 3.0); // power to sharpen edges: __/__/\n\n  float checkerY = mod(checkPosition.y, 1.0 / cols) * cols;\n  checkerY = abs(checkerY - 0.5) * 2.0;\n  checkerY = pow(checkerY, 3.0);\n\n  float checkerMod = 0.0;\n  if (rows > 1.0 && floor(checkPosition.x * rows) == checkerMod) {\n    perc = 2.0;\n  }\n  if (cols > 1.0 && floor(checkPosition.y * cols) == checkerMod) {\n    perc = 2.0;\n  }\n\n  // float checker = (checkerX * checkerY) * 2.0;\n  float checker = (checkerX + checkerY) * 0.5;\n  float r1 = r * checker + 0.1;\n  float g1 = g * checker + 0.05;\n  float b1 = b * checker + 0.2;\n  float red = r1 * perc + pulse;\n  float green = g1 * perc + pulse;\n  float blue = b1 * perc + pulse + 0.05;\n\n  // float red = r;\n  // float green = g;\n  // float blue = b;\n\n  gl_FragColor = vec4(red, green, blue, 1.0);\n}", perlin_grid = function(noise) {
    var camera, renderer, stage = document.createElement("div"), mouse = {
        x: 0,
        y: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    Math.random();
    function listen(eventNames, callback) {
        for (var i = 0; i < eventNames.length; i++) window.addEventListener(eventNames[i], callback);
    }
    return listen([ "resize" ], function(e) {
        sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
        renderer.setSize(sw, sh);
    }), listen([ "mousedown", "touchstart" ], function(e) {
        e.preventDefault(), isMouseDown = !0;
    }), listen([ "mousemove", "touchmove" ], function(e) {
        e.preventDefault(), e.changedTouches && e.changedTouches[0] && (e = e.changedTouches[0]), 
        mouse.x = e.clientX / sw * 2 - 1, mouse.y = -e.clientY / sh * 2 + 1;
    }), listen([ "mouseup", "touchend" ], function(e) {
        e.preventDefault(), isMouseDown = !1;
    }), {
        init: function() {},
        stage: stage
    };
};

define("perlin_grid", [ "noise" ], perlin_grid);

var perlin_leaves = function(perlin) {
    !function(c) {
        var t = {}, f = function() {
            return new Date().getTime();
        };
    }(console);
    var pixel = 10, w = 40, h = 40, c = (Math.random, document.createElement("canvas"));
    c.width = w * pixel, c.height = h * pixel;
    var ctx = c.getContext("2d"), logger = document.createElement("div");
    document.body.appendChild(logger);
    var channelRed = perlin.noise(w, h), seed = 1e3 * Math.random();
    function drawIt(time) {
        for (var red = channelRed.cycle(seed + .01 * time, .01), i = 0, il = w * h; i < il; i++) {
            var xp = i % w, yp = Math.floor(i / w), dx = xp - w / 2, dy = yp - h / 2, d = w / 2 - Math.sqrt(dx * dx + dy * dy), r = ~~(255 * red[i] * d);
            ctx.fillStyle = "rgb(" + r + "," + r + "," + r + ")", ctx.fillRect(xp * pixel, yp * pixel, pixel, pixel);
        }
        requestAnimationFrame(drawIt);
    }
    return {
        init: function() {
            drawIt(0);
        },
        stage: c
    };
};

define("perlin_leaves", [ "perlin" ], perlin_leaves);

var perlin_noise = function(perlin) {
    !function(c) {
        var t = {}, f = function() {
            return new Date().getTime();
        };
    }(console);
    var pixel = 10, w = 60, h = 60, M = Math, c = (M.random, document.createElement("canvas"));
    c.width = w * pixel, c.height = h * pixel;
    var d = c.getContext("2d"), logger = document.createElement("div");
    document.body.appendChild(logger);
    var channelRed = perlin.noise(w, h), channelGreen = perlin.noise(w, h), channelBlue = perlin.noise(w, h), min = 1e3, max = -1e3;
    function drawIt(time) {
        for (var t = .005 * time, red = channelRed.cycle(t, .01), green = channelGreen.cycle(t, .01), blue = channelBlue.cycle(t, .01), i = 0, il = w * h; i < il; i++) {
            var xp = i % w, yp = Math.floor(i / w), r = ~~(255 * red[i]), g = ~~(255 * green[i]), b = ~~(255 * blue[i]);
            d.fillStyle = "rgb(" + r + "," + g + "," + b + ")", d.fillRect(xp * pixel, yp * pixel, pixel, pixel), 
            min = M.min(r, min), max = M.max(r, max), min = M.min(g, min), max = M.max(g, max), 
            min = M.min(b, min), max = M.max(b, max);
        }
        logger.innerHTML = min + "<br>" + max, requestAnimationFrame(drawIt);
    }
    return {
        init: function() {
            drawIt(0);
        },
        stage: c
    };
};

define("perlin_noise", [ "perlin" ], perlin_noise);

var pine_three = function() {
    var camera, scene, renderer, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    min = 0, max = 10, Math.random();
    var min, max, holder, generationComplete = !1;
    function render(time) {
        generationComplete && (holder.rotation.y += .01), camPos.z = 1e3, camera.position.set(camPos.x, camPos.y, camPos.z), 
        camera.lookAt(scene.position), renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            colours.getRandomPalette(), scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(80, sw / sh, 1, 1e4), 
            scene.add(camera);
            var lightAbove = new THREE.DirectionalLight(16777215, 1.5);
            lightAbove.position.set(0, 200, 100), scene.add(lightAbove);
            var lightLeft = new THREE.DirectionalLight(16777215, 4);
            lightLeft.position.set(-100, 0, 100), scene.add(lightLeft), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
            var segmentRadius = 10, segmentLength = 50, colour = colours.getRandomColour();
            new THREE.Vector3(0, 0, 0), function(parent, endPoint) {
                var props, group, material, geometry, object, colour = colours.mutateColour(parent.colour, 50), child = (props = {
                    radius: segmentRadius,
                    height: segmentLength,
                    colour: colour
                }, group = new THREE.Group(), material = new THREE.MeshLambertMaterial({
                    color: props.colour
                }), geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 15), 
                (object = new THREE.Mesh(geometry, material)).position.y = props.height / 2, group.add(object), 
                {
                    colour: props.colour,
                    group: group,
                    object: object
                });
                parent.group.add(child.group), parent.group.updateMatrixWorld();
            }({
                colour: colour,
                group: holder
            }), document.body.appendChild(renderer.domElement), render();
        },
        resize: function() {}
    };
};

define("pine_three", pine_three);

sw = 600, sh = 600, bmp = dom.canvas(sw, sh);

document.body.appendChild(bmp.canvas);

frame = 0;

var t = (1 + Math.sqrt(5)) / 2, CodedIcosahedron = {
    name: "CodedIcosahedron",
    vertex: [ [ -1, t, 0 ], [ 1, t, 0 ], [ -1, -t, 0 ], [ 1, -t, 0 ], [ 0, -1, t ], [ 0, 1, t ], [ 0, -1, -t ], [ 0, 1, -t ], [ t, 0, -1 ], [ t, 0, 1 ], [ -t, 0, -1 ], [ -t, 0, 1 ] ],
    face: [ [ 0, 11, 5 ], [ 0, 5, 1 ], [ 0, 1, 7 ], [ 0, 7, 10 ], [ 0, 10, 11 ], [ 1, 5, 9 ], [ 5, 11, 4 ], [ 11, 10, 2 ], [ 10, 7, 6 ], [ 7, 1, 8 ], [ 3, 9, 4 ], [ 3, 4, 2 ], [ 3, 2, 6 ], [ 3, 6, 8 ], [ 3, 8, 9 ], [ 4, 9, 5 ], [ 2, 4, 11 ], [ 6, 2, 10 ], [ 8, 6, 7 ], [ 9, 8, 1 ] ]
}, planesArray = [];

function createPlanes(shape, r, offset) {
    null == offset && (offset = make3DPoint(0, 0, 0));
    for (var sectors = shape.face.length, i = 0; i < sectors; i++) {
        for (var face = shape.face[i], plane = [], f = 0, fl = face.length; f < fl; f++) {
            var vi = face[f], v = shape.vertex[vi];
            point = make3DPoint(offset.x + v[0] * r, offset.y + v[1] * r, offset.z + v[2] * r), 
            plane[f] = point;
        }
        planesArray.push(plane);
    }
}

function animation() {
    bmp.ctx.clearRect(0, 0, sw, sh), renderPlanes(bmp.ctx, planesArray, {
        fillColor: function(p) {
            var brightness = 255 * (p.slope.y / Math.PI + 1);
            return "rgba(" + [ Math.round(.23 * brightness), Math.round(.62 * brightness), Math.round(.9 * brightness), 1 ].join(",") + ")";
        }
    }), frame++, cubeAxisRotations.x -= .01, cubeAxisRotations.y += .01;
}

createPlanes(CodedIcosahedron, 100), con.log(planesArray), animation(), window.addEventListener("keydown", function() {
    animation();
});

var polyhedra_three = function() {
    var camera, scene, renderer, stage = document.createElement("div"), mouse = {
        x: 0,
        y: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    sw = sh = 400;
    var polyhedron, theta = 0, settings = {};
    function onDocumentMouseMove(event) {
        event.preventDefault(), mouse.x = event.clientX / sw * 2 - 1, mouse.y = -event.clientY / sh * 2 + 1;
    }
    function render() {
        theta += 4 * mouse.x, polyhedron.rotation.y = .1 * theta, camera.lookAt(scene.position), 
        renderer.render(scene, camera);
    }
    function animate() {
        requestAnimationFrame(animate), render();
    }
    return settings.lineScale = 1, settings.lineSize = 1 + 10 * Math.random() * settings.lineScale, 
    settings.lineGap = 2 + 3 * Math.random() * settings.lineScale, settings.baseRotation = 0, 
    settings.varyRotation = Math.random() * Math.PI * 2, {
        stage: stage,
        init: function() {
            var light, time1 = new Date().getTime();
            scene = new THREE.Scene(), (camera = new THREE.PerspectiveCamera(70, sw / sh, 1, 1e4)).position.set(0, 100, 500), 
            scene.add(camera), (light = new THREE.DirectionalLight(16777215, 2)).position.set(1, 1, 1).normalize(), 
            scene.add(light), (light = new THREE.DirectionalLight(16711935, 2)).position.set(-1, 0, 0).normalize(), 
            scene.add(light), (renderer = new THREE.WebGLRenderer()).setSize(sw, sh);
            var mesh = POLYHEDRA.Icosidodecahedron;
            polyhedron = function(props) {
                var i, il, faces = [], faceRange = [], totalFaces = 0;
                props.face.map(function(face) {
                    for (i = 0, il = face.length - 2; i < il; i++) faces.push(face[0], face[i + 1], face[i + 2]);
                    totalFaces += il, faceRange.push(totalFaces);
                });
                var vertices = [];
                props.vertex.map(function(vertex) {
                    vertex.map(function(vertexIndex) {
                        vertices.push(vertexIndex);
                    });
                });
                var materials = [];
                for (i = 0, il = props.face.length; i < il; i++) {
                    var col = Math.round(255 * Math.random()) << 16 | Math.round(255 * Math.random()) << 8 | Math.round(255 * Math.random()), material = new THREE.MeshLambertMaterial({
                        color: col
                    });
                    materials.push(material);
                }
                var geometry = new THREE.PolyhedronGeometry(vertices, faces, 200, 0);
                con.log("geometry", geometry);
                var materialIndex = 0;
                for (i = 0, il = geometry.faces.length; i < il; i++) -1 < faceRange.indexOf(i) && materialIndex++, 
                geometry.faces[i].materialIndex = materialIndex;
                return material = new THREE.MeshFaceMaterial(materials), new THREE.Mesh(geometry, material);
            }(mesh), scene.add(polyhedron), stage.appendChild(renderer.domElement), document.addEventListener("mousemove", onDocumentMouseMove, !1);
            var time2 = new Date().getTime();
            render();
            var time3 = new Date().getTime();
            con.log("times", time2 - time1, time3 - time2), animate();
        }
    };
};

define("polyhedra_three", polyhedra_three);

var race_lines_three = function() {
    var camera, scene, renderer, isMouseDown = !1, emptySlot = "emptySlot", planeTop = "planeTop", planeBottom = "planeBottom", mouse = {
        x: 0,
        y: 0
    }, camPos = {
        x: 0,
        y: 0,
        z: 10
    }, sw = window.innerWidth, sh = window.innerHeight, cols = 20, rows = 16, gap = 20, size = {
        width: 100,
        height: 30,
        depth: 150
    }, planeOffset = 250, allRowsDepth = rows * (size.depth + gap), allColsWidth = cols * (size.depth + gap), speedNormal = 4, speedFast = 34, speed = speedNormal, boxes = {
        planeBottom: [],
        planeTop: []
    }, boxes1d = [];
    function num(min, max) {
        return Math.random() * (max - min) + min;
    }
    function move(x, y, z) {
        var box = boxes[y][z][x];
        if (box !== emptySlot && (box.position.x = box.offset.x, box.position.z = box.offset.z + box.posZ, 
        0 < box.position.z && (box.posZ -= allRowsDepth), !box.isWarping && .999 < Math.random())) {
            var dir = Math.floor(5 * Math.random()), xn = x, zn = z, yn = y, yi = 0, xo = 0, zo = 0;
            switch (dir) {
              case 0:
                xn++, xo = 1;
                break;

              case 1:
                xn--, xo = -1;
                break;

              case 2:
                zn++, zo = 1;
                break;

              case 3:
                zn--, zo = -1;
                break;

              case 4:
                yn = y === planeTop ? planeBottom : planeTop, yi = y === planeTop ? -1 : 1;
            }
            boxes[yn][zn] && boxes[yn][zn][xn] === emptySlot && (boxes[y][z][x] = emptySlot, 
            box.isWarping = !0, boxes[yn][zn][xn] = box, 4 === dir ? TweenMax.to(box.position, .5, {
                y: yi * planeOffset
            }) : TweenMax.to(box.offset, .5, {
                x: box.offset.x + xo * (size.width + gap),
                z: box.offset.z + zo * (size.depth + gap)
            }), TweenMax.to(box.offset, .6, {
                onComplete: function() {
                    box.isWarping = !1;
                }
            }));
        }
    }
    function render(time) {
        var box;
        speed -= .05 * (speed - (isMouseDown ? speedFast : speedNormal));
        for (var b = 0, bl = boxes1d.length; b < bl; b++) {
            (box = boxes1d[b]).posZ += speed;
            var distanceZ = 1 - ((allRowsDepth - box.posZ) / allRowsDepth - 1);
            box.material.uniforms.distanceZ.value = distanceZ;
            var distanceX = 1 - Math.abs(box.position.x) / (allColsWidth / 3);
            box.material.uniforms.distanceX.value = distanceX;
            var colour = isMouseDown ? box.colours.fast : box.colours.slow;
            box.material.uniforms.r.value -= .1 * (box.material.uniforms.r.value - colour.r), 
            box.material.uniforms.g.value -= .1 * (box.material.uniforms.g.value - colour.g), 
            box.material.uniforms.b.value -= .1 * (box.material.uniforms.b.value - colour.b);
            var currentSpeed = (speed - speedNormal) / (speedFast - speedNormal);
            box.material.uniforms.speed.value = currentSpeed, Math.random() > .99995 - .005 * currentSpeed && (box.material.uniforms.pulse.value = 1), 
            box.material.uniforms.pulse.value -= .1 * box.material.uniforms.pulse.value / (currentSpeed + 1);
        }
        for (var j = 0, jl = rows; j < jl; j++) for (var i = 0, il = cols; i < il; i++) move(i, planeBottom, j), 
        move(i, planeTop, j);
        camPos.x -= .02 * (camPos.x - 400 * mouse.x), camPos.y -= .05 * (camPos.y - 150 * mouse.y), 
        camPos.z = -100, camera.position.set(camPos.x, camPos.y, camPos.z), camera.rotation.y = camPos.x / -1e3, 
        camera.rotation.x = camPos.y / 1e3, camera.rotation.z = (camPos.x - 400 * mouse.x) / 2e3, 
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    var vertexShader = [ "varying vec2 vUv;", "void main()", "{", "  vUv = uv;", "  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );", "  gl_Position = projectionMatrix * mvPosition;", "}" ].join(""), fragmentShader = [ "uniform float r;", "uniform float g;", "uniform float b;", "uniform float distanceZ;", "uniform float distanceX;", "uniform float pulse;", "uniform float speed;", "varying vec2 vUv;", "void main( void ) {", "  vec2 position = abs(-1.0 + 2.0 * vUv);", "  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 2.0);", "  float perc = (0.2 * pow(speed + 1.0, 2.0) + edging * 0.8) * distanceZ * distanceX;", "  float red = r * perc + pulse;", "  float green = g * perc + pulse;", "  float blue = b * perc + pulse;", "  gl_FragColor = vec4(red, green, blue, 1.0);", "}" ].join("");
    return {
        init: function() {
            scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 1e4), 
            scene.add(camera), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh);
            for (var j = 0, jl = rows; j < jl; j++) {
                boxes.planeBottom[j] = [], boxes.planeTop[j] = [];
                for (var i = 0, il = cols; i < il; i++) boxes.planeBottom[j][i] = emptySlot, boxes.planeTop[j][i] = emptySlot;
            }
            function createBox() {
                var props, colours, uniforms, material, geometry, object, xi = Math.floor(Math.random() * cols), xai = xi, yi = .5 < Math.random() ? 1 : -1, yai = -1 === yi ? planeBottom : planeTop, zi = Math.floor(Math.random() * rows), zai = zi, x = (xi - cols / 2) * (size.width + gap), y = yi * planeOffset, z = zi * (size.depth + gap);
                if (boxes[yai][zai][xai] === emptySlot) {
                    var box = (props = size, colours = {
                        slow: {
                            r: num(0, .2),
                            g: num(.5, .9),
                            b: num(.3, .7)
                        },
                        fast: {
                            r: num(.9, 1),
                            g: num(.1, .7),
                            b: num(.2, .5)
                        }
                    }, uniforms = {
                        r: {
                            type: "f",
                            value: colours.slow.r
                        },
                        g: {
                            type: "f",
                            value: colours.slow.g
                        },
                        b: {
                            type: "f",
                            value: colours.slow.b
                        },
                        distanceX: {
                            type: "f",
                            value: 1
                        },
                        distanceZ: {
                            type: "f",
                            value: 1
                        },
                        pulse: {
                            type: "f",
                            value: 0
                        },
                        speed: {
                            type: "f",
                            value: speed
                        }
                    }, material = new THREE.ShaderMaterial({
                        uniforms: uniforms,
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader
                    }), geometry = new THREE.BoxGeometry(props.width, props.height, props.depth), (object = new THREE.Mesh(geometry, material)).colours = colours, 
                    object);
                    box.position.y = y, box.isWarping = !1, box.offset = {
                        x: x,
                        z: 0
                    }, box.posZ = z, boxes[yai][zai][xai] = box, boxes1d.push(box), scene.add(box);
                }
            }
            for (i = 0, il = rows * cols; i < il; i++) createBox();
            function listen(eventNames, callback) {
                for (var i = 0; i < eventNames.length; i++) window.addEventListener(eventNames[i], callback);
            }
            document.body.appendChild(renderer.domElement), listen([ "resize" ], function(e) {
                sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
                renderer.setSize(sw, sh);
            }), listen([ "mousedown", "touchstart" ], function(e) {
                e.preventDefault(), isMouseDown = !0;
            }), listen([ "mousemove", "touchmove" ], function(e) {
                e.preventDefault(), e.changedTouches && e.changedTouches[0] && (e = e.changedTouches[0]), 
                mouse.x = e.clientX / sw * 2 - 1, mouse.y = -e.clientY / sh * 2 + 1;
            }), listen([ "mouseup", "touchend" ], function(e) {
                e.preventDefault(), isMouseDown = !1;
            }), render();
        },
        resize: function() {}
    };
};

define("race_lines_three", race_lines_three);

con = console, sw = window.innerWidth, sh = window.innerHeight;

(bmp = document.createElement("canvas")).width = sw, bmp.height = sh, document.body.appendChild(bmp);

ctx = bmp.getContext("2d");

var circleRads = 2 * Math.PI, numCurrent = numInitial = 15, numMax = 30, particles = [], deaths = [];

function moveParticle(p) {
    p.dying && p.age++, p.dirFloat += (Math.random() - .5) * Math.PI * .5, p.dir -= .01 * (p.dir - p.dirFloat), 
    p.vx = Math.cos(p.dir) * p.speed, p.vy = Math.sin(p.dir) * p.speed, p.x += p.vx, 
    p.y += p.vy;
    p.x > sw + 100 && (p.x -= sw + 200), p.x < -100 && (p.x += sw + 200), p.y > sh + 100 && (p.y -= sh + 200), 
    p.y < -100 && (p.y += sh + 200), p.angle = Math.atan(p.vy / p.vx);
    var a = -p.angle;
    p.vx <= 0 && (a += Math.PI);
    for (var j = 0; j < p.lines; j++) {
        ctx.fillStyle = p.palette[j];
        var r = 3;
        p.dying && (r /= 1 + .01 * p.age);
        var d = (j - p.lines / 2 + .5) * r * 2, x = p.x + Math.sin(a) * d, y = p.y + Math.cos(a) * d;
        ctx.beginPath(), ctx.arc(x, y, r, 0, circleRads, !1), ctx.closePath(), ctx.fill();
    }
    p.dying && 500 < p.age ? killParticle(p) : 0 == p.children && numCurrent < numMax && .99 < Math.random() && spawnParticle(p);
}

function killParticle(p) {
    var index = particles.indexOf(p);
    particles.splice(index, 1), numCurrent--, deaths.push({
        anim: 0,
        lines: p.lines,
        x: p.x,
        y: p.y
    });
}

function animateDeath(death) {
    death.anim++;
    if (50 < death.anim) {
        var index = deaths.indexOf(death);
        deaths.splice(index, 1);
    } else for (var d = .4 * death.anim, perc = (50 - death.anim) / 50, j = 0; j < death.lines; j++) {
        var a = j / death.lines * Math.PI * 2, x = death.x + Math.sin(a) * d, y = death.y + Math.cos(a) * d, r = perc + .01;
        ctx.fillStyle = "rgba(255,255,255," + perc + ")", ctx.beginPath(), ctx.arc(x, y, r, 0, circleRads, !1), 
        ctx.closePath(), ctx.fill();
    }
}

function generateParticle(parent) {
    if (parent) return {
        age: 0,
        children: 0,
        dir: parent.dir,
        dirFloat: parent.dirFloat,
        dying: !1,
        lines: parent.lines,
        palette: parent.palette,
        speed: parent.speed,
        vx: parent.vx,
        vy: parent.vy,
        x: parent.x,
        y: parent.y
    };
    for (var lines = 3 + parseInt(6 * Math.random()), palette = [], i = 0; i < lines; i++) palette.push("hsl(" + i / lines * 360 + ",50%,50%)");
    return {
        age: 0,
        children: 0,
        dir: Math.random() * Math.PI * 2,
        dirFloat: 0,
        dying: !1,
        lines: lines,
        palette: palette,
        speed: 1.5 * Math.random() + .5,
        vx: 0,
        vy: 0,
        x: Math.random() * sw,
        y: Math.random() * sh
    };
}

function spawnParticle(parent) {
    parent.dying = !0, parent.children++, particles[numCurrent] = generateParticle(parent), 
    numCurrent++;
}

function generate() {
    for (var i = 0; i < numInitial; i++) particles[i] = generateParticle();
}

function render(time) {
    ctx.fillStyle = "rgba(0,0,0,0.04)", ctx.fillRect(0, 0, sw, sh);
    for (var i = 0; i < deaths.length; i++) animateDeath(deaths[i]);
    for (i = 0; i < numCurrent; i++) moveParticle(particles[i]);
    requestAnimationFrame(render);
}

window.addEventListener("resize", function() {
    bmp.width = sw = window.innerWidth, bmp.height = sh = window.innerHeight;
}), generate(), render(0);

con = console, rand = function() {
    var seed, z, m = 4294967296, c = 1013904223, alphaToInteger = function(s) {
        for (var num = 0, i = 0, il = s.length; i < il; i++) num += s.charCodeAt(i) * c, 
        num %= m;
        return num;
    };
    return {
        setSeed: function(val) {
            val = val || 0 === val ? /[^\d]/.test(val) ? alphaToInteger(val) : Number(val) : Math.round(Math.random() * m), 
            z = seed = val;
        },
        getSeed: function() {
            return seed;
        },
        random: function() {
            return void 0 === z ? (console.warn("no seed set"), null) : (z = (1664525 * z + c) % m) / m;
        },
        getLastRandom: function() {
            return z / m;
        },
        getNumber: function(min, max) {
            return min + this.random() * (max - min);
        },
        getInteger: function(min, max) {
            return Math.floor(this.getNumber(min, max + 1));
        },
        alphaToInteger: alphaToInteger,
        shuffle: function(array) {
            for (var i = array.length - 1; 0 < i; i--) {
                var j = Math.floor(rand.random() * (i + 1)), temp = array[i];
                array[i] = array[j], array[j] = temp;
            }
            return array;
        }
    };
}();

"undefined" != typeof module && (module.exports = rand);

con = console;

if (isNode = "undefined" != typeof module) rand = require("./rand.js"), dom = require("./dom.js"), 
colours = require("./colours.js");

var rectangular_fill = function() {
    var block, stroke, rows = 30, cols = 20, populated = [], available = [], squares = [], total = 0, bmp = dom.canvas(1, 1);
    var attempts = 0, lastProgress = 0;
    function tryPosition() {
        var size = 17;
        if (5e3 < ++attempts) size = 1; else if (1e4 < attempts) return render(), con.warn("bailing!", attempts);
        if (attempts % 100 == 0) {
            var currentProgress = (total - available.length) / total;
            lastProgress !== currentProgress && progress("render:progress", currentProgress), 
            lastProgress = currentProgress;
        }
        !function(size) {
            var width = Math.ceil(rand.random() * size), height = Math.ceil(rand.random() * size), colour = colours.getRandomColour(), startIndex = Math.floor(available.length * rand.random()), start = available[startIndex], y = start % rows, x = Math.floor(start / rows), ok = !0, xxe = x + width;
            cols < xxe && (width = (xxe = cols) - x);
            var yye = y + height;
            rows < yye && (height = (yye = rows) - y);
            for (var xx = x; xx < xxe && ok; xx++) for (var yy = y; yy < yye && ok; yy++) populated[xx][yy] && (ok = !1);
            if (ok) {
                for (xx = x; xx < xxe && ok; xx++) for (yy = y; yy < yye && ok; yy++) {
                    populated[xx][yy] = colour;
                    var id = xx * rows + yy, availIndex = available.indexOf(id);
                    available.splice(availIndex, 1);
                }
                squares.push({
                    colour: colour,
                    x: x * block + stroke,
                    y: y * block + stroke,
                    w: width * block - 2 * stroke,
                    h: height * block - 2 * stroke
                });
            }
        }(size), available.length ? (attempts + 1) % 1e3 == 0 ? setTimeout(tryPosition, 100) : tryPosition() : render();
    }
    function render() {
        bmp.ctx.setTransform(1, .2 * rand.random() - .1, .2 * rand.random() - .1, 1, 0, 0);
        for (var s = 0, sl = squares.length; s < sl; s++) {
            var rect = squares[s];
            bmp.ctx.fillStyle = rect.colour, bmp.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
        }
        progress("render:complete", bmp.canvas);
    }
    return {
        name: "Rectangular Fill",
        stage: bmp.canvas,
        resize: function(w, h) {
            bmp.setSize(w, h, !0);
        },
        init: function() {
            colours.getRandomPalette(), block = Math.round(20 * (.2 + .8 * rand.random())), 
            stroke = block * (.1 + rand.random()) * .4, bmp.setSize(block * cols, block * rows);
            for (var x = 0; x < cols; x++) {
                populated[x] = [];
                for (var y = 0; y < rows; y++) populated[x][y] = 0, available.push(x * rows + y);
            }
            total = cols * rows, tryPosition();
        },
        kill: function() {}
    };
};

if (isNode ? module.exports = rectangular_fill() : define("rectangular_fill", rectangular_fill), 
function() {
    var canvas, createSlider, ctx, d, draw, redraw, settings;
    console, d = document, ctx = canvas = null, Math.PI, settings = {}, (createSlider = function(prop, min, max, ini, granularity) {
        var change, changeText, div, input, label, range;
        return null == granularity && (granularity = 1), div = d.createElement("div"), (label = d.createElement("label")).innerHTML = prop + ":", 
        (input = d.createElement("input")).type = "text", input.value = ini, (range = d.createElement("input")).type = "range", 
        range.min = min / granularity, range.max = max / granularity, range.name = prop, 
        range.value = ini / granularity, div.appendChild(label), div.appendChild(range), 
        div.appendChild(input), d.body.appendChild(div), change = function(e) {
            var v;
            return v = e.target.value * granularity, settings[prop] = Number(v), input.value = v, 
            redraw();
        }, changeText = function(e) {
            var v;
            return v = e.target.value, settings[prop] = Number(v), range.value = v / granularity, 
            redraw();
        }, input.addEventListener("change", changeText), range.addEventListener("change", change), 
        range.addEventListener("input", change), settings[prop] = ini;
    })("items", 1, 10, 2), createSlider("maxRecursion", 1, 10, 5), createSlider("angleSpiral", 0, 2, 1, .01), 
    createSlider("angleSpread", 0, 2, Math.PI / 2, .01), createSlider("symmetry", -1, 1, 0, .01), 
    createSlider("scale", 0, 10, 1, .01), redraw = function() {
        return canvas.width = canvas.width, draw(300, 50, 0, 0);
    }, draw = function(x, y, branchAngle, level) {
        var alpha, angleSpiral, angleSpread, branchScale, h, half, items, j, maxRecursion, newX, newY, rotation, scale, w, _i, _results;
        for (level++, items = settings.items, maxRecursion = settings.maxRecursion, angleSpiral = settings.angleSpiral, 
        angleSpread = settings.angleSpread, alpha = 1 - level / maxRecursion, _results = [], 
        j = _i = 0; 0 <= items ? _i < items : items < _i; j = 0 <= items ? ++_i : --_i) branchScale = 1 - (j - (half = (items - 1) / 2)) / half * settings.symmetry, 
        w = 30 * (scale = settings.scale / level * branchScale), h = 100 * scale, rotation = angleSpread * (j - half) + branchAngle * angleSpiral, 
        ctx.save(), ctx.translate(x, y), ctx.rotate(rotation), 0, ctx.fillStyle = "rgba(0,0,0," + alpha + ")", 
        ctx.fillRect(1 * -w / 2, 0, 1 * w, 1 * h), ctx.restore(), newX = x + h * -Math.sin(rotation), 
        newY = y + h * Math.cos(rotation), level < maxRecursion ? _results.push(draw(newX, newY, rotation, level, j)) : _results.push(void 0);
        return _results;
    }, function() {
        (canvas = d.createElement("canvas")).width = canvas.height = 600, d.body.appendChild(canvas), 
        ctx = canvas.getContext("2d"), redraw();
    }();
}.call(this), define("recursive_circle", function() {
    var TAU = 2 * Math.PI, sw = 600, sh = sw, maxRecursion = 4, stage = dom.canvas(sw, sh), ctx = stage.ctx;
    function render(time) {
        var t = 3e-4 * time, proportion = 2 / 3, ringItems = 6;
        ctx.globalCompositeOperation = "source-over", ctx.clearRect(0, 0, sw, sh), function calc(recursion, cx, cy, size) {
            var angleBase = Math.sin(t) * TAU / ringItems * recursion;
            0;
            for (var outerBoundary = size / 2, innerBoundary = outerBoundary * proportion / 2, inscribedRadius = (outerBoundary - innerBoundary) / 2, centreLine = innerBoundary + inscribedRadius, i = 0; i < ringItems; i++) {
                var a = angleBase + i / ringItems * TAU, x = cx + Math.sin(a) * centreLine, y = cy + Math.cos(a) * centreLine;
                recursion < maxRecursion ? calc(recursion + 1, x, y, outerBoundary * proportion) : (ctx.fillStyle = "#fff", 
                ctx.globalCompositeOperation = "source-over", ctx.beginPath(), ctx.drawCircle(x * sw, y * sw, inscribedRadius * sw), 
                ctx.fill(), ctx.fillStyle = "#000", ctx.globalCompositeOperation = "destination-out", 
                ctx.beginPath(), ctx.drawCircle(x * sw, y * sw, inscribedRadius * proportion / 2 * sw), 
                ctx.fill());
            }
        }(1, .5, .5, 1), requestAnimationFrame(render);
    }
    return {
        resize: function(w, h) {},
        init: function() {
            render(0);
        },
        stage: stage.canvas
    };
}), isNode = "undefined" != typeof module) dom = require("./dom.js");

function splitPolygon(array, start, end) {
    var copy = array.slice(), chunk1 = copy.slice(0, start + 1), chunk3 = copy.splice(end, array.length - end), chunk2 = array.slice().splice(start, end - start + 1);
    return [ chunk1.concat(chunk3), chunk2 ];
}

var recursive_polygon = function() {
    var insetDistance, mutateThreshold, mutateAmount, maxDepth, sides, splitLongest, splitEdgeRatioLocked, insetLocked, insetLockedValue, insetThreshold, wonky, sw = 700, sh = 700, bmp = dom.canvas(sw, sh);
    var iterations = 0;
    function drawNext(parent) {
        !function() {
            var depth = parent.depth + 1;
            if (maxDepth < depth) return;
            if (1e4 < ++iterations) return;
            var slicerStart, slicerEnd, copied = parent.points.slice(), len = copied.length;
            if (3 < len) {
                var offset = rand.getInteger(0, len), shifted = copied.splice(0, offset);
                copied = copied.concat(shifted), slicerStart = 0, slicerEnd = rand.getInteger(2, len - 2);
            } else {
                var newPoint, edge = splitLongest ? function(points) {
                    function getLength(p0, p1) {
                        var dx = p0.x - p1.x, dy = p0.y - p1.y;
                        return Math.sqrt(dx * dx + dy * dy);
                    }
                    for (var len = 0, edgeIndex = null, i = 0, il = points.length; i < il; i++) {
                        var p0 = points[i], p1 = points[(i + 1) % il], p0p1Len = getLength(p0, p1);
                        len < p0p1Len && (len = p0p1Len, edgeIndex = i);
                    }
                    return edgeIndex;
                }(copied) : rand.getInteger(0, 2), splitRatio = splitEdgeRatioLocked || rand.getNumber(.1, .9);
                switch (edge) {
                  case 0:
                    newPoint = geom.lerp(copied[0], copied[1], splitRatio), copied.splice(1, 0, newPoint), 
                    slicerStart = 1, slicerEnd = 3;
                    break;

                  case 1:
                    newPoint = geom.lerp(copied[1], copied[2], splitRatio), copied.splice(2, 0, newPoint), 
                    slicerStart = 0, slicerEnd = 2;
                    break;

                  case 2:
                    newPoint = geom.lerp(copied[2], copied[0], splitRatio), copied.push(newPoint), slicerStart = 1, 
                    slicerEnd = 3;
                }
            }
            var newArrays = splitPolygon(copied, slicerStart, slicerEnd);
            drawSplit(parent, newArrays[0], depth), drawSplit(parent, newArrays[1], depth);
        }();
    }
    function drawSplit(parent, points, depth) {
        var colour = mutateThreshold && rand.random() < mutateThreshold ? colours.mutateColour(parent.colour, mutateAmount) : colours.getNextColour();
        if (insetLocked ? insetLockedValue : rand.random() > insetThreshold) {
            var insetPoints = geom.insetPoints(points, insetDistance);
            insetPoints && (drawPolygon(points, {
                fillStyle: colour,
                strokeStyle: colour,
                lineWidth: 1
            }), bmp.ctx.globalCompositeOperation = "destination-out", drawPolygon(insetPoints, {
                fillStyle: "black"
            }), bmp.ctx.globalCompositeOperation = "source-over", drawNext({
                points: points,
                colour: colour,
                depth: depth
            }));
        } else drawPolygon(points, {
            fillStyle: colour,
            strokeStyle: colour,
            lineWidth: 1
        }), .5 < rand.random() && drawNext({
            points: points,
            colour: colour,
            depth: depth
        });
    }
    function fillAndStroke(options) {
        options.lineWidth && options.strokeStyle && (bmp.ctx.strokeStyle = options.strokeStyle, 
        bmp.ctx.lineWidth = options.lineWidth, bmp.ctx.stroke()), options.fillStyle && (bmp.ctx.fillStyle = options.fillStyle, 
        bmp.ctx.fill());
    }
    function drawPolygon(points, options) {
        bmp.ctx.beginPath();
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            bmp.ctx[0 == i ? "moveTo" : "lineTo"](p.x, p.y);
        }
        bmp.ctx.closePath(), fillAndStroke(options);
    }
    return {
        stage: bmp.canvas,
        init: function() {
            (sides = 3 + Math.round(rand.random() * rand.random() * rand.random() * 28)) < 5 && (wonky = .8 < rand.random()), 
            insetDistance = rand.getNumber(2, 25), mutateThreshold = rand.getNumber(0, 1), mutateAmount = rand.getNumber(5, 30), 
            maxDepth = rand.getInteger(1, 10), splitLongest = .5 < rand.random(), splitEdgeRatioLocked = .5 < rand.random() && .5, 
            (insetLocked = .5 < rand.random()) ? insetLockedValue = .5 < rand.random() : insetThreshold = .5 * rand.random(), 
            con.log("sides", sides), con.log("wonky", wonky), con.log("insetDistance", insetDistance), 
            con.log("mutateThreshold", mutateThreshold), con.log("mutateAmount", mutateAmount), 
            con.log("maxDepth", maxDepth), con.log("splitLongest", splitLongest), con.log("splitEdgeRatioLocked", splitEdgeRatioLocked), 
            con.log("insetLocked", insetLocked), con.log("insetLockedValue", insetLockedValue), 
            con.log("insetThreshold", insetThreshold), colours.getRandomPalette(), function() {
                for (var colour = colours.getNextColour(), i = 0, points = [], angles = []; angles.length < sides; ) angles.push(i / sides), 
                i++;
                for (angles.sort(), i = 0; i < angles.length; i++) {
                    var angle = angles[i] * Math.PI * 2, radius = wonky ? rand.getNumber(.4, .45) : .45, x = .5 + Math.sin(angle) * radius, y = .5 + Math.cos(angle) * radius;
                    points.push({
                        x: x * sw,
                        y: y * sh
                    });
                }
                drawNext({
                    points: points,
                    colour: colour,
                    depth: 0
                });
            }(), progress("render:complete", bmp.canvas);
        },
        settings: {}
    };
};

isNode ? module.exports = recursive_polygon() : define("recursive_polygon", recursive_polygon), 
define("seven_four_sevens", function() {
    var sw = 900, sh = 600, canvas = dom.canvas(sw, sh), images = [], planes = [], text = dom.element("div", {
        innerText: "Click to make a new waypoint, shift click to add multiple",
        style: {
            color: "white"
        }
    }), button = dom.button("Add planes", {
        className: "button"
    });
    document.body.appendChild(text), document.body.appendChild(button), dom.on(canvas.canvas, [ "click" ], function(e) {
        e.shiftKey || (_root.holdingpattern = []), _root.holdingpattern.push({
            _x: e.x,
            _y: e.y
        });
    }), dom.on(button, [ "click" ], function(e) {
        planes.push(Plane());
    });
    var _root = {
        holdingpattern: [ {
            _x: rand.getNumber(0, sw),
            _y: rand.getNumber(0, sh)
        }, {
            _x: rand.getNumber(0, sw),
            _y: rand.getNumber(0, sh)
        }, {
            _x: rand.getNumber(0, sw),
            _y: rand.getNumber(0, sh)
        } ],
        createSmoke: function() {}
    };
    function Plane() {
        var xdelta, ydelta, angle, targetangle, distance, deltaangle, cf, PI = Math.PI, PI2 = 2 * Math.PI, arrow = {}, tAngle = 0, count = 0, shape = {
            gotoAndStop: function(frame) {
                shape._currentframe = frame;
            },
            _currentframe: 1,
            _rotation: 0
        }, _x = Math.random() * sw, _y = Math.random() * sh, dir = Math.random() * PI2, speed = .4 * Math.random() + 2, scale = (speed - 1) / 2;
        con.log(speed, scale);
        var turnMax, turnRate = (turnMax = .03 * Math.random() + .01) / 20, holdingpatternpos = Math.floor(Math.random() * _root.holdingpattern.length), targ = _root.holdingpattern[holdingpatternpos];
        return function() {
            targ || (holdingpatternpos = Math.floor(Math.random() * _root.holdingpattern.length), 
            targ = _root.holdingpattern[holdingpatternpos]), xdelta = _x - targ._x, ydelta = _y - targ._y, 
            (distance = Math.sqrt(Math.pow(xdelta, 2) + Math.pow(ydelta, 2))) < 75 && (++holdingpatternpos >= _root.holdingpattern.length && (holdingpatternpos = 0), 
            targ = _root.holdingpattern[holdingpatternpos]), arrow._xscale = arrow._yscale = distance / 5, 
            angle = Math.atan(ydelta / xdelta), deltaangle = dir - (targetangle = xdelta < 0 ? .5 * PI - angle : 1.5 * PI - angle), 
            Math.abs(deltaangle) > PI && (deltaangle < 0 ? (deltaangle = deltaangle % PI + PI, 
            dir += PI2) : (deltaangle = deltaangle % PI - PI, dir -= PI2)), cf = shape._currentframe, 
            .1 < deltaangle ? (tAngle < turnMax ? tAngle += turnRate : tAngle = turnMax, shape.gotoAndStop(58 - (Math.round(tAngle / turnMax * 29) + 28))) : deltaangle < -.1 ? (-turnMax < tAngle ? tAngle -= turnRate : tAngle = -turnMax, 
            shape.gotoAndStop(58 - (Math.round(tAngle / turnMax * 29) + 28))) : (tAngle = deltaangle / 50, 
            cf < 28 ? shape.gotoAndStop(cf + 1) : 28 < cf && shape.gotoAndStop(cf - 1)), dir -= tAngle, 
            arrow._rotation = 180 * -targetangle / PI, shape._rotation = -dir, _x += Math.sin(dir) * speed, 
            _y += Math.cos(dir) * speed, canvas.ctx.save(), canvas.ctx.translate(_x, _y), canvas.ctx.rotate(shape._rotation);
            var flipX = !1, cfFrame = Math.floor(shape._currentframe / 3.1);
            9 < cfFrame && (flipX = !0, cfFrame = 19 - cfFrame);
            var img = images[cfFrame].masked.canvas;
            canvas.ctx.scale((flipX ? -1 : 1) * scale, scale), canvas.ctx.translate(-img.width / 2, -img.height / 2), 
            canvas.ctx.drawImage(img, 0, 0), canvas.ctx.restore(), 3 < ++count && (count = 0, 
            _root.createSmoke(this));
        };
    }
    return {
        init: function() {
            var frames = 10, loaded = 0;
            function loadComplete() {
                if (++loaded == 2 * frames) {
                    for (var f = 0; f < frames; f++) {
                        var mask, maskImage = images[f].mask;
                        (mask = dom.canvas(maskImage.width, maskImage.height)).ctx.drawImage(maskImage, 0, 0);
                        for (var data = mask.ctx.getImageData(0, 0, maskImage.width, maskImage.height), i = 0; i < data.data.length; ) {
                            var rgb = data.data[i++] + data.data[i++] + data.data[i++];
                            data.data[i++] = 255 - rgb / 3;
                        }
                        mask.ctx.putImageData(data, 0, 0);
                        var masked = dom.canvas(maskImage.width, maskImage.height);
                        masked.ctx.drawImage(images[f].plane, 0, 0), masked.ctx.globalCompositeOperation = "destination-out", 
                        masked.ctx.drawImage(mask.canvas, 0, 0), masked.ctx.globalCompositeOperation = "source-over", 
                        images[f].masked = masked;
                    }
                    planes = [ Plane() ], function update() {
                        requestAnimationFrame(update), canvas.ctx.fillStyle = "#1a4859", canvas.ctx.fillRect(0, 0, sw, sh);
                        for (var i = 0; i < _root.holdingpattern.length; i++) {
                            var waypoint = _root.holdingpattern[i];
                            canvas.ctx.beginPath(), canvas.ctx.drawCircle(waypoint._x, waypoint._y, 20), canvas.ctx.closePath(), 
                            canvas.ctx.fillStyle = "#259bc6", canvas.ctx.fill(), canvas.ctx.beginPath(), canvas.ctx.fillStyle = "white", 
                            canvas.ctx.font = "18px Helvetica", canvas.ctx.fillText(i + 1, waypoint._x - 5, waypoint._y + 5), 
                            canvas.ctx.fill();
                        }
                        for (i = 0; i < planes.length; i++) {
                            var p = planes[i];
                            p();
                        }
                    }();
                }
            }
            for (var i = 0; i < frames; i++) {
                var plane = new Image();
                plane.onload = loadComplete, plane.src = "/assets/seven_four_sevens/Image " + (i + 1) + " at frame 0.jpg";
                var mask = new Image();
                mask.onload = loadComplete, mask.src = "/assets/seven_four_sevens/Image " + (i + 1) + " alpha channel at frame 0.png", 
                images[i] = {
                    plane: plane,
                    mask: mask,
                    masked: null
                };
            }
        },
        stage: canvas.canvas
    };
});

sw = 600, sh = 600, bmp = dom.canvas(sw, sh);

document.body.appendChild(bmp.canvas);

h = 0, cx = sw / 2, cy = sh / 2, frame = 0;

function newLine() {
    bmp.ctx.clearRect(0, 0, sw, sh);
    var dotsPerRing = 10 + 4 * Math.sin(4e-4 * frame), ring = 20 + 4 * Math.sin(.001 * frame);
    function getArc(point) {
        var perc = point / dotsPerRing, angle = perc * Math.PI * 2, radius = perc * ring;
        return {
            x: cx + Math.sin(angle) * radius,
            y: cy + Math.cos(angle) * radius
        };
    }
    bmp.ctx.beginPath(), bmp.ctx.strokeStyle = "red", bmp.ctx.lineWidth = .7 * ring;
    for (var h = 0; h < 25 * dotsPerRing; h++) {
        var point = getArc(h - 1);
        0 == h ? bmp.ctx.moveTo(point.x, point.y) : bmp.ctx.lineTo(point.x, point.y);
    }
    bmp.ctx.stroke(), (frame += 1) < 50 && requestAnimationFrame(newLine);
}

newLine(), function() {
    var ctx, d, drawRing, init, time;
    console, d = document, ctx = null, time = 0, init = function() {
        var can;
        return (can = d.createElement("canvas")).width = can.height = 640, d.body.appendChild(can), 
        ctx = can.getContext("2d"), setInterval(function() {
            var i, _i, _results;
            for (time += 1, time %= 2e3, ctx.clearRect(0, 0, 640, 640), _results = [], i = _i = 0; _i < 20; i = _i += 1) _results.push(drawRing(i));
            return _results;
        }, 1e3 / 60);
    }, drawRing = function(i) {
        var j, perside, s, timeEnd, timeStart, x, y, _i, _j, _results;
        for (perside = 2 * i, _results = [], s = _i = 0; _i < 4; s = _i += 1) {
            for (ctx.save(), ctx.translate(320, 320), ctx.rotate(s * Math.PI / 2), j = _j = 0; _j <= perside; j = _j += 1) x = 16 * (-i - .5), 
            y = 16 * (-j + i - .5) + function(t, b, c, d) {
                var ts;
                return b + c * (-2 * ((ts = (t /= d) * t) * t) + 3 * ts);
            }((timeEnd = (timeStart = 20 * (i + 1)) + 300) < time ? 1 : timeStart < time ? (time - timeStart) / (timeEnd - timeStart) : 0, 0, 16, 1), 
            0, ctx.fillStyle = "rgba(0,0,0,1)", 6, ctx.fillRect(x - 3, y - 3, 6, 6);
            _results.push(ctx.restore());
        }
        return _results;
    }, init();
}.call(this);

con = console;

if (isNode = "undefined" != typeof module) rand = require("./rand.js"), dom = require("./dom.js");

var state_of_origin_52_6 = function() {
    var overScale, QLD = "QLD", NSW = "NSW", font = "180px helvetica", red = "#f00", bmpSize = 200, output = dom.canvas(1, 1), machines = {}, progressions = {
        NSW: 0,
        QLD: 0
    }, complete = {
        NSW: !1,
        QLD: !1
    };
    function initState(state, score, x, y, maxGlyphs) {
        var count = 0, countMax = 150 * maxGlyphs, testCanvas = dom.canvas(bmpSize, bmpSize), progressCanvas = dom.canvas(bmpSize, bmpSize);
        function newPosition() {
            var c, padX = 0 * bmpSize, padY = .1 * bmpSize;
            return {
                x: padX + rand.random() * (bmpSize - 2 * padX),
                y: padY + rand.random() * (bmpSize - 2 * padY),
                size: (c = count, .75 + 4 * rand.random() * (.001 + countMax - c) / countMax)
            };
        }
        function drawShape(target, props, fx, renderOuput) {
            var fillStyle, renderScale = renderOuput ? overScale / 2 : 1, scale = 2 * props.size / bmpSize * renderScale, x = (props.x - props.size) * renderScale, y = (props.y - props.size) * renderScale;
            if (renderOuput) {
                x += bmpSize * renderScale / 2, state === NSW && (y += bmpSize * renderScale * .8);
                var grey = rand.getInteger(200, 254);
                fillStyle = "rgb(" + grey + "," + grey + "," + grey + ")";
            } else fillStyle = red;
            target.save(), target.translate(x, y), target.scale(scale, scale), target.font = font, 
            target.fillStyle = fillStyle, target.fillText(state, 0, 0), target.restore();
        }
        function generate() {
            var proposed = newPosition();
            (function(point) {
                testCanvas.ctx.globalCompositeOperation = "source-over", testCanvas.ctx.drawImage(progressCanvas.canvas, 0, 0), 
                testCanvas.ctx.globalCompositeOperation = "source-in", drawShape(testCanvas.ctx, point, 0, !1);
                var width = 2 * Math.ceil(point.size + 20), height = Math.ceil(point.size + 20), xs = Math.floor(point.x - width), ys = Math.floor(point.y - 2 * height);
                width *= 2, height *= 2;
                for (var pixels = testCanvas.ctx.getImageData(xs, ys, width, height).data, ok = !0, x = 0; x < width && ok; x++) for (var y = 0; y < height && ok; y++) ok = 0 === pixels[4 * (y * width + x)];
                return testCanvas.ctx.globalCompositeOperation = "source-over", testCanvas.ctx.fillStyle = ok ? "rgba(0, 0, 255, 0.25)" : "rgba(255, 0, 0, 0.25)", 
                testCanvas.ctx.fillRect(xs, ys, width, height), ok;
            })(proposed) && (count++, drawShape(output.ctx, proposed, 0, !0), drawShape(progressCanvas.ctx, proposed, 0, !1));
        }
        progressCanvas.ctx.clearRect(0, 0, bmpSize, bmpSize), progressCanvas.ctx.fillStyle = red, 
        progressCanvas.ctx.fillRect(0, 0, bmpSize, bmpSize), progressCanvas.ctx.globalCompositeOperation = "destination-out", 
        progressCanvas.ctx.save(), progressCanvas.ctx.translate(bmpSize * x, bmpSize * y), 
        progressCanvas.ctx.font = font, progressCanvas.ctx.fillText(score, 0, 0), progressCanvas.ctx.restore(), 
        progressCanvas.ctx.globalCompositeOperation = "source-over", machines[state] = function() {
            if (count < countMax) {
                for (var i = 0; i < 100 && count < countMax; i++) generate(), generate();
                progressions[state] = count / countMax;
            } else complete[state] = !0;
        };
    }
    function loop() {
        machines.NSW(), machines.QLD(), complete.NSW && complete.QLD ? progress("render:complete", output.canvas) : (progress("render:progress", (progressions.NSW + progressions.QLD) / 2), 
        setTimeout(loop, 1));
    }
    return {
        stage: output.canvas,
        init: function(options) {
            overScale = options.size / bmpSize, con.log("state of origin init", options, overScale), 
            output.setSize(bmpSize * overScale, bmpSize * overScale), initState(QLD, 52, -.02, .9, 3), 
            initState(NSW, 6, .23, .9, 2), loop();
        }
    };
};

isNode ? module.exports = state_of_origin_52_6() : define("state_of_origin_52_6", state_of_origin_52_6);

var synth_ambient = function(Tone) {
    return {
        init: function() {
            var watchOut = dom.element("h1", {
                innerHTML: "Beware your speakers!"
            });
            document.body.appendChild(watchOut);
            var loadNext = dom.button("Load another permutation", {
                style: {
                    border: "1px solid black",
                    borderRadius: "5px",
                    display: "inline-block",
                    padding: "5px"
                }
            });
            document.body.appendChild(loadNext), dom.on(loadNext, [ "click" ], function() {
                window.location = "?synth_ambient," + Math.round(1e10 * Math.random());
            }), Tone.Transport.bpm.value = rand.getInteger(80, 115);
            var notes = [ [ "b2", "g2", "c3", "b3", "g3", "c4" ], [ "c#3", "g#3", "c#4", "g#4", "c#5" ], [ "g3", "b3", "f#4", "g4", "b4", "f#5", "g5", "b5" ], [ "A3", "C4", "E4", "A4", "C5", "E5", "A5", "C6", "E6" ], [ "e3", "a#4", "e4", "a#5", "e5" ] ];
            function timeGenerator(min, max) {
                return Math.pow(2, rand.getInteger(min, max)) + "n";
            }
            notes = notes[rand.getInteger(0, notes.length - 1)], new Tone.PingPongDelay({
                delayTime: "6n",
                feedback: .9,
                wet: .2
            }).toMaster();
            var delayFeedback = new Tone.FeedbackDelay({
                delayTime: timeGenerator(2, 4),
                feedback: .9,
                wet: .4
            }).toMaster(), lowPass = new Tone.Filter({
                frequency: rand.getNumber(6e3, 2e4)
            }).toMaster(), freeverb = new Tone.Freeverb().toMaster();
            freeverb.dampening.value = rand.getNumber(10, 5e3);
            var phaser = new Tone.Phaser({
                frequency: rand.getNumber(10, 3e3),
                octaves: rand.getInteger(1, 7),
                baseFrequency: rand.getNumber(1e3, 2e3)
            }).toMaster(), crusher = new Tone.BitCrusher(rand.getInteger(2, 6)).toMaster(), chorus = new Tone.Chorus(rand.getNumber(2, 6), rand.getNumber(1, 3), rand.getNumber(.2, 1)).toMaster();
            function connectGenerator(synth) {
                return .7 < rand.random() ? synth.connect(freeverb) : .7 < rand.random() ? synth.connect(delayFeedback) : .6 < rand.random() ? synth.connect(lowPass) : .5 < rand.random() ? synth.connect(phaser) : .5 < rand.random() ? synth.connect(chorus) : .5 < rand.random() ? synth.connect(crusher) : synth;
            }
            var kickTime = timeGenerator(1, 2), kick = connectGenerator(new Tone.MembraneSynth({
                envelope: {
                    sustain: 0,
                    attack: .02,
                    decay: .8
                },
                octaves: 10
            })), snare = (new Tone.Loop(function(time) {
                kick.triggerAttackRelease("C2", "1n", time);
            }, kickTime).start(0), connectGenerator(new Tone.NoiseSynth({
                volume: -5,
                envelope: {
                    attack: .001,
                    decay: .7,
                    sustain: 0
                },
                filterEnvelope: {
                    attack: .001,
                    decay: .6,
                    sustain: 0
                }
            }))), hihatClosed = (new Tone.Loop(function(time) {
                snare.triggerAttack(time);
            }, "2n").start("4n"), connectGenerator(new Tone.NoiseSynth({
                volume: -9,
                envelope: {
                    attack: .001,
                    decay: .1,
                    sustain: 0
                },
                filterEnvelope: {
                    attack: .001,
                    decay: .01,
                    sustain: 0
                }
            }))), hihatOpen = connectGenerator(new Tone.NoiseSynth({
                volume: -10,
                filter: {
                    Q: 1
                },
                envelope: {
                    attack: .01,
                    decay: .3
                },
                filterEnvelope: {
                    attack: .01,
                    decay: .03,
                    baseFrequency: 14e3,
                    octaves: -2.5,
                    exponent: 4
                }
            })), hihatTime = timeGenerator(2, 4), hihat = 0, synthArpeggio = (new Tone.Loop(function(time) {
                hihatClosed.triggerAttack(time), (hihat + 2) % 4 == 0 && hihatOpen.triggerAttack(time), 
                hihat++;
            }, hihatTime).start(0), connectGenerator(new Tone.DuoSynth()));
            synthArpeggio.voice0.oscillator.type = "sine", synthArpeggio.voice1.oscillator.type = "square";
            var synthPoly = connectGenerator(new Tone.PolySynth(6, Tone.Synth, {
                oscillator: {
                    partials: [ 0, 2, 3, 4 ]
                },
                envelope: {
                    attack: .3,
                    decay: .05,
                    sustain: 0,
                    release: .02
                }
            })), bass = connectGenerator(new Tone.MonoSynth({
                volume: -10,
                envelope: {
                    attack: .1,
                    decay: .3,
                    release: 2
                },
                filterEnvelope: {
                    attack: .001,
                    decay: .01,
                    sustain: .5,
                    baseFrequency: 200,
                    octaves: 2.6
                }
            })), bassTime = timeGenerator(2, 4), bassNotes = notes.slice(0, rand.getInteger(1, 2));
            new Tone.Sequence(function(time, note) {
                bass.triggerAttackRelease(note, bassTime, time);
            }, bassNotes).start(0).probability = .9;
            var noise = connectGenerator(new Tone.Noise({
                volume: -20,
                type: [ "white", "brown", "pink" ][rand.getInteger(0, 2)]
            })), noiseVolume = rand.getNumber(0, .4);
            .02 < noiseVolume && (noise.start(), Tone.Master.volume.rampTo(0, noiseVolume));
            var notesArpeggio = notes.slice(0, rand.getInteger(2, 6)), noteArpeggioCurrent = 0, noteArpeggioLoop = Math.pow(2, rand.getInteger(4, 8));
            Tone.Transport.scheduleRepeat(function(time) {
                var note = notesArpeggio[noteArpeggioCurrent % notesArpeggio.length];
                noteArpeggioCurrent < notesArpeggio.length && synthArpeggio.triggerAttackRelease(note, "16n", time), 
                noteArpeggioCurrent++, noteArpeggioCurrent %= noteArpeggioLoop;
            }, "16n");
            var polyTime = timeGenerator(1, 4), notesPoly = notes.slice(0, rand.getInteger(2, 6));
            Tone.Transport.scheduleRepeat(function(time) {
                synthPoly.triggerAttackRelease(notesPoly, "8n");
            }, polyTime), Tone.Transport.start();
        },
        resize: function() {}
    };
};

define("synth_ambient", [ "Tone" ], synth_ambient), (isNode = "undefined" != typeof module) && (Canvas = require("canvas"));

con = console;

var w = 500, sum = 1e3, v0 = 0, v1 = 0;

function createCanvas(w, h) {
    var c;
    return isNode ? c = new Canvas(w, h) : ((c = document.createElement("canvas")).width = w, 
    c.height = h), {
        canvas: c,
        ctx: c.getContext("2d")
    };
}

var pixels = (bmp = createCanvas(w, w)).ctx.getImageData(0, 0, w, w);

document.body.appendChild(bmp.canvas);

for (i = 0; i < w * w; i++) {
    v1 += 2911926141 + ((v0 += 2738958700 + (v1 << 4) ^ v1 + (sum += 2654435769) ^ 3355524772 + (v1 >> 5)) << 4) ^ v0 + sum ^ 2123724318 + (v0 >> 5);
    var index = 4 * i, r = Math.abs(v0) % 255, g = 0, b = Math.abs(v1) % 255;
    pixels.data[index + 0] = r, pixels.data[index + 1] = g, pixels.data[index + 3] = b, 
    pixels.data[index + 4] = 255;
}

bmp.ctx.putImageData(pixels, 0, 0), "undefined" != typeof module && (module.exports = {
    generate: generate
}), define("tentacle", function() {
    var sw, sh, cx, cy, TAU = 2 * Math.PI, bmp = dom.canvas(1, 1), ctx = bmp.ctx, numLines = 7, lines = [], lineLength = 30;
    function createJoint(j, i) {
        var pos = 0, x = 0, y = 20 * i, rot = 0, rad = 2 + .3 * (lineLength - i);
        return {
            pos: pos,
            rot: rot,
            x: x,
            y: y,
            move: function(px, py) {
                return pos += .01, rot = j / numLines * TAU + .24 * Math.sin(pos) * (i + 1), x = px + 10 * Math.sin(rot), 
                y = py + 10 * Math.cos(rot), ctx.fillStyle = "rgba(200, 160, 130, 0.3)", ctx.beginPath(), 
                ctx.drawCircle(cx + x, cy + y, rad), ctx.fill(), {
                    x: x,
                    y: y
                };
            }
        };
    }
    function render(time) {
        time < 1e4 && requestAnimationFrame(render), ctx.fillStyle = "black", ctx.rect(0, 0, sw, sh), 
        ctx.fill();
        for (var j = 0; j < numLines; j++) for (var p = {
            x: 0,
            y: 0
        }, i = 0; i < lineLength; i++) {
            p = lines[j][i].move(p.x, p.y);
        }
    }
    return {
        stage: bmp.canvas,
        init: function(options) {
            cx = (sw = 400) / 2, cy = (sh = 400) / 2, bmp.setSize(sw, sh);
            for (var j = 0; j < numLines; j++) {
                for (var line = [], i = 0; i < lineLength; i++) line.push(createJoint(j, i));
                lines.push(line);
            }
            render(0);
        }
    };
});

var tetris_cube = function() {
    var camera, scene, renderer, holder, stage = document.createElement("div"), mouse = {
        x: 0,
        y: 0
    }, sw = window.innerWidth, sh = window.innerHeight, theta = 0, gamma = 0, dim = 4, size = 40, cubes = [], groups = [], available = [];
    function onDocumentMouseMove(event) {
        event.preventDefault(), mouse.x = event.clientX / sw * 2 - 1, mouse.y = -event.clientY / sh * 2 + 1;
    }
    function render() {
        gamma += 4 * mouse.y, holder.rotation.x = .1 * gamma, holder.rotation.y = .1 * theta, 
        camera.lookAt(scene.position), renderer.render(scene, camera);
    }
    function animate() {
        requestAnimationFrame(animate), render();
    }
    return {
        stage: stage,
        init: function() {
            var light, material, geometry;
            function p(index) {
                return (index - dim / 2 + .5) * size;
            }
            function getPositionFromIndex(index) {
                return {
                    x: index % dim,
                    y: Math.floor(index / dim) % dim,
                    z: Math.floor(index / (dim * dim))
                };
            }
            scene = new THREE.Scene(), (camera = new THREE.PerspectiveCamera(70, sw / sh, 1, 1e4)).position.set(0, 100, 500), 
            scene.add(camera), (light = new THREE.DirectionalLight(16777215, 2)).position.set(1, 1, 1).normalize(), 
            scene.add(light), (light = new THREE.DirectionalLight(16711935, 2)).position.set(-1, 0, 0).normalize(), 
            scene.add(light), (renderer = new THREE.WebGLRenderer()).setSize(sw, sh), holder = new THREE.Group(), 
            scene.add(holder);
            for (var i = 0; i < dim * dim * dim; i++) {
                var c = (material = new THREE.MeshLambertMaterial({
                    color: 0
                }), geometry = new THREE.BoxGeometry(size, size, size), new THREE.Mesh(geometry, material)), _getPositionFromIndex = getPositionFromIndex(i), x = _getPositionFromIndex.x, y = _getPositionFromIndex.y, z = _getPositionFromIndex.z;
                available.push(i), c.position.set(p(x), p(y), p(z)), c.groupId = 0, cubes.push(c), 
                holder.add(c);
            }
            var globalGroupId = 1, loners = [], MODE_GROUP_EXPAND = "MODE_GROUP_EXPAND", MODE_LONER_UNITE = "MODE_LONER_UNITE", checkMode = MODE_GROUP_EXPAND;
            function checkNeighbours(sourceIndex) {
                function checkNeighbour(targetPosition) {
                    var _ref, x, y, z, targetIndex = (x = (_ref = targetPosition).x, y = _ref.y, z = _ref.z, 
                    x + y * dim + z * dim * dim);
                    checkMode === MODE_GROUP_EXPAND && 0 === cubes[targetIndex].groupId ? (setGroup(targetIndex, cubes[sourceIndex].groupId), 
                    count++) : checkMode === MODE_LONER_UNITE && 0 < cubes[targetIndex].groupId && (setGroup(sourceIndex, cubes[targetIndex].groupId), 
                    count++);
                }
                var availableIndex, _getPositionFromIndex2 = getPositionFromIndex(sourceIndex), x = _getPositionFromIndex2.x, y = _getPositionFromIndex2.y, z = _getPositionFromIndex2.z, count = 0, queue = [];
                function queueCheck(pos) {
                    queue.push(pos);
                }
                0 === x ? queueCheck({
                    x: x + 1,
                    y: y,
                    z: z
                }) : x === dim - 1 ? queueCheck({
                    x: x - 1,
                    y: y,
                    z: z
                }) : (queueCheck({
                    x: x - 1,
                    y: y,
                    z: z
                }), queueCheck({
                    x: x + 1,
                    y: y,
                    z: z
                })), 0 === y ? queueCheck({
                    x: x,
                    y: y + 1,
                    z: z
                }) : y === dim - 1 ? queueCheck({
                    x: x,
                    y: y - 1,
                    z: z
                }) : (queueCheck({
                    x: x,
                    y: y - 1,
                    z: z
                }), queueCheck({
                    x: x,
                    y: y + 1,
                    z: z
                })), 0 === z ? queueCheck({
                    x: x,
                    y: y,
                    z: z + 1
                }) : z === dim - 1 ? queueCheck({
                    x: x,
                    y: y,
                    z: z - 1
                }) : (queueCheck({
                    x: x,
                    y: y,
                    z: z - 1
                }), queueCheck({
                    x: x,
                    y: y,
                    z: z + 1
                })), rand.shuffle(queue);
                for (var q = 0; q < queue.length; q++) checkNeighbour(queue[q]);
                0 === count && loners.push(sourceIndex), checkMode === MODE_GROUP_EXPAND && (availableIndex = Math.floor(available.length * Math.random()), 
                available.length ? (setGroup(availableIndex = available[availableIndex], ++globalGroupId), 
                checkNeighbours(availableIndex)) : (con.log("all done...", groups), setTimeout(function() {
                    groups.forEach(function(group, groupIndex) {
                        var average = {
                            x: (groupIndex % 4 - 2) * size * 4,
                            y: Math.floor(groupIndex / 4 - 1) * size * 4,
                            z: 0
                        };
                        group.forEach(function(mesh) {
                            TweenMax.to(mesh.position, .5, {
                                x: mesh.position.x + average.x,
                                y: mesh.position.y + average.y,
                                z: mesh.position.z + average.z,
                                delay: .1 * groupIndex
                            });
                        });
                    });
                }, 1700)));
            }
            function setGroup(targetIndex, groupId) {
                var maxSize = checkMode === MODE_LONER_UNITE ? 6 : 4;
                if (groups[groupId] || (groups[groupId] = []), groups[groupId].length !== maxSize) {
                    var c = cubes[targetIndex];
                    groups[groupId].push(c), c.groupId = groupId;
                    var availableIndex = available.indexOf(targetIndex);
                    available.splice(availableIndex, 1);
                }
            }
            for (setGroup(0, globalGroupId), checkNeighbours(0), con.log(loners), rand.shuffle(loners), 
            con.log(loners), checkMode = MODE_LONER_UNITE, i = 0; i < loners.length; i++) checkNeighbours(loners[i]);
            for (i = 0; i < cubes.length; i++) {
                var col = 25700 | 20 * (c = cubes[i]).groupId % 255 << 16;
                c.material.color.setHex(col);
            }
            stage.appendChild(renderer.domElement), document.addEventListener("mousemove", onDocumentMouseMove, !1), 
            render(), animate();
        }
    };
};

define("tetris_cube", tetris_cube);

con = console;

if (isNode = "undefined" != typeof module) rand = require("./rand.js"), dom = require("./dom.js"), 
colours = require("./colours.js");

var text_grid = function() {
    var size, sw, sh, blockW, blockH, rows, cols, phrase, settings = {
        boxes: {
            label: "Boxes",
            min: 2,
            max: 64,
            cur: 7,
            type: "Number"
        },
        phrase: {
            label: "Phrase",
            cur: "D Q36RUCN    FGVNFVGQax6q2 b",
            type: "String"
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !0
        }
    }, bmp = dom.canvas(100, 100), ctx = bmp.ctx, widthOnHeight = .6;
    function drawBlock(index, x, y) {
        ctx.save(), ctx.translate(x * blockW, y * blockH);
        try {
            !function(index) {
                var str = phrase[index], xo = 0, yo = .8 * blockH, fontSize = .2 * size;
                ctx.font = fontSize + "px Helvetica";
                var gradient = ctx.createLinearGradient(0, -blockH, 0, 0);
                gradient.addColorStop(0, colours.getRandomColour()), gradient.addColorStop(1, colours.getRandomColour()), 
                ctx.fillStyle = gradient;
                var textDimensions = ctx.measureText(str).width;
                xo = (blockW - textDimensions) / 2, ctx.translate(xo, yo), ctx.fillText(str, 0, 0);
            }(index);
        } catch (err) {
            con.log("err drawText", err);
        }
        ctx.restore();
    }
    function init(options) {
        size = options.size, sh = sw = size, options.settings && (settings = options.settings), 
        progress("settings:initialised", settings), phrase = settings.phrase.cur, cols = settings.boxes.cur, 
        rows = Math.floor(phrase.length / cols), blockW = Math.ceil(1 / cols * size), blockH = Math.ceil(blockW / widthOnHeight), 
        bmp.setSize(sw, sh), ctx.clearRect(0, 0, sw, sh), colours.getRandomPalette(), colours.setPaletteRange(3), 
        render();
    }
    function render() {
        settings.background.cur, function renderBatch(batch) {
            var total = rows * cols;
            var x = batch % cols;
            var y = Math.floor(batch / cols);
            drawBlock(batch, x, y);
            batch < total - 1 ? (progress("render:progress", batch / total), setTimeout(function() {
                renderBatch(batch + 1);
            }, 1)) : progress("render:complete", bmp.canvas);
        }(0);
    }
    return {
        stage: bmp.canvas,
        init: init,
        render: render,
        settings: settings,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
};

isNode ? module.exports = text_grid() : define("text_grid", text_grid), define("triangles", function() {
    var camera, scene, renderer, holder, lightA, lightB, lightC, ambientLight, triangleShape, sw = window.innerWidth, sh = window.innerHeight, grid = [], TAU = 2 * Math.PI, triangles = 48, triSize = 130, theta = 1 / 6 * Math.PI, lenA = triSize / Math.cos(theta), lenB = lenA * Math.sin(theta), lenC = (lenA + lenB) / 2;
    function triangle() {
        triangleShape = triangleShape || function() {
            for (var shape = new THREE.Shape(), triRadius = .99 * lenA, i = 0; i < 4; i++) {
                var a = i / 3 * TAU, point = {
                    x: Math.sin(a) * triRadius,
                    y: Math.cos(a) * triRadius
                };
                0 == i ? shape.moveTo(point.x, point.y) : shape.lineTo(point.x, point.y);
            }
            return shape;
        }();
        var colour = .98 < Math.random() ? 1376239 : .99 < Math.random() ? 16716933 : 4274759, geometry = new THREE.ShapeGeometry(triangleShape), material = new THREE.MeshPhongMaterial({
            color: colour,
            side: THREE.DoubleSide,
            specular: 16777215,
            shininess: rand.getNumber(40, 60)
        });
        return {
            mesh: new THREE.Mesh(geometry, material),
            falling: !1
        };
    }
    function resize(e) {
        sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
        renderer.setSize(sw, sh);
    }
    function getZ(zi) {
        return zi * lenC + (zi % 2 ? 0 : lenC - lenB);
    }
    function fall(tri) {
        tri.falling = !0, TweenMax.to(tri.mesh.position, 2.4, {
            y: -5e3,
            ease: Quint.easeIn
        }), TweenMax.to(tri.mesh.scale, .5, {
            x: .1,
            y: .1,
            z: .1,
            delay: 2,
            ease: Quint.easeIn
        }), TweenMax.to(tri.mesh.rotation, 2.5, {
            x: rand.getNumber(-2, 2),
            y: rand.getNumber(-2, 2),
            z: rand.getNumber(-2, 2),
            ease: Quint.easeIn,
            onComplete: function(tri) {
                return function() {
                    var pos = tri.origin.pos, rot = tri.origin.rot;
                    tri.rowIndex -= triangles, pos.z = tri.mesh.position.z - getZ(triangles) + 45, tri.mesh.scale.set(1, 1, 1), 
                    tri.mesh.position.set(pos.x, pos.y, pos.z), tri.mesh.rotation.set(rot.x, rot.y, rot.z), 
                    tri.falling = !1;
                };
            }(tri)
        });
    }
    function render(time) {
        requestAnimationFrame(render), holder.rotation.z = .05 * Math.sin(5e-4 * time);
        var fallLimitZ = -1e3 - 750 * Math.sin(3e-4 * time);
        function moveLight(light, x, y, z) {
            var sc = 3e-5 * (time + 1e4);
            light.position.set(5 * Math.sin(x * sc), 1, Math.sin(z * sc) - 1);
        }
        grid.forEach(function(tri, index) {
            tri.mesh.position.z += 15, tri.mesh.position.z > fallLimitZ && 0 == tri.falling && .9 < Math.random() && fall(tri);
        }), moveLight(lightA, 15, 0, 12), moveLight(lightB, 14, 0, 13), moveLight(lightC, 20, 0, 16), 
        renderer.render(scene, camera);
    }
    return {
        init: function() {
            (scene = new THREE.Scene()).fog = new THREE.FogExp2(0, 5e-4), (camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 2e4)).position.set(0, 1e3, 1300), 
            camera.lookAt(scene.position), scene.add(camera), lightA = new THREE.DirectionalLight(16761024, .8), 
            scene.add(lightA), lightB = new THREE.DirectionalLight(16761087, .8), scene.add(lightB), 
            lightC = new THREE.DirectionalLight(12632319, .8), scene.add(lightC), ambientLight = new THREE.AmbientLight(16777215, .8), 
            scene.add(ambientLight), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh), holder = new THREE.Group(), scene.add(holder);
            for (var p = 0; p < triangles * triangles; p++) {
                var tri = triangle();
                holder.add(tri.mesh);
                var xi = p % triangles - triangles / 2 + .5, zi = Math.floor(p / triangles), rowEven = zi % 2, row4th = Math.floor(zi / 2) % 2, pos = {
                    x: 2 * xi * triSize + (rowEven ^ row4th ? -triSize : 0),
                    y: 0,
                    z: -5e3 + getZ(zi)
                }, rot = {
                    x: Math.PI / 2,
                    y: 0,
                    z: rowEven * Math.PI
                };
                tri.rowIndex = zi, tri.mesh.position.set(pos.x, pos.y, pos.z), tri.mesh.rotation.set(rot.x, rot.y, rot.z), 
                tri.origin = {
                    pos: pos,
                    rot: rot
                }, grid.push(tri);
            }
            document.body.appendChild(renderer.domElement), dom.on(window, [ "resize" ], resize), 
            render(0);
        }
    };
});

var tunnel_tour_three = function() {
    var camera, scene, renderer, mouse = {
        x: 0,
        y: 0
    }, camPos = {
        x: 0,
        y: 0,
        z: 0
    }, sw = window.innerWidth, sh = window.innerHeight;
    var segmentIndex = 0, segmentLength = 200, segmentsInitial = 10;
    function createStraight(groupPos) {
        var group = new THREE.Group();
        group.position.set(groupPos.x, groupPos.y, groupPos.z);
        for (var min, max, props, material, geometry, size = {
            width: 20,
            height: 20,
            depth: 100
        }, i = 0, il = parseInt((min = 3, max = 15, Math.random() * (max - min) + min)); i < il; i++) {
            var a = i / il * Math.PI * 2, x = 200 * Math.sin(a), y = 200 * Math.cos(a), box = (props = size, 
            void 0, material = new THREE.MeshLambertMaterial({
                color: 10526880
            }), geometry = new THREE.BoxGeometry(props.width, props.height, props.depth), new THREE.Mesh(geometry, material));
            box.position.set(x, y, 0), box.rotation.set(0, 0, -a), group.add(box);
        }
        scene.add(group);
    }
    function createSection(index) {
        createStraight({
            x: 0,
            y: 0,
            z: index * -segmentLength
        });
    }
    function render(time) {
        camPos.x = 100 * mouse.x, camPos.y = 100 * mouse.y, camPos.z -= 20, camPos.z % segmentLength == 0 && (segmentIndex = -Math.floor(camPos.z / segmentLength), 
        createSection(segmentsInitial + segmentIndex)), camera.position.set(camPos.x, camPos.y, camPos.z), 
        renderer.render(scene, camera), requestAnimationFrame(render);
    }
    return {
        init: function() {
            scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 1e4), 
            scene.add(camera);
            var lightAbove = new THREE.DirectionalLight(16777215, .5);
            lightAbove.position.set(0, 200, 100), scene.add(lightAbove), (renderer = new THREE.WebGLRenderer({
                antialias: !0
            })).setSize(sw, sh);
            for (var j = 0, jl = segmentsInitial; j < jl; j++) createSection(j);
            function listen(eventNames, callback) {
                for (var i = 0; i < eventNames.length; i++) window.addEventListener(eventNames[i], callback);
            }
            document.body.appendChild(renderer.domElement), listen([ "resize" ], function(e) {
                sw = window.innerWidth, sh = window.innerHeight, camera.aspect = sw / sh, camera.updateProjectionMatrix(), 
                renderer.setSize(sw, sh);
            }), listen([ "mousemove", "touchmove" ], function(e) {
                e.preventDefault(), e.changedTouches && e.changedTouches[0] && (e = e.changedTouches[0]), 
                mouse.x = e.clientX / sw * 2 - 1, mouse.y = -e.clientY / sh * 2 + 1;
            }), render();
        },
        resize: function() {}
    };
};

define("tunnel_tour_three", tunnel_tour_three);

con = console;

if (isNode = "undefined" != typeof module) rand = require("./rand.js"), dom = require("./dom.js"), 
colours = require("./colours.js");

var typography = function() {
    var size, sw, sh, block, settings = {
        boxes: {
            label: "Boxes",
            min: 2,
            max: 64,
            cur: 4,
            type: "Number"
        },
        background: {
            type: "Boolean",
            label: "Background",
            cur: !1
        }
    }, bmp = dom.canvas(100, 100), ctx = bmp.ctx, rows = 4, cols = 4;
    function typoInteger(min, max) {
        return Math.round(rand.getNumber(min, max));
    }
    for (var numerals = [], numeralsLength = typoInteger(1, 5), n = 0; n++ < numeralsLength; ) numerals.push(typoInteger(0, 9));
    function drawBlock(x, y) {
        if (ctx.save(), ctx.translate(x * block, y * block), .6 < rand.random()) {
            var w = typoInteger(1, 3), h = typoInteger(1, 3);
            ctx.fillStyle = colours.getRandomColour(), ctx.fillRect(0, 0, block * w, block * h);
        }
        try {
            .8 < rand.random() && (border = .1 * block, ctx.fillStyle = colours.getRandomColour(), 
            ctx.fillRect(border, border, block - 2 * border, block - 2 * border));
        } catch (err) {
            con.log("err drawInnerBlock", err);
        }
        var border, angle, xo, yo, fontSize;
        try {
            .9 < rand.random() && function() {
                for (var divs = Math.pow(2, Math.ceil(3 * rand.random())), size = block / divs, i = 0; i < divs * divs; i++) {
                    var x = i % divs, y = Math.floor(i / divs);
                    ctx.fillStyle = colours.getRandomColour(), ctx.fillRect(x * size, y * size, size, size);
                }
            }();
        } catch (err) {
            con.log("err drawSubdivion", err);
        }
        try {
            .9 < rand.random() && function() {
                var rotation = Math.round(4 * rand.random()) / 4 * Math.PI, rowSize = Math.round((2 + Math.floor(8 * rand.random())) * size / 1e3), patternColoured = dom.canvas(rowSize, 2 * rowSize);
                ctx.save(), ctx.beginPath(), ctx.rect(0, 0, block, block), ctx.rotate(rotation), 
                patternColoured.ctx.fillStyle = colours.getNextColour();
                for (var py = 0; py < block / rowSize * 4; py++) patternColoured.ctx.fillRect(0, py * rowSize * 2, block * rowSize, rowSize);
                ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat"), ctx.fill(), 
                ctx.restore();
            }();
        } catch (err) {
            con.log("err drawPattern", err);
        }
        try {
            .8 < rand.random() && function() {
                ctx.save();
                var angle = Math.floor(4 * rand.random()) / 4;
                ctx.rotate(angle * Math.PI * 2);
                var majors = Math.pow(2, typoInteger(1, 4)), minors = typoInteger(1, 4), majorSize = typoInteger(5, 10) * size / 400, minorSize = majorSize * rand.getNumber(.2, .8);
                ctx.fillStyle = colours.getRandomColour();
                for (var width = 1 * size / 300, m = 0; m < majors; m++) {
                    var x = m / majors * block;
                    ctx.fillRect(x, 0, width, majorSize);
                    for (var n = 0; n < minors; n++) {
                        var xn = x + n / minors * block / majors;
                        ctx.fillRect(xn, 0, width, minorSize);
                    }
                }
                ctx.restore();
            }();
        } catch (err) {
            con.log("err drawRuler", err);
        }
        try {
            .4 < rand.random() && (angle = Math.floor(4 * rand.random()) / 4, xo = rand.random() * block, 
            yo = rand.random() * block, fontSize = Math.round(Math.pow(2, 2 + 6 * rand.random()) * size / 400), 
            ctx.rotate(angle * Math.PI * 2), ctx.translate(xo, yo), ctx.font = fontSize + "px Helvetica", 
            ctx.fillStyle = colours.getRandomColour(), ctx.fillText(function() {
                var strings = [ "Typography", numerals ], str = strings[Math.floor(rand.random() * strings.length)], ss = Math.round(rand.random() * str.length), se = ss + Math.round(rand.random() * (str.length - ss));
                switch (str = str.substr(ss, se), Math.floor(3 * rand.random())) {
                  case 0:
                    str = str.toLowerCase();
                    break;

                  case 1:
                    str = str.toUpperCase();
                }
                return str;
            }(), 0, 0));
        } catch (err) {
            con.log("err drawText", err);
        }
        ctx.restore();
    }
    function init(options) {
        size = options.size, sh = sw = size, settings.background.cur = !1, settings.boxes.cur = 4, 
        options.settings && (settings = options.settings), progress("settings:initialised", settings), 
        cols = settings.boxes.cur, rows = settings.boxes.cur, block = Math.ceil(1 / cols * size), 
        bmp.setSize(sw, sh), ctx.clearRect(0, 0, sw, sh), colours.getRandomPalette(), colours.setPaletteRange(3), 
        render();
    }
    function render() {
        settings.background.cur && (ctx.fillStyle = colours.getCurrentColour(), ctx.fillRect(0, 0, sw, sh)), 
        function renderBatch(batch) {
            var total = rows * cols;
            var x = batch % cols;
            var y = Math.floor(batch / cols);
            drawBlock(x, y);
            batch < total ? (progress("render:progress", batch / total), setTimeout(function() {
                renderBatch(batch + 1);
            }, 5)) : progress("render:complete", bmp.canvas);
        }(0);
    }
    return numerals = numerals.join(""), {
        stage: bmp.canvas,
        init: init,
        render: render,
        settings: settings,
        update: function(settings) {
            init({
                size: size,
                settings: settings
            });
        }
    };
};

isNode ? module.exports = typography() : define("typography", typography);

con = console;

var unknown = function() {
    var bmp = dom.canvas(800, 800), ctx = bmp.ctx;
    return {
        stage: bmp.canvas,
        resize: function(w, h) {
            bmp.canvas.setSize(w, h);
        },
        init: function() {
            var y = -10;
            colours.getRandomPalette();
            for (var rOffset = rand.getNumber(0, 2), rBase = rand.getNumber(1, 2), rPower = rand.getNumber(1.01, 1.5), gOffset = rand.getNumber(-2, 2), gBase = rand.getNumber(8e3, 1e4), gPower = rand.getNumber(.4, .6), yOffset = rand.getNumber(-2, 2), yBase = rand.getNumber(1.2, 2), yPower = rand.getNumber(1.2, 1.6), yMultiplier = rand.getNumber(2, 3), i = 0; i < 10; i++) {
                var r = Math.pow((rOffset + 10 - i) * rBase, rPower), g = Math.pow((gOffset + 10 - i) * gBase, gPower);
                y += Math.pow((yOffset + 10 - i) * yBase, yPower) * yMultiplier, ctx.fillStyle = colours.getNextColour();
                for (var cols = i + 1, j = 0; j < cols; j++) {
                    var x = 400 + (j - (cols - 1) / 2) / cols * g;
                    ctx.beginPath(), ctx.drawCircle(x, y, r), ctx.closePath(), ctx.fill();
                }
            }
        },
        kill: function() {}
    };
};

(isNode = "undefined" != typeof module) ? module.exports = unknown() : define("unknown", unknown);

isNode = "undefined" != typeof module;

var voronoi = function() {
    var dot, sites, sizeX, sizeY, con = console, site = [], regions = [], bounds = [];
    function sq2(x1, x2, y1, y2) {
        var dx = x1 - x2, dy = y1 - y2;
        return dx * dx + dy * dy;
    }
    function nearest_site(x1, y1) {
        var k, d, ret = 0, dist = 0;
        for (k = 0; k < sites; k++) {
            d = sq2(x1, site[k][0], y1, site[k][1]), (!k || d < dist) && (dist = d, ret = k);
        }
        return ret;
    }
    function calcRegionBounds() {
        for (k = 0; k < sites; k++) bounds[k] = {
            x: bounds[k][3] * dot,
            y: bounds[k][0] * dot,
            width: (bounds[k][1] - bounds[k][3]) * dot,
            height: (bounds[k][2] - bounds[k][0]) * dot
        };
    }
    return {
        init: function(options) {
            return dot = options.dot || 1, sites = options.sites || 10, sizeX = options.sizeX || 200, 
            sizeY = options.sizeY || 200, {
                width: sizeX * dot,
                height: sizeY * dot
            };
        },
        genMap: function() {
            var i, j, nearest = [], pixels = sizeX * sizeY, a = new Date().getTime();
            for (i = 0; i < sizeY; i++) for (j = 0; j < sizeX; j++) nearest[index = i * sizeX + j] = nearest_site(j, i), 
            index % 1e5 == 0 && con.log("findSites", Math.round(index / pixels * 100) + "%");
            var b = new Date().getTime();
            for (con.log("Found sites", b - a), i = 0; i < sizeY; i++) for (j = 0; j < sizeX; j++) {
                var index, ns = nearest[index = i * sizeX + j];
                regions[ns].push([ j, i ]), null == bounds[ns][0] ? bounds[ns][0] = i : i < bounds[ns][0] && (bounds[ns][0] = i), 
                null == bounds[ns][1] ? bounds[ns][1] = j : j > bounds[ns][1] && (bounds[ns][1] = j), 
                null == bounds[ns][2] ? bounds[ns][2] = i : i > bounds[ns][2] && (bounds[ns][2] = i), 
                null == bounds[ns][3] ? bounds[ns][3] = j : j < bounds[ns][3] && (bounds[ns][3] = j), 
                index % 1e5 == 0 && con.log("generatingRegion", Math.round(index / pixels * 100) + "%");
            }
            var c = new Date().getTime();
            con.log("Generated regions", c - b), calcRegionBounds();
        },
        genPoints: function(pointIterator) {
            if (null == pointIterator) return con.warn("need to pass in a pointIterator function, which returns an array");
            for (var k = 0; k < sites; k++) site[k] = pointIterator(k, sites), regions[k] = [], 
            bounds[k] = [];
        },
        drawRegions: function(renderRegion) {
            for (null == renderRegion && con.warn("need to pass in a renderRegion function."), 
            k = 0; k < sites; k++) renderRegion(regions[k], bounds[k]), con.log("drawRegions", Math.round(k / sites * 100) + "%");
        },
        drawRegionBounds: function(ctx) {
            for (k = 0; k < sites; k++) {
                ctx.fillStyle = "rgba(0,0,255,0.2)";
                var b = bounds[k];
                ctx.fillRect(b.x, b.y, b.width, b.height);
            }
        },
        drawSites: function(ctx) {
            for (k = 0; k < sites; k++) {
                ctx.fillStyle = "blue";
                var x = site[k][0] * dot, y = site[k][1] * dot;
                ctx.fillRect(x - 1, y - 1, 2, 2);
            }
        }
    };
}();

isNode && (module.exports = voronoi), colours = require("./colours.js"), voronoi = require("./voronoi.js"), 
stripes = require("./voronoi_stripes.js"), stripes.generate(process.argv[2]), (isNode = "undefined" != typeof module) && (Canvas = require("canvas"), 
fs = require("fs"));

con = console, dot = 1;

var settings, sizeX = sizeY = isNode ? 4e3 : 400, total = 10, current = 8;

function frand(x) {
    return Math.random() * x;
}

function positionPoint(index, total) {
    var dim = Math.floor(Math.sqrt(total)), x = index % dim + .5, y = Math.floor(index / dim) + .5, blockX = width / dim / dot, blockY = height / dim / dot, centreX = width / 2 / dot, centreY = height / 2 / dot, radius = index / total * centreX, angle = index / total * Math.PI * index * (.5 + frand(20));
    return [ [ frand(sizeX), frand(sizeY) ], [ centreX + Math.sin(angle) * width / 3, centreY + Math.cos(angle) * height / 3 ], [ centreX + Math.sin(angle) * radius, centreY + Math.cos(angle) * radius ], [ (x - settings.pointBias / 2 + frand(settings.pointBias)) * blockX, (y - settings.pointBias / 2 + frand(settings.pointBias)) * blockY ] ][settings.pointMethod];
}

function renderRegion(region, bounds) {
    var pattern = createPattern((bounds.width > bounds.height ? bounds.width : bounds.height) + 10), regionCanvas = createCanvas(width, height);
    regionCanvas.ctx.globalCompositeOperation = "source-over", regionCanvas.ctx.fillStyle = "red";
    for (var r = 0; r < region.length; r++) {
        var x = region[r][0], y = region[r][1];
        regionCanvas.ctx.fillRect(x * dot, y * dot, dot, dot);
    }
    regionCanvas.ctx.globalCompositeOperation = "source-in", regionCanvas.ctx.drawImage(pattern, bounds.x - 5, bounds.y - 5), 
    ctx.drawImage(regionCanvas.canvas, 0, 0);
}

function createPattern(size) {
    var half = size / 2, canvas = createCanvas(size, size), ctx = canvas.ctx;
    ctx.translate(half, half), ctx.rotate(settings.baseRotation + frand(settings.varyRotation)), 
    ctx.translate(-half, -half), settings.varyDuotone ? (colours.setColourIndex(1), 
    ctx.fillStyle = colours.getCurrentColour()) : ctx.fillStyle = colours.getRandomColour();
    var colour, padding = Math.sqrt(half * half * 2) - half;
    settings.varyPerRegion && (settings.lineScale = .5 + frand(settings.overallScale), 
    settings.lineSize = 1 + frand(10) * settings.lineScale, settings.lineGap = 2 + frand(3) * settings.lineScale), 
    settings.varyDuotone && (colour = colours.getNextColour());
    for (var y = -padding; y < size + padding; ) settings.varyPerLine && (settings.lineSize = 1 + frand(10) * settings.lineScale, 
    settings.lineGap = 2 + frand(3) * settings.lineScale), settings.varyDuotone || (colour = colours.getRandomColour()), 
    ctx.fillStyle = colour, ctx.fillRect(-padding, y, size + 2 * padding, settings.lineSize), 
    y += settings.lineSize + settings.lineGap;
    return canvas.canvas;
}

function createCanvas(w, h) {
    var c;
    return isNode ? c = new Canvas(w, h) : ((c = document.createElement("canvas")).width = w, 
    c.height = h), {
        canvas: c,
        ctx: c.getContext("2d")
    };
}

(settings = {}).overallScale = 50 + frand(150), settings.pointMethod = ~~(4 * Math.random()), 
settings.pointBias = frand(2), settings.lineScale = settings.overallScale, settings.lineSize = 1 + frand(100), 
settings.lineGap = 1 + frand(100), settings.baseRotation = 2 * Math.PI, settings.varyRotation = Math.PI * (.5 < Math.random() ? 2 : .2), 
settings.varyPerRegion = !1, settings.varyPerLine = !1, settings.varyDuotone = !1, 
settings.varyDuotone && colours.setRandomPalette(0);

var v = voronoi.init({
    dot: dot,
    sizeX: sizeX,
    sizeY: sizeY
}), width = v.width, height = v.height, canvas = createCanvas(width, height);

isNode || document.body.appendChild(canvas.canvas);

ctx = canvas.ctx;

var q0 = createCanvas(width / 2, height / 2), q1 = createCanvas(width / 2, height / 2), q2 = createCanvas(width / 2, height / 2), q3 = createCanvas(width / 2, height / 2);

function drawQuarter(source, target, q) {
    var x = q % 2 * -width / 2, y = Math.floor(q / 2) * -height / 2;
    con.log("drawQuarter", q, x, y), target.canvas.width = target.canvas.width, target.ctx.drawImage(source.canvas, x, y);
    var out = fs.createWriteStream(__dirname + "/../export/shirt" + current + "_" + q + ".png"), stream = target.canvas.pngStream();
    stream.on("data", function(chunk) {
        out.write(chunk);
    }), stream.on("end", function() {
        console.log("saved png");
    });
}

function saveFile(canvas) {
    isNode ? canvas.toBuffer(function(err, buf) {
        err ? con.log(err) : fs.writeFile(__dirname + "/../export/shirt" + current + ".png", buf, function() {
            con.log("writeFile", "shirt" + current + ".png");
        });
    }) : con.warn("browser export not written");
}

function generate(num) {
    current = num, settings.sites = 16 + frand(20), settings.varyDuotone = .5 < Math.random();
    var txt = [ "sites", "overallScale", "pointMethod", "pointBias", "baseRotation", "varyRotation", "varyDuotone", "varyPerRegion", "varyPerLine", "lineScale", "lineSize", "lineGap" ].map(function(v) {
        return v + ":" + settings[v];
    }).join("\n");
    isNode && fs.writeFile(__dirname + "/../export/_shirt" + current + ".txt", txt), 
    con.log(txt), con.log("==================="), canvas.canvas.width = canvas.canvas.width, 
    voronoi.init({
        dot: dot,
        sites: settings.sites,
        sizeX: sizeX,
        sizeY: sizeY
    }), colours.setRandomPalette(), con.log("generate", current, total), voronoi.genPoints(positionPoint), 
    voronoi.genMap(), voronoi.drawRegions(renderRegion), saveFile(canvas.canvas);
}

function next() {
    if (++current < total) {
        var delay = 5e3;
        current % 5 == 0 && (delay = 5e4), con.log("delaying", delay / 1e3, "seconds"), 
        setTimeout(generate, delay);
    }
}

isNode || generate(0), "undefined" != typeof module && (module.exports = {
    generate: generate
});

con = console, sw = window.innerWidth, sh = window.innerHeight, canvas = dom.canvas(sw, sh);

var hitpixels, numInitial, hit = dom.canvas(sw, sh), zones = (ctx = canvas.ctx, 
circleRads = 2 * Math.PI, numCurrent = numInitial = 30, numMax = 3 * numInitial, 
particles = [], []);

function moveParticle(p) {
    p.dying && p.age++, p.dirFloat += (Math.random() - .5) * Math.PI * .5, p.dir -= .01 * (p.dir - p.dirFloat), 
    p.vx = Math.cos(p.dir) * p.speed, p.vy = Math.sin(p.dir) * p.speed, p.x += p.vx, 
    p.y += p.vy;
    p.x > sw + 100 && (p.x -= sw + 200, p.px = p.x), p.x < -100 && (p.x += sw + 200, 
    p.px = p.x), p.y > sh + 100 && (p.y -= sh + 200, p.py = p.y), p.y < -100 && (p.y += sh + 200, 
    p.py = p.y);
    var r = 2;
    p.dying && (r /= 1 + .01 * p.age);
    var x = p.x, y = p.y, index = 4 * (Math.floor(p.x) + Math.floor(p.y) * sw), isRed = hitpixels.data[index];
    isRed || (ctx.lineWidth = r, ctx.strokeStyle = p.palette, ctx.beginPath(), ctx.moveTo(p.px, p.py), 
    ctx.lineTo(x, y), ctx.stroke()), isRed && (p.dir = Math.random() * Math.PI * 2), 
    p.px = p.x, p.py = p.y, p.dying && 500 < p.age ? killParticle(p) : 0 == p.children && numCurrent < numMax && .99 < Math.random() && spawnParticle(p);
}

function killParticle(p) {
    var index = particles.indexOf(p);
    particles.splice(index, 1), numCurrent--;
}

function generateParticle(parent) {
    if (parent) return {
        age: 0,
        children: 0,
        dir: parent.dir,
        dirFloat: parent.dirFloat,
        dying: !1,
        palette: colours.mutateColour(parent.palette, 10),
        speed: parent.speed,
        vx: parent.vx,
        vy: parent.vy,
        x: parent.x,
        y: parent.y,
        px: parent.x,
        py: parent.y
    };
    var x = Math.random() * sw, y = Math.random() * sh;
    return {
        age: 0,
        children: 0,
        dir: Math.random() * Math.PI * 2,
        dirFloat: 0,
        dying: !1,
        palette: colours.getNextColour(),
        speed: 2.5 * Math.random() + 2.5,
        vx: 0,
        vy: 0,
        x: x,
        y: y,
        px: x,
        py: y
    };
}

function spawnParticle(parent) {
    parent.dying = !0, parent.children++, particles[numCurrent] = generateParticle(parent), 
    numCurrent++;
}

function generate() {
    zones.push({
        x: 50,
        y: 50,
        w: 100,
        h: 100
    }), zones.push({
        x: 100,
        y: 250,
        w: 20,
        h: 100
    }), zones.push({
        x: 300,
        y: 50,
        w: 100,
        h: 300
    });
    for (var j = 0; j < zones.length; j++) {
        var z = zones[j];
        hit.ctx.fillStyle = "rgba(50,0,0,1)", hit.ctx.fillRect(z.x, z.y, z.w, z.h);
    }
    hitpixels = hit.ctx.getImageData(0, 0, sw, sh);
    for (var i = 0; i < numInitial; i++) particles[i] = generateParticle();
}

function render(time) {
    ctx.fillStyle = "rgba(0,0,0,0.04)", ctx.fillRect(0, 0, sw, sh), ctx.drawImage(hit.canvas, 0, 0);
    for (var i = 0; i < numCurrent; i++) moveParticle(particles[i]);
    requestAnimationFrame(render);
}

colours.getRandomPalette(), window.addEventListener("resize", function() {
    return con.warn("resize disabled!");
}), generate(), document.body.appendChild(canvas.canvas), render(0);