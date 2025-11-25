"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var progressBar;

var progress = function progress(eventName, eventParam) {
	console.log("experiments progress", eventName, eventParam);
	switch (eventName) {
		case "render:progress":
			progressBar.style.width = eventParam * 100 + "%";
			progressBar.style.height = "10px";
			break;
		case "render:complete":
			// eventParam is canvas usually...
			progressBar.style.height = "0px";
			break;
	}
};

var exps = function exps(experimentsDetails) {
	var experiments = experimentsDetails.list;

	return function () {
		var randomHue = Math.floor(Math.random() * 360);
		document.documentElement.style.setProperty("--colour-accent", "hsl(" + randomHue + ", 100%, 60%)");
		document.documentElement.style.setProperty("--colour-accent-20", "hsla(" + randomHue + ", 100%, 60%, 0.2)");

		// Debug: log what element is being clicked/touched
		/*
  dom.on(document, ["click", "touchstart", "touchend"], (e) => {
  	var target = e.target;
  	var targetInfo = {
  		tagName: target.tagName,
  		className: target.className,
  		id: target.id,
  		element: target,
  	};
  	alert("Click/Touch target: " + JSON.stringify(targetInfo, null, 2));
  });
  */

		var experimentActive = false;
		var info;
		var currentExperiment;
		var viewSource = false;
		var format = null;
		var seed;
		var size = 2000;

		progressBar = dom.element("div", {
			id: "progress",
			style: { width: 0, height: 0 }
		});
		document.body.appendChild(progressBar);

		var holder = dom.element("div", { id: "experiment-holder" });
		document.body.appendChild(holder);

		var expList = dom.element("div", { id: "experiment-list" });
		document.body.appendChild(expList);

		var buttonsNav = dom.element("div", { className: "exps-buttons" });
		document.body.appendChild(buttonsNav);

		var buttonClose = dom.button("X", { className: "exps-button" });
		buttonsNav.appendChild(buttonClose);
		dom.on(buttonClose, ["click", "touchend"], function () {
			window.location = "/" + (viewSource ? "?src" : "");
		});

		var buttonReload = dom.button("", { className: "exps-button" });
		buttonsNav.appendChild(buttonReload);
		var buttonReloadSymbol = dom.element("span", {
			innerHTML: "⟳",
			style: {
				display: "inline-block",
				transform: "translate(0px,-1px) scale(2)"
			}
		});
		buttonReload.appendChild(buttonReloadSymbol);

		var buttonInfo = dom.button("?", { className: "exps-button" });
		buttonsNav.appendChild(buttonInfo);
		dom.on(buttonInfo, ["click", "touchend"], function () {
			return showInfo();
		});

		var panelInfo = dom.element("div", { className: "exps-info" });
		var panelInfoDetails = dom.element("div", {
			className: "exps-info-details"
		});
		var panelNav = dom.element("div", {
			className: "exps-buttons interacted"
		});
		var panelButtonClose = dom.button("X", { className: "exps-button" });

		dom.on(panelButtonClose, ["click", "touchend"], function () {
			return hideInfo();
		});

		document.body.appendChild(panelInfo);
		panelInfo.appendChild(panelNav);
		panelNav.appendChild(panelButtonClose);
		panelInfo.appendChild(panelInfoDetails);

		var createStyleSheet = function createStyleSheet(s) {
			var link = dom.element("link");
			// link.id = cssId;
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = "css/" + s + ".css";
			// link.media = "all";
			document.head.appendChild(link);
		};

		var loadExperiment = function loadExperiment(index) {
			var flagCSS = "css:";
			var src = experiments[index];
			if (src.toString().includes(flagCSS)) {
				src = src.filter(function (file) {
					var isCSS = file.includes(flagCSS);
					if (isCSS) {
						createStyleSheet(file.replace(flagCSS, ""));
					}
					return !isCSS; // filter out non css files
				});
			}
			require(src, function (experiment) {
				if (experiment) {
					experimentLoaded(experiment);
				} else {
					console.warn("require loaded... but experiment is null", experiment);
				}
			});
		};

		var titleCase = function titleCase(title) {
			var titleCaseWord = function titleCaseWord(word) {
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			};
			if (!title.includes("")) {
				return titleCaseWord(title);
			}
			return title.replace(/_/g, " ").split(" ").map(titleCaseWord).join(" ");
		};

		var showButtons = function showButtons() {
			buttonClose.style.display = "none";
			buttonInfo.style.display = "none";
			for (var e in experiments) {
				var button = dom.element("button", { className: "exp" });
				dom.on(button, ["click"], function (event) {
					window.location = "?" + event.target.key + (viewSource ? "&src" : "");
				});
				var key = experiments[e][0];
				var title = key;
				var expDetails = experimentsDetails.getDetails(key);
				if (expDetails && expDetails.title) {
					title = expDetails.title;
				}
				button.key = key;
				title = titleCase(title);
				button.innerHTML = title;
				expList.appendChild(button);
			}
		};

		var showInfo = function showInfo() {
			panelInfo.classList.add("displayed");
			panelInfoDetails.innerHTML = "\n<h4>EXPGFX</h4>\n<h1>" + info.title + "</h1>\n" + (info.description || "No description provided") + "\n" +
			//info.srcHidden
			// some were made after private repo:
			//  ""
			// `<p><a href='https://github.com/raurir/experimental-graphics/blob/master/src/${info.key}.js' target='_blank'>SRC on Github</a></p>`
			"<p><a href='#' class='view-source-link'>View Source</a></p>";

			var viewSourceLink = panelInfoDetails.querySelector(".view-source-link");
			dom.on(viewSourceLink, ["click"], function (e) {
				e.preventDefault();
				showSource();
			});
		};

		var showSource = function showSource() {
			panelInfoDetails.innerHTML = "<p>Loading source...</p>";
			var isCoffeeScript = info.src === "coffeescript";
			var sourcePath = isCoffeeScript ? "/cs/" + info.key + ".coffee" : "/es5/" + info.key + ".js";
			var fileName = isCoffeeScript ? info.key + ".coffee" : info.key + ".js";
			fetch(sourcePath).then(function (response) {
				if (!response.ok) {
					throw new Error("HTTP " + response.status + ": " + response.statusText);
				}
				return response.text();
			}).then(function (sourceCode) {
				panelInfoDetails.innerHTML = "\n<h4>EXPGFX:SRC</h4>\n<h1>" + fileName + "</h1>\n<pre><code>" + escapeHtml(sourceCode) + "</code></pre>\n<p><a href='#' class='back-to-info-link'>\u2190 Back to Info</a></p>\n";
			}).catch(function (error) {
				console.warn("Error loading source", error);
				panelInfoDetails.innerHTML = "\n<h4>EXPGFX:SRC:ERROR</h4>\n<p>Could not load source code: " + error.message + "</p>\n<p><a href='#' class='back-to-info-link'>\u2190 Back to Info</a></p>\n";
			}).finally(function () {
				var backLink = panelInfoDetails.querySelector(".back-to-info-link");
				dom.on(backLink, ["click"], function (e) {
					e.preventDefault();
					showInfo();
				});
			});
		};

		var escapeHtml = function escapeHtml(text) {
			var div = document.createElement("div");
			div.textContent = text;
			return div.innerHTML;
		};

		var hideInfo = function hideInfo() {
			panelInfo.classList.remove("displayed");
		};

		var checkURL = function checkURL() {
			if (window.location.search) {
				/*
    expected window.location.search:
    ?alien
    ?alien,39343
    ?alien,39343&src
    ?alien,39343&src=true
    ?alien,39343&src=true&size=1000
    */
				var params = window.location.search.split("?")[1].split("&"),
				    key = params[0],
				    index = 0,
				    found = false,
				    keyWithSeed = key.split(",");
				viewSource = params.filter(function (param) {
					return param === "src";
				}).length > 0;
				var setSize = params.filter(function (param) {
					return param.startsWith("size=");
				});
				var setFormat = params.filter(function (param) {
					return param.startsWith("format=");
				});
				if (viewSource) {
					console.log("`src` in url: Experimental graphics in SRC mode...");
				}
				if (key === "src") {
					// if first key showbuttons...
					return showButtons();
				}
				if (keyWithSeed[1]) {
					key = keyWithSeed[0];
					seed = keyWithSeed[1];
					rand.setSeed(seed);
					console.log("setting seed", seed);
				}
				if (setSize.length === 1) {
					var _setSize$0$split = setSize[0].split("="),
					    _setSize$0$split2 = _slicedToArray(_setSize$0$split, 2),
					    num = _setSize$0$split2[1];

					if (!isNaN(num)) {
						size = Math.max(100, Math.min(Number(num), 1000));
						console.log("setting size", size);
					} else {
						console.warn("size invalid", num);
					}
				}
				if (setFormat.length === 1) {
					var _setFormat$0$split = setFormat[0].split("="),
					    _setFormat$0$split2 = _slicedToArray(_setFormat$0$split, 2),
					    fmt = _setFormat$0$split2[1];

					if (fmt === "svg" || fmt === "bmp") {
						format = fmt;
						console.log("setting format", format);
					} else {
						console.warn("format invalid", fmt);
					}
				}

				while (index < experiments.length && found == false) {
					if (experiments[index][0] == key) {
						found = true;
					} else {
						index++;
					}
				}
				experimentActive = true;

				var firstNode = false;
				// Watch for canvases being added anywhere and move them to holder
				var observer = new MutationObserver(function (mutations) {
					mutations.forEach(function (mutation) {
						if (mutation.target.className === "exps-info-details")
							// in case user views source as their first action!
							return;
						// console.log("mutation observed", mutation.target.className, experimentActive);
						if (!experimentActive) return;
						mutation.addedNodes.forEach(function (node) {
							// console.log("firstNode", firstNode);
							if (firstNode) return;
							// console.log("observer", node);
							if (node.parentElement !== holder) {
								// console.log("adding");
								firstNode = true;
								holder.appendChild(node);
							} else {
								console.log("not adding");
							}
						});
					});
				});
				observer.observe(document.body, { childList: true, subtree: true });

				loadExperiment(index);

				info = experimentsDetails.getDetails(key);
				if (info) {
					info.key = key;
				} else {
					info = { key: key };
				}
				if (!info.title) info.title = titleCase(key);

				if (info.preventRefresh) {
					buttonsNav.removeChild(buttonReload);
				} else {
					dom.on(buttonReload, ["click", "touchend"], function () {
						window.location = "?" + key + "," + Math.round(Math.random() * 1e10) + (viewSource ? "&src" : "");
					});
				}

				// Add experiment-active class to body when experiment is loaded
				document.body.classList.add("experiment-active");
				buttonsNav.classList.add("interacted");
			} else {
				showButtons();
			}
		};

		var resize = function resize() {
			var sw = window.innerWidth,
			    sh = window.innerHeight;

			if (meanderingBg) meanderingBg.resize(sw, sh);
			if (currentExperiment && currentExperiment.resize) currentExperiment.resize(sw, sh);
			return;

			/*
   currentExperiment.stage.setSize(sw, sh);
   	var largestDimension = sw > sh ? sw : sh;
   var scale = largestDimension / size;
   var x = 0,
   	y = 0;
   if (sw < sh) {
   	x = -(scale * size - sw) / 2;
   } else {
   	y = -(scale * size - sh) / 2;
   }
   	// holder.children[0].style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
   	// currentExperiment.inner.setAttribute("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");
   */
		};

		var initWindowListener = function initWindowListener() {
			dom.on(window, ["resize"], function () {
				return resize();
			});
		};

		var experimentLoaded = function experimentLoaded(exp) {
			currentExperiment = typeof exp === "function" ? exp(format === "svg") : exp;
			if (currentExperiment.stage) {
				holder.appendChild(currentExperiment.stage);
			} else {
				console.warn("experimentLoaded, but no stage:", currentExperiment.stage);
			}
			// initRenderProgress(); // experiments_progress

			currentExperiment.init({ progress: progress, seed: seed, size: size });
			resize();
		};

		checkURL();
		initWindowListener();

		// document.body.appendChild(colours.showPalette());

		// load in a background animation.
		var meanderingBg;
		if (!experimentActive) {
			require(["meandering_polygons"], function (experiment) {
				meanderingBg = experiment;
				holder.appendChild(experiment.stage);
				holder.classList.add("fixed");
				experiment.stage.style.opacity = 0.2;
				experiment.init({ transparentBg: true, randomHue: randomHue });
			});
		}

		// document.body.innerHTML = window.innerWidth;
		return {
			load: loadExperiment,
			experiments: experiments
		};
	};
};

define("exps", ["exps_details"], exps);
