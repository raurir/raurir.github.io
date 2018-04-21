"use strict";

var isNode = "undefined" != typeof module;

if (isNode) var con = console, rand = require("./rand.js"), Canvas = require("canvas"), Image = Canvas.Image, dom = require("./dom.js"), http = require("http"), https = require("https");

var any_image_url = function() {
    var size, sw, sh, cx, cy, allowed = {
        526: {
            image: "https://funkyvector.com/blog/wp-content/uploads/2016/05/state_of_origin_52_6_22_d5243594_design.png",
            scale: isNode ? 1 : .5
        },
        834199129: {
            scale: .8
        }
    }, bmp = dom.canvas(1, 1), ctx = bmp.ctx;
    return {
        stage: bmp.canvas,
        init: function(options) {
            var ok;
            size = options.size, cx = (sw = size) / 2, cy = (sh = size) / 2, bmp.setSize(sw, sh), 
            (ok = allowed[rand.getSeed()]) && ok.image ? function(url, scale) {
                function drawToContext(img) {
                    var width = img.width, height = img.height;
                    ctx.translate(cx, cy), ctx.scale(scale, scale), ctx.translate(-width / 2, -height / 2), 
                    ctx.drawImage(img, 0, 0), progress("render:complete", bmp.canvas);
                }
                if (isNode) !function(url, fulfill, reject) {
                    var protocol = http;
                    /https:\/\//.test(url) && (protocol = https), protocol.get(url, function(res) {
                        var buffers = [];
                        res.on("data", function(chunk) {
                            chunk.length, buffers.push(chunk);
                        }), res.on("end", function() {
                            var loaded = Buffer.concat(buffers);
                            fulfill(loaded);
                        }), res.on("error", function(e) {
                            con.log("loadImageURL reject", e), reject(e);
                        });
                    });
                }(url, function(buffer) {
                    var data, fulfill, reject, img;
                    data = buffer, fulfill = function(img) {
                        drawToContext(img);
                    }, reject = function(err) {
                        con.log("makeImage fail", err);
                    }, (img = new Image()).src = data, img ? fulfill(img) : (con.log("makeImage reject"), 
                    reject());
                }, function(err) {
                    con.log("loadImageURL fail", err);
                }); else {
                    var img = new Image();
                    img.onload = function() {
                        drawToContext(img);
                    }, img.onerror = function(err) {
                        con.log("img.onerror error", err);
                    }, img.src = url;
                }
            }(ok.image, ok.scale) : con.warn("Cannot find image:", rand.getSeed());
        }
    };
};

isNode ? module.exports = any_image_url() : define("any_image_url", any_image_url);