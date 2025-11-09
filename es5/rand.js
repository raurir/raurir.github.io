"use strict";

// from https://gist.github.com/Protonk/5367430
// eslint-disable-next-line no-redeclare
var rand = function rand(isInstance, providedRandom) {
	var errors = 0;
	var instanceCount = 0;
	var instances = {};

	// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
	// m is basically chosen to be large (as it is the max period)
	// and for its relationships to a and c
	var m = 4294967296;
	// a - 1 should be divisible by m's prime factors
	var a = 1664525;
	// c and m should be co-prime
	var c = 1013904223;
	var seed, z;

	var alphaToInteger = function alphaToInteger(s) {
		var num = 0;
		for (var i = 0, il = s.length; i < il; i++) {
			num += s.charCodeAt(i) * c;
			num %= m;
		}
		return num;
	};

	return {
		setSeed: function setSeed(val) {
			var valDefined = val || val === 0;
			if (valDefined) {
				// if (/[^\d]/.test(val)) {
				if (isNaN(val)) {
					val = alphaToInteger(val);
					// console.log("setting alpha now", val);
				} else {
					val = Number(val);
					// console.log("setting numeric seed", val);
				}
			} else {
				val = Math.round(Math.random() * m);
				// console.log("setting random seed", val);
			}
			z = seed = val;
		},
		getSeed: function getSeed() {
			return seed;
		},
		random: providedRandom || function () {
			// console.log("calling funkyvector")
			if (z === undefined) {
				console.warn("no seed set - are you calling rand itself or an instance of rand?");
				errors++;
				if (errors > 1000) throw new Error("rand bailing because no seed");
				return null;
			}
			// define the recurrence relationship
			z = (a * z + c) % m;
			// return a float in [0, 1)
			// if z = m then z / m = 0 therefore (z % m) / m < 1 always
			return z / m;
		},

		getLastRandom: function getLastRandom() {
			return z / m;
		},

		getNumber: function getNumber(min, max) {
			return min + this.random() * (max - min);
		},

		getInteger: function getInteger(min, max) {
			return Math.floor(this.getNumber(min, max + 1));
		},

		shuffle: function shuffle(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(this.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		},

		// for testability
		alphaToInteger: alphaToInteger,

		// instance control
		// additionally you can pass in a rnd function, eg fxhash
		instance: function instance(seed, providedRandom) {
			instanceCount++;
			// console.log("rand.creating new instance", instanceCount);
			// this is the preferred method, call rand.instance() for a unique instance...
			// with this you can run multiple seeded randoms in parallel if needed.
			// optionally set seed
			var r = rand(true, providedRandom);
			if (typeof seed === "number" || typeof seed === "string") {
				r.setSeed(seed);
			}
			instances[instanceCount] = r;
			return r;
		},

		// use this to discover a seed if unknown...
		getInstanceById: function getInstanceById(id) {
			var randInstance = instances[id];
			if (id && randInstance) {
				return randInstance;
			}
			return "Can't find that rand instance, available ids are: " + Object.keys(instances);
		}
	};
};

if (typeof module !== "undefined") module.exports = rand(false); // export rand as a global
