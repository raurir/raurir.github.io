"use strict";

var con = con || console, geom = function() {
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

"undefined" != typeof module && (module.exports = geom);