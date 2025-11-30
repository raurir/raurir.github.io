"use strict";

var _bezier = bezier(),
	init = _bezier.init,
	stage = _bezier.stage;

init({size: 2048, seed: fxhash});
document.body.prepend(stage);
