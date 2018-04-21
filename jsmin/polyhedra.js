"use strict";

var sw = 600, sh = 600, bmp = dom.canvas(sw, sh);

document.body.appendChild(bmp.canvas);

var frame = 0, t = (1 + Math.sqrt(5)) / 2, CodedIcosahedron = {
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