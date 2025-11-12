"use strict";

window.con = new Proxy(console, {
	get: function (target, prop) {
		if (typeof target[prop] === "function") {
			return function (...args) {
				console.warn('Warning: "con" is deprecated, use "console" instead');
				return target[prop].apply(target, args);
			};
		}
		return target[prop];
	},
});

// changing
// eslint-disable-next-line no-unused-vars
var perf = (function () {
	var stacks = {};
	return {
		start: function start(id) {
			// id = id || 0;
			stacks[id] = {
				timeStart: new Date().getTime(),
			};
		},
		end: function end(id) {
			// id = id || 0;
			stacks[id].timeEnd = new Date().getTime();
			var time = stacks[id].timeEnd - stacks[id].timeStart;
			console.log("performance", id, time);
			stacks[id].timeProcessing = time;
		},
	};
})();

var isDev = window.location.hostname === "exp.local" || window.location.search.includes("src");

require.config({
	baseUrl: isDev ? "es5" : "jsmin",
	urlArgs: "bust=" + (isDev ? Math.random() : "431af55b7627586749da33502f19f8f9"),
	paths: {
		box: "games/box",
		creature: "creature_creator/creature",
		ease: "../lib/robertpenner/ease",
		noise: "../lib/josephg/noisejs",
		Tone: "../lib/tonejs/Tone.min",
		THREE: "../lib/three/three.min",
		TweenMax: "../lib/greensock/TweenMax.min",
	},
});

require(["dom", "rand", "geom", "colours", "exps"], function (d, r, g, c, e) {
	console.log("v1.8 loaded. isDev:" + isDev);
	if (!isDev) {
		console.info("Running in development, code is minified. console logging disabled!");
	}
	rand = rand();
	colours = colours(rand);
	e();
});
