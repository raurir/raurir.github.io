"use strict";

var progressBar;

function progress(eventName, eventParam) {
    switch (con.log("experiments progress", eventName, eventParam), eventName) {
      case "render:progress":
        progressBar.style.width = 100 * eventParam + "%", progressBar.style.height = "10px";
        break;

      case "render:complete":
        progressBar.style.height = "0px";
    }
}

function exps(experimentsDetails) {
    var experiments = experimentsDetails.list;
    return function() {
        var info, interactedShowing = !1;
        progressBar = dom.element("div", {
            id: "progress",
            style: {
                width: 0,
                height: 0
            }
        }), document.body.appendChild(progressBar);
        var holder = dom.element("div", {
            id: "experiment-holder"
        });
        document.body.appendChild(holder);
        var buttonsNav = dom.element("div", {
            className: "exps-buttons"
        });
        document.body.appendChild(buttonsNav);
        var buttonClose = dom.button("X", {
            className: "exps-button"
        });
        buttonsNav.appendChild(buttonClose), dom.on(buttonClose, [ "click", "touchend" ], function(e) {
            window.location = "/";
        });
        var buttonInfo = dom.button("?", {
            className: "exps-button"
        });
        buttonsNav.appendChild(buttonInfo), dom.on(buttonInfo, [ "click", "touchend" ], function() {
            !0, panelInfo.classList.add("displayed"), panelInfoDetails.innerHTML = "<h4>Experimental Graphics</h4><h1>" + info.title + "</h1>" + info.description + "<p><a href='https://github.com/raurir/experimental-graphics/blob/master/js/" + info.key + ".js' target='_blank'>SRC on Github</a></p>";
        });
        var currentExperiment, panelInfo = dom.element("div", {
            className: "exps-info"
        }), panelInfoDetails = dom.element("div", {
            className: "exps-info-details"
        }), panelNav = dom.element("div", {
            className: "exps-buttons interacted"
        }), panelButtonClose = dom.button("X", {
            className: "exps-button"
        });
        function loadExperiment(index) {
            var src = experiments[index];
            require(src, function(experiment) {
                experiment ? (con.log("require loaded...", experiment), function(exp) {
                    (currentExperiment = exp).stage ? holder.appendChild(currentExperiment.stage) : con.warn("experimentLoaded, but no stage:", currentExperiment.stage);
                    dom.on(window, [ "resize" ], resize), currentExperiment.init({
                        size: 800
                    }), resize();
                }(experiment)) : con.warn("require loaded... but experiment is null", experiment, arguments);
            });
        }
        if (dom.on(panelButtonClose, [ "click", "touchend" ], function() {
            panelInfo.classList.remove("displayed"), !1;
        }), document.body.appendChild(panelInfo), panelInfo.appendChild(panelNav), panelNav.appendChild(panelButtonClose), 
        panelInfo.appendChild(panelInfoDetails), window.location.search) {
            var key = window.location.search.split("?")[1], index = 0, found = !1, seed = key.split(",");
            for (seed[1] ? (key = seed[0], seed = seed[1], rand.setSeed(seed)) : rand.setSeed(); index < experiments.length && 0 == found; ) experiments[index][0] == key ? found = !0 : index++;
            loadExperiment(index), (info = experimentsDetails.getDetails(key)) ? info.key = key : buttonsNav.removeChild(buttonInfo), 
            dom.on(document.body, [ "click", "touchstart" ], function(e) {
                interactedShowing || (interactedShowing = !0, buttonsNav.classList.add("interacted"));
            });
        } else !function() {
            for (var e in buttonClose.style.display = "none", buttonInfo.style.display = "none", 
            experiments) {
                var button = dom.element("button", {
                    className: "exp"
                });
                dom.on(button, [ "click" ], function(event) {
                    window.location = "?" + event.target.key;
                });
                var key = experiments[e][0], title = key, expDetails = experimentsDetails.getDetails(key);
                expDetails && expDetails.title && (title = expDetails.title), button.key = key, 
                button.innerHTML = title, document.body.appendChild(button);
            }
        }();
        function resize() {
            var sw = window.innerWidth, sh = window.innerHeight;
            currentExperiment.resize && currentExperiment.resize(sw, sh);
        }
        return {
            load: loadExperiment,
            experiments: experiments
        };
    };
}

define("exps", [ "exps_details" ], exps);