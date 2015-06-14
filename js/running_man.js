var con = console;
var isNode = (typeof module !== 'undefined');

<<<<<<< HEAD
var limbs = {
	"thigh": {
		"range": 1,
		"baserot": 0.3,
		"length": 90,
		"offset": 0
	},
	"calf": {
		"range": -0.6,
		"baserot": -0.9,
		"length": 90,
		"offset": Math.PI / 2
	},
	"foot": {
		"range": 0.5,
		"baserot": 1.4,
		"length": 20,
		"offset": 0
	}
};

=======
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2
var running_man = (function() {

	var sw = 600, sh = 600;

	var bmp = dom.canvas(sw,sh);
	var ctx = bmp.ctx;

	var cx = sw * 3 /4
	var cy = sh * 1/ 4;

	var editor = dom.element("div", {style: {position: "absolute", top: 10, left: 10}});
<<<<<<< HEAD
	var output = dom.element("pre", {style: {color: "white","font-size":"10px", }});
=======
	var output = dom.element("pre", {style:{color: "white","font-size":"10px", }});
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2


	function createLimb(options) {

		var parent = options.parent;
<<<<<<< HEAD

		return {
			pos: {},
			calc: function(time) {
				var osc = options.movement.baserot + Math.sin(time + options.movement.offset + options.phase) * options.movement.range;
				var pos = this.position(osc);
				return Math.max(cy + pos.sy, cy + pos.ey);
=======
		var fn = options.fn;
		var offset = options.offset;

		return {
			pos: {},
			render: function(time) {
				var osc = options.movement.baserot + fn(time + offset) * options.movement.range;
				var pos = this.position(osc);
				ctx.beginPath();
				ctx.strokeStyle = "#0f0";
				ctx.moveTo(cx + pos.sx, cy + pos.sy);
				ctx.lineTo(cx + pos.ex, cy + pos.ey);
				ctx.stroke();
				ctx.closePath();
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2
			},
			position: function(osc) {
				if (osc) {
					var pos = {
						sx: 0,
						sy: 0,
						ex: 0 + Math.sin(osc) * options.movement.length,
						ey: 0 + Math.cos(osc) * options.movement.length
					}
					if (parent) {
						var parentPos = parent.position();
						pos.sx += parentPos.ex;
						pos.sy += parentPos.ey;
						pos.ex += parentPos.ex;
						pos.ey += parentPos.ey;
					}
<<<<<<< HEAD
					this.pos = pos;
				}
				return this.pos;
			},
			render: function(max) {
				ctx.beginPath();
				ctx.strokeStyle = "#0f0";
				ctx.fillStyle = "#0f0";
				ctx.moveTo(cx + this.pos.sx, max + cy + this.pos.sy);
				ctx.lineTo(cx + this.pos.ex, max + cy + this.pos.ey);
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.drawCircle(cx + this.pos.sx, max + cy + this.pos.sy, 5);
				ctx.drawCircle(cx + this.pos.ex, max + cy + this.pos.ey, 5);
				ctx.closePath();
				ctx.fill();
=======
					// con.log(pos);
					this.pos = pos;
					return pos;
				} else {
					return this.pos;
				}
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2
			}
		}
	}

<<<<<<< HEAD
	function settings() {
		output.innerHTML = ("var limbs = " + JSON.stringify(limbs, null, "\t") + ";");
	};
	settings();
	
=======
var limbs = {
	"thigh": {
		"range": 1,
		"baserot": 0.5,
		"length": 90
	},
	"calf": {
		"range": -1,
		"baserot": -0.9,
		"length": 90
	},
	"foot": {
		"range": -0.5,
		"baserot": 1.6,
		"length": 20
	}
};
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2

	function createEditor(l,k) {
		var edit = dom.element("div");
		var label = dom.element("span", {innerHTML: l + ":" + k + ":", style:{color: "white"}});
		var input = dom.element("input", {value: limbs[l][k], type: "number"});
		editor.appendChild(edit);
		edit.appendChild(label);
		edit.appendChild(input);
		input.addEventListener("change", function(e) {
			limbs[l][k] = parseFloat(e.target.value);
<<<<<<< HEAD
			settings();
=======
			output.innerHTML = ("var limbs = " + JSON.stringify(limbs, null, "\t") + ";");
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2
		})
	}

	for (var l in limbs) {
		for (var k in limbs[l]) {
			createEditor(l,k);
		}
	}
	document.body.appendChild(editor);
	editor.appendChild(output);


<<<<<<< HEAD
	var t1 = createLimb({parent: null, movement: limbs.thigh, phase: 0});
	var c1 = createLimb({parent: t1, movement: limbs.calf, phase: 0});
	var f1 = createLimb({parent: c1, movement: limbs.foot, phase: 0});
	var t2 = createLimb({parent: null, movement: limbs.thigh, phase: Math.PI});
	var c2 = createLimb({parent: t2, movement: limbs.calf, phase: Math.PI});
	var f2 = createLimb({parent: c2, movement: limbs.foot, phase: Math.PI});
=======


	var t1 = createLimb({parent: null, movement: limbs.thigh, fn: Math.sin, offset: 0});
	var c1 = createLimb({parent: t1, movement: limbs.calf, fn: Math.cos, offset: 0});
	var f1 = createLimb({parent: c1, movement: limbs.foot, fn: Math.sin, offset: 0});
	var t2 = createLimb({parent: null, movement: limbs.thigh, fn: Math.sin, offset: Math.PI});
	var c2 = createLimb({parent: t2, movement: limbs.calf, fn: Math.cos, offset: Math.PI});
	var f2 = createLimb({parent: c2, movement: limbs.foot, fn: Math.sin, offset: Math.PI});
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2

	function render(t) {
		// var time = 50;
		var time = t / 300;

		ctx.clearRect(0, 0, sw, sh);
		// ctx.fillStyle = "#0f0";
		// ctx.fillRect(cx - 2, cy - 2, 4, 4);

<<<<<<< HEAD
		// cy = 200 - Math.abs(Math.sin(time) * 50);
		var max = 0;
		t1.calc(time);
		max = Math.max(max, c1.calc(time));
		max = Math.max(max, f1.calc(time));
		t2.calc(time);
		max = Math.max(max, c2.calc(time));
		max = Math.max(max, f2.calc(time));

		var horizon = 300;
		// cy = max;
		ctx.fillStyle = "#040";
		ctx.fillRect(cx - 100, horizon, 200, 10);

		max = horizon - max;
		t1.render(max);
		c1.render(max);
		f1.render(max);
		t2.render(max);
		c2.render(max);
		f2.render(max);



=======
		t1.render(time);
		c1.render(time);
		f1.render(time);

		t2.render(time);
		c2.render(time);
		f2.render(time);
>>>>>>> cfbc399014f8293c0cbc325710bb65d58abaa0a2

		requestAnimationFrame(render);
	}
	render(0);

	var experiment = {
		stage: bmp.canvas,
		inner: null,
		resize: function() {},
		init: function() {},
		kill: function() {}
	}

	if (!isNode) dispatchEvent(new CustomEvent("load:complete", {detail:experiment}));

	return experiment;

})();

if (isNode) module.exports = running_man;