"use strict";

var con = console, isNode = "undefined" != typeof module;

if (isNode) var Canvas = require("canvas");

var dom = function() {
    function element(element, props) {
        var el = document.createElement(element);
        return function(el, props) {
            for (var p in props) if ("style" == p) for (var s in props[p]) el[p][s] = props[p][s]; else el[p] = props[p];
        }(el, props), el.setSize = function(w, h) {
            el.style.width = w + "px", el.style.height = h + "px";
        }, el;
    }
    return {
        element: element,
        canvas: function(w, h) {
            var c;
            isNode ? c = new Canvas(w, h) : ((c = element("canvas")).width = w, c.height = h);
            var ctx = c.getContext("2d"), circleRads = 2 * Math.PI;
            return ctx.drawCircle = function(x, y, r) {
                ctx.arc(x, y, r, 0, circleRads, !1);
            }, {
                setSize: function(w, h, preserveCanvas) {
                    preserveCanvas ? c.setSize(w, h) : (c.width = w, c.height = h);
                },
                canvas: c,
                ctx: ctx
            };
        },
        button: function(txt, props) {
            return (props = props || {}).innerHTML && con.warn("Specify butotn text as 1st param"), 
            props.innerHTML = txt, element("button", props);
        },
        svg: function(tag, props) {
            var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
            return function(el, attrs) {
                for (var p in attrs) el.setAttribute(p, attrs[p]);
            }(el, props), el.setSize = function(w, h) {
                el.setAttribute("width", w), el.setAttribute("height", h);
            }, el.clearRect = function() {}, el.fillRect = function() {
                con.warn("svg.fillRect not implemented");
            }, el;
        },
        on: function(target, events, callback) {
            for (var i = 0, il = events.length; i < il; i++) target.addEventListener(events[i], callback);
        },
        off: function(target, events, callback) {
            for (var i = 0, il = events.length; i < il; i++) target.removeEventListener(events[i], callback);
        },
        trigger: function(target, events) {
            for (var i = 0, il = events.length; i < il; i++) target.dispatchEvent(events[i]);
        }
    };
}();

isNode && (module.exports = dom);