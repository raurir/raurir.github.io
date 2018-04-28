"use strict";

var progressBar;
var progress = function progress(eventName, eventParam) {
  con.log("experiments progress", eventName, eventParam);
  switch (eventName) {
    case "render:progress":
      progressBar.style.width = eventParam * 100 + "%";
      progressBar.style.height = "10px";
      break;
    case "render:complete":
      // eventParam is canvas usually...
      progressBar.style.height = "0px";
      break;
  }
};

var exps = function exps(experimentsDetails) {
  var experiments = experimentsDetails.list;

  return function () {
    var info;
    var infoShowing = false;
    var interactedShowing = false;
    var currentExperiment;
    var viewSource = false;

    progressBar = dom.element("div", {
      id: "progress",
      style: { width: 0, height: 0 }
    });
    document.body.appendChild(progressBar);

    var holder = dom.element("div", { id: "experiment-holder" });
    document.body.appendChild(holder);

    var buttonsNav = dom.element("div", { className: "exps-buttons" });
    document.body.appendChild(buttonsNav);

    var buttonClose = dom.button("X", { className: "exps-button" });
    buttonsNav.appendChild(buttonClose);
    dom.on(buttonClose, ["click", "touchend"], function (e) {
      window.location = "/" + (viewSource ? "?src" : "");
    });

    var buttonInfo = dom.button("?", { className: "exps-button" });
    buttonsNav.appendChild(buttonInfo);
    dom.on(buttonInfo, ["click", "touchend"], showInfo);

    var panelInfo = dom.element("div", { className: "exps-info" });
    var panelInfoDetails = dom.element("div", {
      className: "exps-info-details"
    });
    var panelNav = dom.element("div", { className: "exps-buttons interacted" });
    var panelButtonClose = dom.button("X", { className: "exps-button" });

    dom.on(panelButtonClose, ["click", "touchend"], hideInfo);

    document.body.appendChild(panelInfo);
    panelInfo.appendChild(panelNav);
    panelNav.appendChild(panelButtonClose);
    panelInfo.appendChild(panelInfoDetails);

    var createStyleSheet = function createStyleSheet(s) {
      var link = dom.element("link");
      // link.id = cssId;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "css/" + s + ".css";
      // link.media = "all";
      document.head.appendChild(link);
    };

    var loadExperiment = function loadExperiment(index) {
      var flagCSS = "css:";
      var src = experiments[index];
      if (src.toString().includes(flagCSS)) {
        src = src.filter(function (file) {
          var isCSS = file.includes(flagCSS);
          if (isCSS) {
            createStyleSheet(file.replace(flagCSS, ""));
          }
          return !isCSS; // filter out non css files
        });
      }
      require(src, function (experiment) {
        if (experiment) {
          experimentLoaded(experiment);
        } else {
          con.warn("require loaded... but experiment is null", experiment);
        }
      });
    };

    var showButtons = function showButtons() {
      buttonClose.style.display = "none";
      buttonInfo.style.display = "none";
      for (var e in experiments) {
        var button = dom.element("button", { className: "exp" });
        dom.on(button, ["click"], function (event) {
          window.location = "?" + event.target.key + (viewSource ? "&src" : "");
        });
        var key = experiments[e][0];
        var title = key;
        var expDetails = experimentsDetails.getDetails(key);
        if (expDetails && expDetails.title) {
          title = expDetails.title;
        }
        button.key = key;
        button.innerHTML = title;
        document.body.appendChild(button);
      }
    };

    var showInfo = function showInfo() {
      infoShowing = true;
      panelInfo.classList.add("displayed");
      panelInfoDetails.innerHTML = "\n      <h4>Experimental Graphics</h4>\n      <h1>" + info.title + "</h1>\n      " + info.description + "\n      <p><a href='https://github.com/raurir/experimental-graphics/blob/master/js/" + info.key + ".js' target='_blank'>SRC on Github</a></p>";
    };

    var hideInfo = function hideInfo() {
      panelInfo.classList.remove("displayed");
      infoShowing = false;
    };

    var checkURL = function checkURL() {
      if (window.location.search) {
        /*
        expected window.location.search:
        ?alien
        ?alien,39343
        ?alien,39343&src
        ?alien,39343&src=true
        */
        var params = window.location.search.split("?")[1].split("&"),
            key = params[0],
            index = 0,
            found = false,
            seed = key.split(",");
        viewSource = params.filter(function (param) {
          return param === "src";
        }).length;
        if (viewSource) {
          con.log("`src` in url: Experimental graphics in SRC mode...");
        }
        if (key === "src") {
          // if first key showbuttons...
          return showButtons();
        }
        if (seed[1]) {
          key = seed[0];
          seed = seed[1];
          rand.setSeed(seed);
        } else {
          rand.setSeed();
        }

        while (index < experiments.length && found == false) {
          if (experiments[index][0] == key) {
            found = true;
          } else {
            index++;
          }
        }
        loadExperiment(index);

        info = experimentsDetails.getDetails(key);
        if (info) {
          info.key = key;
        } else {
          buttonsNav.removeChild(buttonInfo);
        }
        // showInfo();
        dom.on(document.body, ["click", "touchstart"], function (e) {
          if (interactedShowing) return;
          interactedShowing = true;
          buttonsNav.classList.add("interacted");
          // setTimeout(function() {
          //   buttonsNav.classList.remove("interacted");
          //   interactedShowing = false;
          // }, 3000);
        });
      } else {
        showButtons();
      }
    };

    var resize = function resize() {
      // con.log("resize!");
      var sw = window.innerWidth,
          sh = window.innerHeight;

      if (currentExperiment.resize) currentExperiment.resize(sw, sh);

      // currentExperiment.stage.setSize(sw,sh);

      // var largestDimension = sw > sh ? sw : sh;
      // var scale = largestDimension / size;
      // var x = 0, y = 0;
      // if (sw < sh) {
      //   x = -((scale * size) - sw) / 2;
      // } else {
      //   y = -((scale * size) - sh) / 2;
      // }

      // currentExperiment.inner.setAttribute("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");
    };

    var initWindowListener = function initWindowListener() {
      dom.on(window, ["resize"], resize);
    };

    var experimentLoaded = function experimentLoaded(exp) {
      currentExperiment = exp;
      if (currentExperiment.stage) {
        holder.appendChild(currentExperiment.stage);
      } else {
        con.warn("experimentLoaded, but no stage:", currentExperiment.stage);
      }
      // initRenderProgress(); // experiments_progress
      // con.log("inittted!!!!!!");
      initWindowListener();
      currentExperiment.init({ size: 800 });
      resize();
    };

    checkURL();

    // document.body.appendChild(colours.showPalette());

    // document.body.innerHTML = window.innerWidth;
    return {
      load: loadExperiment,
      experiments: experiments
    };
  };
};

define("exps", ["exps_details"], exps);