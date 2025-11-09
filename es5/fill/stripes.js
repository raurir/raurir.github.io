"use strict";

/* eslint-disable no-console */
var isNode = typeof module !== "undefined";

var fillStripes = function fillStripes(args) {
	var c = args.c,
	    r = args.r,
	    size = args.size,
	    settings = args.settings;

	var checkArgs = Object.keys(args).sort().join(",");
	if (checkArgs !== "c,r,settings,size") {
		console.warn("fillStripes `args` are not ok... received:", checkArgs);
	}

	var checkSettings = Object.keys(settings).sort().join("\n");
	if (checkSettings !== "baseRotation\nlineGap\nlineScale\nlineSize\noverallScale\npointBias\npointMethod\nsites\nvaryDuotone\nvaryPerLine\nvaryPerRegion\nvaryRotation") {
		console.warn("fillStripes argument `settings` is not ok... received:", checkSettings);
	}

	console.log("checkSettings", checkSettings);

	var baseRotation = settings.baseRotation,
	    lineGap = settings.lineGap,
	    lineScale = settings.lineScale,
	    lineSize = settings.lineSize,
	    overallScale = settings.overallScale,
	    varyDuotone = settings.varyDuotone,
	    varyPerLine = settings.varyPerLine,
	    varyPerRegion = settings.varyPerRegion,
	    varyRotation = settings.varyRotation;

	// console.log('dom.canvas, size', size);

	var half = size / 2;
	var stage = dom.canvas(size, size);
	// canvas.canvas.style.border = '2px solid black'
	var ctx = stage.ctx,
	    canvas = stage.canvas;
	// document.body.appendChild(canvas);
	// puts the canvas centre so the whole area has a pattern
	// ctx.save();

	ctx.translate(half, half);
	ctx.rotate(baseRotation + r.getNumber(0, varyRotation));
	ctx.translate(-half, -half);

	if (varyDuotone) {
		c.setColourIndex(1);
		ctx.fillStyle = c.getCurrentColour();
	} else {
		ctx.fillStyle = c.getRandomColour();
	}

	var padding = Math.sqrt(half * half * 2) - half; // the gaps between the corner when rotated 45 degrees

	// draw bg. not good for shirts!!!
	ctx.fillRect(-padding, -padding, size + padding * 2, size + padding * 2);

	var lsc = lineScale;
	var lsi = lineSize;
	var lg = lineGap;
	if (varyPerRegion) {
		lsc = 0.5 + r.getNumber(0, overallScale);
		lsi = 1 + r.getNumber(0, 10) * lsc;
		lg = 2 + r.getNumber(0, 3) * lsc;
	}

	var colour;
	if (varyDuotone) {
		colour = c.getNextColour();
	}
	var y = -padding;
	while (y < size + padding) {
		if (varyPerLine) {
			lsi = 1 + r.getNumber(0, 10) * lsc;
			lg = 2 + r.getNumber(0, 3) * lsc;
		}
		if (!varyDuotone) {
			colour = c.getRandomColour();
		}
		ctx.fillStyle = colour;
		ctx.fillRect(-padding, y, size + padding * 2, lsi);
		y += lsi + lg;
	}
	return canvas;
};

if (isNode) module.exports = fillStripes;
