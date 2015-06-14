require([
<<<<<<< HEAD
	"js/dom.js",
	"js/rand.js",
	"js/geom.js",
	"js/colours.js",
	"js/experiment_factory.js",
	"js/experiments.js",
	"js/experiments_progress.js"], function(dom, rand, geom, colours, experiment_factory, experiments, experiments_progress) {
		console.log("experiments main ready");
=======
	"js/dom.js", 
	"js/rand.js", 
	"js/geom.js", 
	"js/colours.js",
	"js/experiment_factory.js", 
	"js/experiments.js", 
	"js/experiments_progress.js"], function(dom, rand, geom, colours, experiment_factory, experiments, experiments_progress) {
		console.log("done");
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2
});