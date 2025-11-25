"use strict";

define("reddit_proc_gen", function () {
	var stage = document.createElement("div");

	var init = function init(options) {
		window.location = "/?polygon_slice," + Math.round(Math.random() * 1e10);
		progress("render:complete", stage);
	};

	return {
		stage: stage,
		init: init
	};
});
