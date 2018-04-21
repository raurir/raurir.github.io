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

make3DPoint = function(x, y, z) {
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
};