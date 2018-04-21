"use strict";

var con = console, isNode = "undefined" != typeof module;

if (isNode) var rand = require("./rand.js");

var colours = function() {
    var random;
    rand ? random = rand.random : (random = Math.random, con.warn("!!!! colours is using native random"));
    var paletteIndex = -1, currentPalette = null, colourIndex = 0;
    function getRandomPalette(warning) {
        return warning && con.warn("Ensure you call getRandomPalette!"), paletteIndex = ~~(random() * palettes.length), 
        currentPalette = palettes[paletteIndex];
    }
    function channelToHex(c) {
        var hex = c.toString(16);
        return 1 == hex.length ? "0" + hex : hex;
    }
    function rgbToHex(r, g, b) {
        return "#" + channelToHex(r) + channelToHex(g) + channelToHex(b);
    }
    function hexToRgb(hex) {
        return {
            r: parseInt(hex.substr(1, 2), 16),
            g: parseInt(hex.substr(3, 2), 16),
            b: parseInt(hex.substr(5, 2), 16)
        };
    }
    function mutateChannel(channel, amount, direction) {
        var mutation = Math.round(channel + (random() - .5) * amount);
        return mutation = 255 < mutation ? 255 : mutation <= 0 ? 0 : mutation;
    }
    function showPalette() {
        null == currentPalette && getRandomPalette(!0);
        var p = dom.element("div");
        p.className = "palette", p.id = "palette-" + paletteIndex;
        for (var j = 0; j < currentPalette.length; j++) {
            var colour = currentPalette[j], c = dom.element("div", {
                className: "colour",
                innerHTML: colour,
                style: {
                    background: colour
                }
            });
            p.appendChild(c);
        }
        return p;
    }
    var palettes = [ [ "#333", "#ccc" ], [ "#A0C9D9", "#F2F0D0", "#735438", "#A64941", "#0D0D0D" ], [ "#D93D93", "#629C27", "#DEE300", "#32393D", "#FFFFFF" ], [ "#36190A", "#B2460B", "#FF6818", "#009AA3", "#00ECD2" ], [ "#1B69FF", "#002875", "#0143C2", "#FFB002", "#FF781E" ], [ "#FFBE10", "#FFAE3C", "#FF7E49", "#E85137", "#333C3C" ], [ "#0E1D22", "#587077", "#555555", "#ECEBDF" ], [ "#F2385A", "#F5A503", "#E9F1DF", "#4AD9D9", "#36B1BF" ], [ "#E8463E", "#611410", "#FFCFCD", "#038733", "#63F598" ], [ "#4F8499", "#C95F5F", "#003145", "#012914", "#FCD457" ], [ "#406874", "#84D9D9", "#B8D9D3", "#35402A", "#592C1C" ], [ "#8F8164", "#D9D7AC", "#4F6373", "#293845", "#14212B" ], [ "#1C2623", "#37A672", "#E2CA63", "#F2884B", "#DB3323" ], [ "#FFD7AE", "#163A5C", "#1D2328", "#FE6200", "#ADB7BD" ], [ "#FFB919", "#8C12B2", "#C200FF", "#14CC83", "#09B26F" ], [ "#8C1822", "#BF1725", "#594F46", "#1C8476", "#006B5E" ], [ "#CF9CB3", "#626161", "#DEBC92", "#B68256", "#EDDFBB" ], [ "#A6442E", "#A65644", "#BF7665", "#D9A79C", "#F2F2F2" ], [ "#200101", "#421C0C", "#C9A860", "#4FA35E", "#076043" ], [ "#435939", "#737268", "#D9D4BA", "#D9D5C5", "#0D0000" ], [ "#467302", "#97BF04", "#D97904", "#A62F03", "#590902" ], [ "#69D2E7", "#A7DBD8", "#E0E4CC", "#F38630", "#FA6900" ], [ "#FE4365", "#FC9D9A", "#F9CDAD", "#C8C8A9", "#83AF9B" ], [ "#ECD078", "#D95B43", "#C02942", "#542437", "#53777A" ], [ "#556270", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58" ], [ "#774F38", "#E08E79", "#F1D4AF", "#ECE5CE", "#C5E0DC" ], [ "#E8DDCB", "#CDB380", "#036564", "#033649", "#031634" ], [ "#490A3D", "#BD1550", "#E97F02", "#F8CA00", "#8A9B0F" ], [ "#594F4F", "#547980", "#45ADA8", "#9DE0AD", "#E5FCC2" ], [ "#00A0B0", "#6A4A3C", "#CC333F", "#EB6841", "#EDC951" ], [ "#E94E77", "#D68189", "#C6A49A", "#C6E5D9", "#F4EAD5" ], [ "#D9CEB2", "#948C75", "#D5DED9", "#7A6A53", "#99B2B7" ], [ "#FFFFFF", "#CBE86B", "#F2E9E1", "#1C140D", "#CBE86B" ], [ "#EFFFCD", "#DCE9BE", "#555152", "#2E2633", "#99173C" ], [ "#3FB8AF", "#7FC7AF", "#DAD8A7", "#FF9E9D", "#FF3D7F" ], [ "#343838", "#005F6B", "#008C9E", "#00B4CC", "#00DFFC" ], [ "#413E4A", "#73626E", "#B38184", "#F0B49E", "#F7E4BE" ], [ "#99B898", "#FECEA8", "#FF847C", "#E84A5F", "#2A363B" ], [ "#FF4E50", "#FC913A", "#F9D423", "#EDE574", "#E1F5C4" ], [ "#554236", "#F77825", "#D3CE3D", "#F1EFA5", "#60B99A" ], [ "#351330", "#424254", "#64908A", "#E8CAA4", "#CC2A41" ], [ "#00A8C6", "#40C0CB", "#F9F2E7", "#AEE239", "#8FBE00" ], [ "#FF4242", "#F4FAD2", "#D4EE5E", "#E1EDB9", "#F0F2EB" ], [ "#655643", "#80BCA3", "#F6F7BD", "#E6AC27", "#BF4D28" ], [ "#8C2318", "#5E8C6A", "#88A65E", "#BFB35A", "#F2C45A" ], [ "#FAD089", "#FF9C5B", "#F5634A", "#ED303C", "#3B8183" ], [ "#BCBDAC", "#CFBE27", "#F27435", "#F02475", "#3B2D38" ], [ "#D1E751", "#FFFFFF", "#000000", "#4DBCE9", "#26ADE4" ], [ "#FF9900", "#424242", "#E9E9E9", "#BCBCBC", "#3299BB" ], [ "#5D4157", "#838689", "#A8CABA", "#CAD7B2", "#EBE3AA" ], [ "#5E412F", "#FCEBB6", "#78C0A8", "#F07818", "#F0A830" ], [ "#EEE6AB", "#C5BC8E", "#696758", "#45484B", "#36393B" ], [ "#1B676B", "#519548", "#88C425", "#BEF202", "#EAFDE6" ], [ "#F8B195", "#F67280", "#C06C84", "#6C5B7B", "#355C7D" ], [ "#452632", "#91204D", "#E4844A", "#E8BF56", "#E2F7CE" ], [ "#F04155", "#FF823A", "#F2F26F", "#FFF7BD", "#95CFB7" ], [ "#F0D8A8", "#3D1C00", "#86B8B1", "#F2D694", "#FA2A00" ], [ "#2A044A", "#0B2E59", "#0D6759", "#7AB317", "#A0C55F" ], [ "#67917A", "#170409", "#B8AF03", "#CCBF82", "#E33258" ], [ "#B9D7D9", "#668284", "#2A2829", "#493736", "#7B3B3B" ], [ "#BBBB88", "#CCC68D", "#EEDD99", "#EEC290", "#EEAA88" ], [ "#A3A948", "#EDB92E", "#F85931", "#CE1836", "#009989" ], [ "#E8D5B7", "#0E2430", "#FC3A51", "#F5B349", "#E8D5B9" ], [ "#B3CC57", "#ECF081", "#FFBE40", "#EF746F", "#AB3E5B" ], [ "#AB526B", "#BCA297", "#C5CEAE", "#F0E2A4", "#F4EBC3" ], [ "#607848", "#789048", "#C0D860", "#F0F0D8", "#604848" ], [ "#515151", "#FFFFFF", "#00B4FF", "#EEEEEE" ], [ "#3E4147", "#FFFEDF", "#DFBA69", "#5A2E2E", "#2A2C31" ], [ "#300030", "#480048", "#601848", "#C04848", "#F07241" ], [ "#1C2130", "#028F76", "#B3E099", "#FFEAAD", "#D14334" ], [ "#A8E6CE", "#DCEDC2", "#FFD3B5", "#FFAAA6", "#FF8C94" ], [ "#EDEBE6", "#D6E1C7", "#94C7B6", "#403B33", "#D3643B" ], [ "#AAB3AB", "#C4CBB7", "#EBEFC9", "#EEE0B7", "#E8CAAF" ], [ "#FDF1CC", "#C6D6B8", "#987F69", "#E3AD40", "#FCD036" ], [ "#CC0C39", "#E6781E", "#C8CF02", "#F8FCC1", "#1693A7" ], [ "#3A111C", "#574951", "#83988E", "#BCDEA5", "#E6F9BC" ], [ "#FC354C", "#29221F", "#13747D", "#0ABFBC", "#FCF7C5" ], [ "#B9D3B0", "#81BDA4", "#B28774", "#F88F79", "#F6AA93" ], [ "#5E3929", "#CD8C52", "#B7D1A3", "#DEE8BE", "#FCF7D3" ], [ "#230F2B", "#F21D41", "#EBEBBC", "#BCE3C5", "#82B3AE" ], [ "#5C323E", "#A82743", "#E15E32", "#C0D23E", "#E5F04C" ], [ "#4E395D", "#827085", "#8EBE94", "#CCFC8E", "#DC5B3E" ], [ "#DAD6CA", "#1BB0CE", "#4F8699", "#6A5E72", "#563444" ], [ "#5B527F", "#9A8194", "#C6A9A3", "#EBD8B7", "#99BBAD" ], [ "#C2412D", "#D1AA34", "#A7A844", "#A46583", "#5A1E4A" ], [ "#D1313D", "#E5625C", "#F9BF76", "#8EB2C5", "#615375" ], [ "#9D7E79", "#CCAC95", "#9A947C", "#748B83", "#5B756C" ], [ "#1C0113", "#6B0103", "#A30006", "#C21A01", "#F03C02" ], [ "#8DCCAD", "#988864", "#FEA6A2", "#F9D6AC", "#FFE9AF" ], [ "#CFFFDD", "#B4DEC1", "#5C5863", "#A85163", "#FF1F4C" ], [ "#75616B", "#BFCFF7", "#DCE4F7", "#F8F3BF", "#D34017" ], [ "#B6D8C0", "#C8D9BF", "#DADABD", "#ECDBBC", "#FEDCBA" ], [ "#382F32", "#FFEAF2", "#FCD9E5", "#FBC5D8", "#F1396D" ], [ "#E3DFBA", "#C8D6BF", "#93CCC6", "#6CBDB5", "#1A1F1E" ], [ "#A7C5BD", "#E5DDCB", "#EB7B59", "#CF4647", "#524656" ], [ "#413D3D", "#040004", "#C8FF00", "#FA023C", "#4B000F" ], [ "#9DC9AC", "#FFFEC7", "#F56218", "#FF9D2E", "#919167" ], [ "#A8A7A7", "#CC527A", "#E8175D", "#474747", "#363636" ], [ "#EDF6EE", "#D1C089", "#B3204D", "#412E28", "#151101" ], [ "#C1B398", "#605951", "#FBEEC2", "#61A6AB", "#ACCEC0" ], [ "#FFEDBF", "#F7803C", "#F54828", "#2E0D23", "#F8E4C1" ], [ "#7E5686", "#A5AAD9", "#E8F9A2", "#F8A13F", "#BA3C3D" ], [ "#5E9FA3", "#DCD1B4", "#FAB87F", "#F87E7B", "#B05574" ], [ "#951F2B", "#F5F4D7", "#E0DFB1", "#A5A36C", "#535233" ], [ "#FFFBB7", "#A6F6AF", "#66B6AB", "#5B7C8D", "#4F2958" ], [ "#000000", "#9F111B", "#B11623", "#292C37", "#CCCCCC" ], [ "#EFF3CD", "#B2D5BA", "#61ADA0", "#248F8D", "#605063" ], [ "#9CDDC8", "#BFD8AD", "#DDD9AB", "#F7AF63", "#633D2E" ], [ "#FCFEF5", "#E9FFE1", "#CDCFB7", "#D6E6C3", "#FAFBE3" ], [ "#84B295", "#ECCF8D", "#BB8138", "#AC2005", "#2C1507" ], [ "#0CA5B0", "#4E3F30", "#FEFEEB", "#F8F4E4", "#A5B3AA" ], [ "#4D3B3B", "#DE6262", "#FFB88C", "#FFD0B3", "#F5E0D3" ], [ "#B5AC01", "#ECBA09", "#E86E1C", "#D41E45", "#1B1521" ], [ "#4E4D4A", "#353432", "#94BA65", "#2790B0", "#2B4E72" ], [ "#379F7A", "#78AE62", "#BBB749", "#E0FBAC", "#1F1C0D" ], [ "#FFE181", "#EEE9E5", "#FAD3B2", "#FFBA7F", "#FF9C97" ], [ "#A70267", "#F10C49", "#FB6B41", "#F6D86B", "#339194" ], [ "#30261C", "#403831", "#36544F", "#1F5F61", "#0B8185" ], [ "#2D2D29", "#215A6D", "#3CA2A2", "#92C7A3", "#DFECE6" ], [ "#F38A8A", "#55443D", "#A0CAB5", "#CDE9CA", "#F1EDD0" ], [ "#793A57", "#4D3339", "#8C873E", "#D1C5A5", "#A38A5F" ] ];
    return {
        getRandomPalette: getRandomPalette,
        getRandomColour: function() {
            return null == currentPalette && getRandomPalette(!0), colourIndex = ~~(random() * currentPalette.length), 
            currentPalette[colourIndex];
        },
        getCurrentColour: function() {
            return null == currentPalette && getRandomPalette(!0), currentPalette[colourIndex];
        },
        getNextColour: function(offset) {
            return null == currentPalette && getRandomPalette(!0), null != offset ? colourIndex += offset : colourIndex++, 
            colourIndex += currentPalette.length, colourIndex %= currentPalette.length, currentPalette[colourIndex];
        },
        getPalleteIndex: function() {
            return paletteIndex;
        },
        setPalette: function(p) {
            currentPalette = p;
        },
        setRandomPalette: function(_paletteIndex) {
            currentPalette = palettes[paletteIndex = _paletteIndex];
        },
        setColourIndex: function(index) {
            colourIndex = index;
        },
        setPaletteRange: function(range) {
            if (range > currentPalette.length) return con.warn("setPaletteRange - current palette has less than", range, "colours!");
            var palette = rand.shuffle(currentPalette.slice());
            return currentPalette = palette.splice(0, range);
        },
        showPalette: showPalette,
        showColours: function() {
            css = [ ".palette {", "\tclear: both;", "\theight: 50px;", " margin-bottom: 20px", "}", ".colour {", "\twidth: 100px;", "\theight: 50px;", "\tfloat: left;", "\ttext-align: center;", "\tfont-size: 10px;", "\tline-height: 50px;", "}" ].join(""), 
            style = dom.element("style"), style.type = "text/css", style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css)), 
            document.head.appendChild(style), !0;
            var css, style;
            for (var h = document.createElement("div"), i = 0; i < palettes.length; i++) currentPalette = palettes[paletteIndex = i], 
            h.appendChild(showPalette());
            return document.body.appendChild(h), h;
        },
        mutateColour: function(colour, amount) {
            return function(hex, amount) {
                var rgb = hexToRgb(hex), r = rgb.r, g = rgb.g, b = rgb.b;
                return rgbToHex(r = mutateChannel(r, amount), g = mutateChannel(g, amount), b = mutateChannel(b, amount));
            }(colour, amount);
        },
        mixColours: function(colours) {
            for (var mixed = {
                r: 0,
                g: 0,
                b: 0
            }, c = 0, cl = colours.length; c < cl; c++) {
                var rgb = hexToRgb(colours[c]);
                mixed.r += rgb.r, mixed.g += rgb.g, mixed.b += rgb.b;
            }
            return mixed.r /= cl, mixed.g /= cl, mixed.b /= cl, mixed.r = parseInt(mixed.r), 
            mixed.g = parseInt(mixed.g), mixed.b = parseInt(mixed.b), rgbToHex(mixed.r, mixed.g, mixed.b);
        }
    };
}();

"undefined" != typeof module && (module.exports = colours);