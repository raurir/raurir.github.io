"use strict";

var linked_line = function linked_line() {
	// console.log('linked_line');
	var TAU = Math.PI * 2;

	var randomInst = rand.instance();
	console.log("set seed");
	randomInst.setSeed(459874);

	try {} catch (e) {
		console.warn("linked_line - failed to set seed", e);
	}

	var generate = function generate(size, preoccupied) {
		var debug = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

		/*
  param `preoccupied` hahahaha!
  array of masked out coordinates
  */
		return new Promise(function (resolve, reject) {
			if (Math.round(size / 2) === size / 2 || Math.round(size) !== size) {
				alert("linked_line - invalid size, needs to be odd integer - you supplied: " + size);
				return console.warn("linked_line - invalid size, needs to be odd integer - you supplied:", size);
			}
			// size has to be odd, want the maze to start and end in the middle of a bouding wall.
			// console.log('linked_line generate', size);

			var attempts = 0;

			var wid = size;
			var hei = size;
			var block = 2; // this has to be 2, since we're drawing a maze with lines between points rather than filling/carving.
			var blockZoom = 4;
			var sw = (wid + 0.5) * block;
			var sh = (hei + 0.5) * block;
			var swZ = (wid + 0.5) * block * blockZoom;
			var shZ = (hei + 0.5) * block * blockZoom;
			var bmp = dom.canvas(sw, sh);
			var bmpZ = dom.canvas(swZ, shZ);
			var bmpW = dom.canvas(swZ, shZ);
			var bmpR = dom.canvas(swZ, shZ);
			var ctx = bmp.ctx;
			var ctxZ = bmpZ.ctx; // maze detector
			var ctxW = bmpW.ctx; // red & white filled pixels
			var ctxR = bmpR.ctx; // grey & white draw rectangle

			if (debug) {
				document.body.appendChild(bmp.canvas);
				document.body.appendChild(bmpZ.canvas);
				document.body.appendChild(bmpW.canvas);
				document.body.appendChild(bmpR.canvas);
			}

			var occupied = {
				array: [],
				// twoD: [],
				oneD: []
				// neighbourless: []
			};
			var backup = {};
			var store = function store() {
				backup.array = occupied.array.slice();
				backup.oneD = occupied.oneD.slice();
				// backup.neighbourless = occupied.neighbourless.slice();
				// backup.twoD = occupied.twoD.slice();
			};
			var restore = function restore() {
				occupied.array = backup.array.slice();
				occupied.oneD = backup.oneD.slice();
				// occupied.neighbourless = backup.neighbourless.slice();
				// occupied.twoD = backup.twoD.slice();
			};

			var preoccupy = function preoccupy(options) {
				var item = {
					x: options.x,
					y: options.y,
					type: "NULL"
				};
				occupied.oneD[getIndex(item.x, item.y)] = item;
				occupied.array.push(item);
			};

			var makeItem = function makeItem(options) {
				var x = options.x == undefined ? randomInst.random() : options.x;
				var y = options.y == undefined ? randomInst.random() : options.y;
				var item = {
					x: x,
					y: y,
					type: "TUNNEL",
					surrounded: false,
					prev: options.prev,
					next: options.next
				};

				// occupied.twoD[y][x] = item;
				occupied.oneD[getIndex(x, y)] = item;
				occupied.array.push(item);
				// occupied.neighbourless.push(item);

				return item;
			};

			var first, last;

			var getIndex = function getIndex(x, y) {
				return y * wid + x;
			};
			var getXY = function getXY(index) {
				return { x: index % sw, y: Math.floor(index / sw) };
			};

			var start = function start() {
				// console.log("linked_line init");
				for (var y = 0; y < hei; y++) {
					for (var x = 0; x < wid; x++) {
						occupied.oneD.push(-1);
						ctx.fillRect(x * block - 2 + block / 2, y * block - 2 + block / 2, 4, 4);
					}
				}

				if (preoccupied) {
					// console.log("preoccupied", preoccupied);
					preoccupied.forEach(preoccupy);
				}

				var newItem, lastItem;
				for (var i = 0; i < hei; i++) {
					// right angle
					if (i < hei / 2) {
						x = i;
						y = hei / 2 - 0.5; //randomInst.getInteger(0, wid - 1);
					} else {
						x = wid / 2 - 0.5;
						y = i;
					}
					// straigh down
					// x = wid / 2 - 0.5;
					// y = i;

					if (i == 0) {
						// first
						newItem = makeItem({ x: x, y: y });
						first = newItem;
					} else {
						newItem = makeItem({ x: x, y: y, prev: lastItem });
						lastItem.next = newItem;
					}
					lastItem = newItem;
				}
				last = newItem;
				// console.log(occupied.oneD);
				// console.log(occupied.twoD);
				render(0);
			};

			var checkSurrounded = function checkSurrounded(item) {
				for (var i = -1; i < 2; i++) {
					for (var j = -1; j < 2; j++) {
						//if (i == 0 && j == 0) continue; // same as item.
						var x = item.x + i,
						    y = item.y + j;
						if (x >= 0 && x < wid && y >= 0 && y < hei) {
							var index = getIndex(x, y);
							// console.log(occupied.oneD[index])
							if (occupied.oneD[index] === -1) return false;
						}
					}
				}
				// console.log("surrounded")x`x``
				item.surrounded = true;
				return true;
			};

			var checkDir = function checkDir(x, y, dir) {
				switch (dir) {
					case 0 /* up */:
						y--;
						break;
					case 1 /* right */:
						x++;
						break;
					case 2 /* down */:
						y++;
						break;
					case 3 /* left */:
						x--;
						break;
				}
				var index = getIndex(x, y);

				// ctx.fillStyle = "red";
				// ctx.fillRect(x * block - 1 + block / 1, y * block - 1 + block / 1, 2, 2);

				return {
					// ok: !!(occupied.twoD[y] && occupied.twoD[y][x] === -1),
					ok: x >= 0 && x < wid && y >= 0 && y < hei && occupied.oneD[index] === -1,
					x: x,
					y: y
				};
			};

			var checkPoints = function checkPoints() {
				for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
					points[_key] = arguments[_key];
				}

				for (var i = 0, il = points.length - 1; i < il; i++) {
					var p0 = points[i],
					    p1 = points[i + 1];
					if (Math.abs(p0.x - p1.x) !== 0 && Math.abs(p0.y - p1.y) !== 0) {
						return false;
					}
				}
				// TODO this condition!
				if (points[0].x === points[1].x && points[1].x === points[2].x) return false; //&& points[2].x === points[3].x) return false;
				if (points[0].y === points[1].y && points[1].y === points[2].y) return false; //&& points[2].y === points[3].y) return false;

				return true;
			};

			var insertItemAnywhere = function insertItemAnywhere() {
				var index = randomInst.getInteger(0, occupied.array.length - 1);
				var item = occupied.array[index];
				if (!item) return;

				var surrounded = checkSurrounded(item);
				if (surrounded) {
					occupied.array.splice(index, 1);
					return;
				}

				if (item && item.next && item.prev) {
					insertItemAfter(item);
				} else {
					// console.log("null", item);
				}
			};

			var insertItemAfter = function insertItemAfter(afterItem) {
				store();

				var prev = afterItem;
				var next = afterItem.next;

				// console.log(afterItem)
				var x = afterItem.x;
				var y = afterItem.y;
				var startDir = randomInst.getInteger(0, 3);
				var nextDir = randomInst.getInteger(0, 3);

				var pending0 = checkDir(x, y, startDir);
				var pending1 = checkDir(pending0.x, pending0.y, nextDir);
				var inline = checkPoints(prev, pending0, pending1, next);

				if (pending0.ok && pending1.ok && inline) {
					// console.log("pending0", pending0, pending1)
					var newItem0 = makeItem({ x: pending0.x, y: pending0.y });

					var newItem1 = makeItem({ x: pending1.x, y: pending1.y });

					prev.next = newItem0;

					newItem0.prev = prev;
					newItem0.next = newItem1;

					newItem1.prev = newItem0;
					newItem1.next = next;

					next.prev = newItem1;

					// checkSurrounded(prev);
					// checkSurrounded(newItem0);
					// checkSurrounded(newItem1);
					// checkSurrounded(next);
				} else {
					restore();
				}
			};

			var extractWalls = function extractWalls() {
				// discover a more efficient method of drawing walls rather than block by block
				// let's use rectangles.

				var pixels = ctx.getImageData(0, 0, sw, sh).data;

				ctxW.fillStyle = "#fff";
				ctxW.fillRect(0, 0, sw, sh);

				var walls = [];
				// get pixels to discover what is to be drawn, make an array of blocks.
				for (var i = 0, j = 0, il = pixels.length; i < il; i += 4, j++) {
					var xy = getXY(j);
					var r = pixels[i]; // var g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
					if (r == 255) {
						ctxW.fillStyle = "#f00";
						ctxW.fillRect(xy.x, xy.y, 1, 1);
						walls.push(xy);
					}
				}

				// find rows within array.
				var wallrects = [];
				var row = -1;
				var w;
				for (i = 0, il = walls.length; i < il; i++) {
					w = walls[i];
					if (row != w.y) {
						// new row - add a block
						row = w.y;
						wallrects.push({ x: w.x, y: w.y, w: 1, h: 1 });
					} else {
						// check if the previous x is the same...
						if (walls[i - 1].x == w.x - 1) {
							// if it's the same block widen it.
							wallrects[wallrects.length - 1].w++;
						} else {
							wallrects.push({ x: w.x, y: w.y, w: 1, h: 1 }); // add a new one.
						}
					}
				}

				// find columns within array
				for (i = 0, il = wallrects.length; i < il; i++) {
					var w0 = wallrects[i];
					for (var j = i + 1; j < il; j++) {
						var w1 = wallrects[j];
						if (w0 && w1) {
							if (w0.x == w1.x && w0.w == w1.w && w0.y + w0.h == w1.y) {
								wallrects[i].h++;
								wallrects[j] = null;
							}
						}
					}
				}
				// remove nulls. didn't splice above
				wallrects = wallrects.filter(function (item) {
					return item;
				});

				// debug render
				ctxR.fillStyle = "#fff";
				ctxR.fillRect(0, 0, swZ, shZ);

				for (i = 0, il = wallrects.length; i < il; i++) {
					w = wallrects[i];
					if (w) {
						ctxR.beginPath();
						ctxR.rect(w.x * blockZoom + 2, w.y * blockZoom + 2, w.w * blockZoom - 4, w.h * blockZoom - 4);
						ctxR.lineWidth = 1;
						ctxR.lineStyle = "rgba(0,0,0,0.00)";
						ctxR.closePath();
						ctxR.stroke();
					}
				}

				// console.log("extractWalls");
				resolve({ walls: walls, wallrects: wallrects });
			};

			ctxZ.scale(blockZoom, blockZoom);
			ctxZ.imageSmoothingEnabled = false;
			ctxW.scale(blockZoom, blockZoom);
			ctxW.imageSmoothingEnabled = false;

			var arrLen = 0,
			    done = 0;

			var render = function render(time) {
				attempts++;

				ctx.fillStyle = "#fff";
				ctx.fillRect(0, 0, sw, sh);

				for (var i = 0; i < 40; i++) {
					insertItemAnywhere();
				}ctx.beginPath();
				ctx.lineWidth = block / 2 * 0.25;
				var item = first;
				while (item) {
					var x = (item.x + 3 / 4) * block;
					var y = (item.y + 3 / 4) * block;

					if (item == first) {
						ctx.moveTo(x - block, y); // hack to draw off screen - right angle
						// ctx.moveTo(x, y - block); // hack to draw off screen - straight down
					} else if (!item.next) {
						// hack last one
						ctx.lineTo(x, y);
						ctx.lineTo(x, y + block);
					} else {
						ctx.lineTo(x, y);
					}

					// ctx.fillStyle = item.surrounded ? "#f77" : "#7f7";
					// ctx.fillRect(x - 1, y - 1, 2, 2);

					// console.log(item);
					item = item.next;
				}
				ctx.stroke();

				for (var i = 0; i < occupied.array.length; i++) {
					var item = occupied.array[i];
					ctx.fillStyle = item.type == "NULL" ? "#f00" : "#00ff00";
					ctx.fillRect(item.x * 2 + 1, item.y * 2 + 1, 1, 1);
				}

				ctxZ.drawImage(bmp.canvas, 0, 0);

				// some dodgy logic to know if we're done yet.
				if (arrLen === occupied.array.length) {
					done++;
				} else {
					arrLen = occupied.array.length;
					done = 0;
				}

				if (done < 300) {
					// requestAnimationFrame(render);
					if (attempts % 50 == 0) {
						console.log("having a breather... ", done);
						setTimeout(render, 20);
					} else {
						render();
					}
				} else {
					extractWalls();
				}
			};

			start();
		});
	};

	var init = function init(options) {
		var size = 39; // options.size passed in is massive stage size...
		var preoccupied = [];
		// const fn = (x, y) => x > size / 2;

		var polygon = function polygon(cx, cy, r, sides) {
			var points = [];
			for (var i = 0; i < sides; i++) {
				var angle = i / sides * TAU; // + TAU / 4,
				points.push({
					x: size * cx + Math.cos(angle) * size * r,
					y: size * cy + Math.sin(angle) * size * r
				});
			}
			return function (x, y) {
				return geom.pointInPolygon(points, { x: x, y: y });
			};
		};

		var circle = function circle(cx, cy, r) {
			cx = size * cx;
			cy = size * cy;
			r = size * r;
			return function (x, y) {
				return Math.hypot(x - cx, y - cy) < r;
			};
		};

		var triangle = polygon(0.5, 0.5, 0.4, 3);
		var pentagon = polygon(0.5, 0.5, 0.25, 5);
		var hexagon = polygon(0.5, 0.5, 0.4, 6);

		var circleTR5 = circle(3 / 4, 1 / 4, 1 / 5); // circle top right corner
		var circleBL6 = circle(1 / 4, 3 / 4, 1 / 6); // circle bottom left corner

		var fn = void 0;
		switch (randomInst.getInteger(0, 3)) {
			case 0:
				fn = function fn(x, y) {
					return circleTR5(x, y) || circleBL6(x, y);
				};
				break;
			case 1:
				fn = function fn(x, y) {
					return triangle(x, y);
				};
				break;
			case 2:
				fn = function fn(x, y) {
					return pentagon(x, y);
				};
				break;
			case 3:
				fn = function fn(x, y) {
					return hexagon(x, y);
				};
				break;
			case 4:
				fn = function fn(x, y) {
					return false;
				};
				break;
		}

		for (var i = 0; i < size * size; i++) {
			var x = i % size,
			    y = Math.floor(i / size);
			if (fn(x, y)) {
				preoccupied.push({ x: x, y: y });
			}
		}
		generate(size, preoccupied, true).then(function (_ref) {
			// console.log(walls, wallrects);

			var walls = _ref.walls,
			    wallrects = _ref.wallrects;
		});
	};

	return {
		generate: generate,
		init: init
	};
};

define("linked_line", linked_line);
