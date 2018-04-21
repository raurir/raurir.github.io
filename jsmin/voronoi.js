"use strict";

var isNode = "undefined" != typeof module, voronoi = function() {
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

isNode && (module.exports = voronoi);