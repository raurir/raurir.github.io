"use strict";

var con = console, rand = function() {
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