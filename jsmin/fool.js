"use strict";

var sw = window.innerWidth, sh = window.innerHeight, navOpen = !0;

function navClass() {
    return "nav" + (navOpen ? " open" : "");
}

var container = dom.element("div", {
    className: "container",
    style: {
        width: sw + "px",
        height: sh + "px"
    }
}), nav = dom.element("div", {
    className: navClass()
}), navMenu = dom.element("div", {
    className: "menu"
}), navTab = dom.element("div", {
    className: "tab"
}), navIcon = dom.element("ul", {
    className: "icon",
    innerHTML: [ "first", "second", "third" ].map(function(a, i) {
        return "<li class='" + a + "'></li>";
    }).join("")
}), space = dom.element("div", {
    innerHTML: "Hello World!",
    className: "space"
});

container.appendChild(nav), nav.appendChild(navMenu), nav.appendChild(navTab), navTab.appendChild(navIcon), 
container.appendChild(space), document.body.appendChild(container), navTab.addEventListener("click", function() {
    navOpen = !navOpen, nav.className = navClass();
});

var options = [ {
    label: "Hello",
    items: [ {
        label: "A"
    }, {
        label: "B"
    } ]
}, {
    label: "World"
}, {
    label: "There",
    items: [ {
        label: "May or"
    }, {
        label: "May not"
    }, {
        label: "Exist"
    }, {
        label: "A"
    }, {
        label: "Situation"
    } ]
}, {
    label: "Is",
    items: [ {
        label: "A Computer"
    }, {
        label: "Behind you"
    } ]
} ], itemHeight = 20;

function navY(items) {
    return (items + options.length) / 2 * -itemHeight + "px";
}

function createOption(option) {
    var main = dom.element("div", {
        className: "main"
    }), button = dom.element("div", {
        className: "option",
        innerHTML: option.label
    });
    if (navMenu.appendChild(main), main.appendChild(button), option.items) {
        var suboptions = dom.element("div", {
            className: "sub-options"
        });
        main.appendChild(suboptions);
        for (var j = 0; j < option.items.length; j++) {
            var suboption = option.items[j], sub = dom.element("div", {
                className: "sub-option",
                innerHTML: suboption.label
            });
            suboptions.appendChild(sub);
        }
        button.addEventListener("click", function(e) {
            if (lastSub) {
                if (lastSub == suboptions) return;
                lastSub.style.height = 0;
            }
            setTimeout(function() {
                suboptions.style.height = option.items.length * itemHeight + "px";
            }, 400), lastSub = suboptions, navMenu.style.marginTop = navY(option.items.length);
        });
    } else button.addEventListener("click", function(e) {
        navMenu.style.marginTop = navY(0), lastSub && (lastSub.style.height = 0, lastSub = null);
    });
}

for (var lastSub = null, i = 0; i < options.length; i++) createOption(options[i]);

navMenu.style.marginTop = navY(0), window.addEventListener("resize", function() {
    sw = window.innerWidth, sh = window.innerHeight, container.setSize(sw, sh);
});