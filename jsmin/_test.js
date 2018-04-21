"use strict";

define(function(require) {
    var stage = dom.element("div"), b1 = dom.button("test1", {
        style: {
            color: "white"
        }
    }), b2 = dom.button("test2", {
        style: {
            color: "white"
        }
    });
    return stage.appendChild(b1), stage.appendChild(b2), dom.on(b1, [ "click" ], function go() {
        con.log("go!!");
        dom.on(b2, [ "click" ], go);
        dom.off(b1, [ "click" ], go);
    }), con.log("test loaded"), {
        stage: stage,
        init: function() {},
        resize: function() {}
    };
});