"use strict";

define("exps_details", function () {
  var list = [
    // ["unknown"],
    // ["_test"],

    ["additive"],
    ["aegean_sun"],
    ["alien"],
    // ["anemone_three", "THREE"], // this sux.
    // ["any_image_url"], // works, but pointless
    ["aristotle"],
    ["attractor"],
    ["ball_and_chain", "THREE"],
    // ["bill_stevens", "THREE", "TweenMax", "lib/three/OrbitControls.js"], // not presentable
    ["bezier_flow"],
    ["box", "maze"],
    ["circle_packing"],
    // ["circle_packing_zoom_loop"],
    ["circle_sectors"],
    ["codevember", "THREE", "TweenMax"],
    ["corona_sine"],
    ["creature"], //, "creature_creator"], //, "creature_creator/creature_creator", "creature_creator/human"],
    ["cube_fractal_zoom", "THREE", "TweenMax"],
    ["cube_pixelator", "THREE", "TweenMax"],
    // ["experiment_template_babel"],
    ["fool", "css:fool"],
    ["frame_inverse"],
    ["fur"],
    ["hex_rounded", "THREE"],
    ["hexagon_tile"],
    ["infinite_scrolling_cogs"],
    // ["infinite_stairs", "THREE"],
    ["interpolated", "lagrange"],
    ["isometric_cubes"],
    ["isometric_words", "THREE", "TweenMax"],
    ["lego_stack", "THREE"],
    ["linked_line"],
    ["mandala"],
    ["maze"],
    ["maze_cube", "linked_line", "THREE"], //, "https://threejs.org/examples/js/exporters/OBJExporter.js"],//  "lib/three/OBJExporter.js", "lib/three/OrbitControls.js"],
    ["meandering_polygons"],
    ["mining_branches"],
    ["molecular_three", "THREE"],
    ["nested_rotating_polygon", "ease"],
    ["oscillate_curtain"],
    ["oscillator"],
    ["overflow"],
    ["pattern_check", "css:pattern_check"],
    ["pattern_circles"],
    ["perlin_dots"],
    ["perlin_grid", "THREE", "TweenMax"],
    ["perlin_leaves"],
    ["perlin_noise"],
    ["polygon_slice"],
    // ["polyhedra", "3d"], // 3d is not moduled!
    ["polyhedra_three", "THREE", "../lib/stemkoski/polyhedra"],
    // ["pine_three", "THREE"],
    ["race_lines_three", "THREE", "TweenMax"],
    ["rainbow_particles"],
    ["rectangular_fill"],
    ["recursive"],
    ["recursive_circle"],
    ["recursive_polygon"],
    // ["reddit_proc_gen"],
    ["seven_four_sevens"],
    ["spiral_even"],
    ["squaretracer"],
    // ["squash_match_shirt", "fill/stripes", "fill/dither"],
    ["synth_ambient", "Tone"],
    ["tea"],
    ["tentacle"],
    ["tessellation"],
    ["tetris_cube", "THREE", "TweenMax"],
    ["text_grid"],
    ["triangles", "THREE", "TweenMax"],
    ["tunnel_tour_three", "THREE", "TweenMax"],
    ["typography"],
    [
      "voronoi_stripes",
      "voronoi",
      "fill/stripes",
      "fill/dither",
    ],
    ["zoned_particles"],
  ];

  var details = {
    additive: {
      description:
        "<p>Multiple oscillations of sine are added together.</p>\n<p>Background lines are each sine wave, foreground is their combined values.</p>\n<p>Very much how audio additive synthesis works.</p>",
      src: "coffeescript",
    },
    ball_and_chain: {
      description:
        "<p>In the celebration of the <a href='http://www.abc.net.au/news/2017-11-15/australia-reacts-to-the-same-sex-marriage-survey-results/9151826' target='_blank'>Yes</a> Vote, started making this ball and chain in THREE + Cannon. Took a bit longer than expected, hopefully I can make a rainbow happy one for legalisation day.</p><p>Something along the lines of \"It's raining ball and chains\"</p>",
    },
    creature: {
      description:
        "<p>Simulated walk pattern.</p>\n<p>Did you know you can approximately model all sorts of movement with just sin and cos?</p>\n<p>This is rendered in 3 ways:\n<li>Green is a canvas, bitmap rendering</li>\n<li>Red is divs, with inline styling</li>\n<li>Blue is divs, with css keyframes (does not update after load)</li>\n</p>",
    },
    cube_fractal_zoom: {
      description:
        "<p>Zooming into a cube that subdivides into muliple cubes.</p><p>Envisioned version is for each subdivision to be variable slice amounts rather than 2x2x2. Someday.</p><p>Also would like some kind of infinite shader, potentially perlin noise.</p>",
    },
    cube_pixelator: {
      description:
        "<p>Should be called 'Plane pixelator' since they are planes, not cubes.</p><p>Planes are distributed through a 2 dimensional grid with each plane representing a pixel.</p><p>Each plane is exactly the same colour and this colour never changes. Instead, each plane rotates accordingly to catch the lighting within the scene and by doing so adapts its apparent shade, and thereby creates an image.</p>",
    },
    fool: {
      description:
        "<p>A minimal navigation experiment with tree structures. There may have been some cutting edge CSS tricks utilised.</p>",
    },
    frame_inverse: {
      description:
        "<p>Drawing rectangles, aye...</p><p>listen to <a href='https://youngerbrothermusic.bandcamp.com/album/the-last-days-of-gravity' target='_blank'>Younger Brother - Last Days of Gravity</a>.</p>",
    },
    fur: {
      description:
        "<p>2 channels of perlin noise affect x and y lean of each hair of fur.</p>",
    },
    hex_rounded: {
      description:
        "<p>Hex Rounded? Some title, but that's what it's been dubbed since inception in 2014 or so. Never worked properly, so fixed it up for Codevember 2017.</p>",
    },
    infinite_scrolling_cogs: {
      description:
        "<p>Remake of <a href='https://codepen.io/raurir/pen/eknLg' target='_blank'>an old experiment</a> this time it's scrolling, non ineractive and more of a toon rendering style.</p><p>The thing I liked the best about the original, and this algorithm, is the cogs are very close to mathematically correct; not only do they animate in a life like fashion on screen, I am confident a 3D print of the geometry involved would result in a smoothly running friction free machine.</p><p>This algorithm continually creates canvases with no garbage collection. It will crash the browser eventually, I imagine, but you'd be bored after a minute anyway?</p>",
    },
    infinite_stairs: {
      description:
        "<p>Work in progress</p><p>Trying to make an infinite staircase, potentially spooky.</p>",
    },
    interpolated: {
      description: "<p>FXhash exp</p>",
    },
    isometric_words: {
      description:
        "<p>Muddling up cubes by using the simplicity of Isometric projection.</p><p>Randomly offset the objects along the same axis the camera is looking down.</p>",
    },
    lego_stack: {
      description:
        "<p>Important scientifically realistic simulation to study how high lego can be stacked.</p>",
    },
    linked_line: {
      description:
        "<p>Labyrinth generator. Brute force method, starts with a simple line and tries to find points that the line can expand to, to find a more twisty line.</p>\n\t\t\t<p>There are 4 debug canvases:\n\t\t\t<li>Actual size as it generates: green dots are active points that can be explored more</li>\n\t\t\t<li>Zoomed in as it generates</li>\n\t\t\t<li>Zoomed in canvas after processing is complete</li>\n\t\t\t<li>Zoomed in canvas showing wall calculations</li>\n\t\t\t</p>",
    },
    maze: {
      src: "coffeescript",
    },
    maze_cube: {
      description:
        "<p>A never ending line, technically a labyrinth not a maze as the title suggests, navigates around all faces of a cube.</p>",
    },

    overflow: {
      title: "Overflow Polygons",
      description:
        "<p>Polygons possibly overlap. Points within are highlighted red.</p>",
    },
    polyhedra_three: {
      description:
        "<p>Somewhat custom render of polyhedra.</p>\n<p>This was a preemptive exploration for rendering to print and writing a custom 3d engine in Lua.</p>\n<p>It uses Stemkoski's polyhedra data from <a href='https://stemkoski.github.io/Three.js/Polyhedra.html' target='_blank'>here</a> \nwhich in turn uses George Hart's data from <a href='https://www.georgehart.com/virtual-polyhedra/vp.html' target='_blank'>here</a>.</p>",
    },
    recursive: {
      src: "coffeescript",
    },
    recursive_circle: {
      description:
        "<p>Recursive rendering. Managed to not crash my browser creating this! Life achievement.</p>",
      preventRefresh: true,
    },
    seven_four_sevens: {
      description:
        "<p>An old flash experiment remade in javascript.</p><p>Thanks to the demise of flash I will lose heaps of graphical experiments, some irretrievably lost due to inability to open .FLAs - luckily this one had the source in a .as file.</p>",
    },
    squaretracer: {
      src: "coffeescript",
    },
    synth_ambient: {
      description:
        "<h2>This will be loud!</h2><p>A quick trip into audio synthesis in the browser.</p><p>That's the thing about synthesis, you can create out of control waveforms quite easily, hence the volume.</p><p>Using <a href='https://github.com/Tonejs/Tone.js' target='_blank'>Tone.js</a> for all the audio generation, this experiment creates a number of randomised effects, a bunch of randomised synthesizers, and with those creates a randomised drum track, randomised chords and a ranomised arpeggio.</p>",
    },
    triangles: {
      description:
        "<p>A plane of triangles fall away as they zoom towards the screen.</p><p>Probably a bit heavy for phones.</p>",
    },
  };

  list.every(function (v, i, a) {
    var ok = !i || a[i - 1][0] <= v[0];
    if (!ok)
      throw new Error("oops! experiment out of order:" + v[0]);
    return ok;
  });
  Object.keys(details).every(function (k, i, a) {
    var ok = !i || a[i - 1] <= k;
    if (!ok) throw new Error("oops! detail out of order:" + k);
    return ok;
  });

  return {
    list: list,
    getDetails: function getDetails(exp) {
      return details[exp] || false;
    },
    getFeature: function getFeature(key) {
      var features = {
        codevember: [
          {
            day: 1,
            title: details.cube_pixelator.title,
            link: "cube_pixelator",
          },
          {
            day: 2,
            title: details.synth_ambient.title,
            link: "synth_ambient",
          },
          {day: 3, title: "Refactored Experiments"}, // not actually an experiment
          {day: 4, title: "Made Codevember"}, // not actually an experiment
          {day: 5, title: "fail :("}, // might back fill this one, probably have some more fails though
          {
            day: 6,
            title: details.isometric_words.title,
            link: "isometric_words",
          },
          {day: 7, title: "fail ..."},
          {
            day: 8,
            title: details.cube_fractal_zoom.title,
            link: "cube_fractal_zoom",
          },
          {
            day: 9,
            title: details.infinite_scrolling_cogs.title,
            link: "infinite_scrolling_cogs",
          },
          {day: 10, title: "nope :|"},
          {
            day: 11,
            title: details.infinite_stairs.title,
            link: "infinite_stairs",
          },
          {day: 12, title: "much fail."},
          {
            day: 13,
            title: details.seven_four_sevens.title,
            link: "seven_four_sevens",
          },
          {
            day: 14,
            title: details.triangles.title,
            link: "triangles",
          },
          {day: 15, title: "very..."},
          {day: 16, title: "...lame!"},
          {
            day: 17,
            title: details.ball_and_chain.title,
            link: "ball_and_chain",
          },
          {day: 18, title: details.fur.title, link: "fur"},
          {
            day: 19,
            title: details.recursive_circle.title,
            link: "recursive_circle",
          },
          {
            day: 20,
            title: details.lego_stack.title,
            link: "lego_stack",
          },
          {
            day: 21,
            title: details.hex_rounded.title,
            link: "hex_rounded",
          },
          {day: 22, title: "faily McFail O'clock"},
          {
            day: 23,
            title: details.frame_inverse.title,
            link: "frame_inverse",
          },
        ],
      };
      return features[key] || false;
    },
  };
});
