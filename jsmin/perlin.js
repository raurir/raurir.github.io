"use strict";

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