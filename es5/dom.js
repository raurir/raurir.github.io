"use strict";

var isNode = typeof module !== "undefined";

var createCanvas = void 0;
if (isNode) {
  createCanvas = require("canvas").createCanvas;
}

var setProps = function setProps(el, props) {
  for (var p in props) {
    if (p == "style") {
      for (var s in props[p]) {
        el[p][s] = props[p][s];
      }
    } else {
      el[p] = props[p];
    }
  }
  return el;
};

var setAttributes = function setAttributes(el, attrs) {
  for (var p in attrs) {
    el.setAttribute(p, attrs[p]);
  }
  return el;
};

var element = function element(_element, props) {
  var el = document.createElement(_element);
  setProps(el, props);
  el.setSize = function (w, h) {
    el.style.width = w + "px"; // i always use pixels... don't you?
    el.style.height = h + "px";
  };
  return el;
};

var canvas = function canvas(w, h) {
  h = h || w;
  var c = void 0;
  if (isNode) {
    c = createCanvas(w, h);
  } else {
    c = element("canvas");
    c.width = w;
    c.height = h;
  }

  var ctx = c.getContext("2d");

  var circleRads = Math.PI * 2;
  ctx.drawCircle = function (x, y, r) {
    ctx.arc(x, y, r, 0, circleRads, false);
  };

  var setSize = function setSize(w, h, preserveCanvas) {
    if (preserveCanvas) {
      c.setSize(w, h);
    } else {
      c.width = w;
      c.height = h;
    }
  };

  return {
    setSize: setSize,
    canvas: c,
    ctx: ctx,
  };
};

var button = function button(txt) {
  var props =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : {};

  if (props.innerHTML)
    console.warn("Specify button text as 1st param");
  props.innerHTML = txt;
  var b = element("button", props);
  return b;
};

var svg = function svg(tag, props) {
  var el = document.createElementNS(
    "http://www.w3.org/2000/svg",
    tag,
  );
  setAttributes(el, props);
  el.setSize = function (w, h) {
    el.setAttribute("width", w);
    el.setAttribute("height", h);
  };
  el.clearRect = function () {
    /* a clear rectangle? literally nothing in vector! */
  };
  el.fillRect = function () {
    console.warn("svg.fillRect not implemented");
  };
  return el;
};

var on = function on(target, events, callback) {
  events.forEach(function (event) {
    target.addEventListener(event, callback);
  });
};
var off = function off(target, events, callback) {
  events.forEach(function (event) {
    target.removeEventListener(event, callback);
  });
};
var trigger = function trigger(target, events) {
  events.forEach(function (event) {
    target.dispatchEvent(event);
  });
};

// eslint-disable-next-line no-redeclare
var dom = {
  button: button,
  canvas: canvas,
  element: element,
  off: off,
  on: on,
  setProps: setProps,
  setAttributes: setAttributes,
  svg: svg,
  trigger: trigger,
};

if (isNode) module.exports = dom;
