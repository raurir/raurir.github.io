"use strict";

// Source now at [https://github.com/raurir/experimental-graphics/blob/master/src/polygon_slice.js](src/polygon_slice.js)
var innerHTML = "\n<style>\ndiv#stage {\n\tpadding: 20px;\n}\ndiv#stage a {\n\tcolor: white;\n}\n</style>\n<div id='stage'>\n\t<a href='/?polygon_slice'>This experiment has been renamad to PolygonSlice... Click here to go there.</a>\n</div>";

define("reddit_proc_gen", function () {
	var stage = document.createElement("div");

	var init = function init(options) {
		stage.innerHTML = innerHTML;
		progress("render:complete", stage);
	};

	return {
		stage: stage,
		init: init
	};
});
