con = console
d = document
container = null
canvas = null
size = 800
centre = size / 2
ctx = null

rotMod = Math.PI / 4 # 0.2

settings = {}


createSlider = (prop, min, max, ini, granularity = 1) ->
	div = d.createElement("div")
	div.style.display = "flex"

	label = d.createElement("label")
	label.innerHTML = "#{prop}:"
	label.style.color = "#ccc"
	label.style.width = "200px"

	input = d.createElement("input")
	input.type = "text"
	input.value = ini

	range = d.createElement("input")
	range.type = "range"
	range.min = min / granularity
	range.max = max / granularity
	range.name = prop
	range.value = ini / granularity

	div.appendChild(label)
	div.appendChild(range)
	div.appendChild(input)
	container.appendChild(div)

	change = (e) ->
		v = e.target.value * granularity
		settings[prop] = Number(v)
		input.value = v
		redraw()

	changeText = (e) ->
		v = e.target.value
		settings[prop] = Number(v)
		range.value = v / granularity
		redraw()

	input.addEventListener("change", changeText)
	range.addEventListener("change", change)
	range.addEventListener("input", change)
	settings[prop] = ini


redraw = () ->
	canvas.width = canvas.width
	draw(centre, 50, 0, 0)

draw = (x, y, branchAngle, level) ->

	level++

	items = settings.items
	maxRecursion = settings.maxRecursion
	angleSpiral = settings.angleSpiral
	angleSpread = settings.angleSpread
	lineThickness = settings.lineThickness

	rgb = 55 + (1 - level / maxRecursion) * 200
	
	for j in [0...items]

		half = (items - 1) / 2

		branchScale = 1 - (j - half) / half * settings.symmetry

		scale = settings.scale / level * branchScale

		w = 30 * scale * lineThickness
		h = 100 * scale

		rotation = angleSpread * (j - half) + branchAngle * angleSpiral

		# con.log("draw", level, j, scale)

		ctx.save()
		ctx.translate(x, y)
		ctx.rotate(rotation)
		ctx.fillStyle = "rgb(#{rgb},#{rgb},#{rgb})"
		ctx.fillRect( - w * 1 / 2, 0, w * 1, h * 1)
		ctx.restore()

		newX = x + h * - Math.sin(rotation)
		newY = y + h * Math.cos(rotation)

		if level < maxRecursion
			draw(newX, newY, rotation, level, j)

init = () ->
	container = d.createElement("div")
	d.body.appendChild(container)

	createSlider("items", 1, 10, 2)
	createSlider("maxRecursion", 1, 10, 5)
	createSlider("angleSpiral", 0, 2, 1, 0.01)
	createSlider("angleSpread", 0, 2, Math.PI / 2, 0.01)
	createSlider("symmetry", -1, 1, 0, 0.01)
	createSlider("scale", 0, 10, 1, 0.01)
	createSlider("lineThickness", 0.1, 1, 1, 0.01)


	canvas = d.createElement("canvas")
	canvas.style.border = "1px solid #333"
	canvas.width = canvas.height = size
	container.appendChild(canvas)

	ctx = canvas.getContext("2d")

	# window.addEventListener("mousemove", (e) =>
	#   # rotMod = e.x * 0.05
	#   # rotMod = Math.PI / ~~(e.x / 10 + 1)
	#   # items = ~~(e.y / 10 ) + 1 # (level+1)*2
	#   # if items > 10
	#   #   items = 10
	#   # con.log(rotMod, items)
	#   # draw(centre, centre, 0)
	# )

	# setInterval(
	#   () =>
	#     for i in [0...10]
	#       rotMod += Math.PI / 32.23871238971 # 0.02
	#       draw(centre, 50, 0)
	#   10
	# )

	redraw()

init()
