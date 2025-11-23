d = document

bits = 200
gap = 2
size = bits * gap
centre = size / 2
ctx = null
can = null
oscs = 4
seeds = []

init = () ->
  can = d.createElement("canvas")
  can.width = can.height = size
  d.body.appendChild(can)

  ctx = can.getContext("2d")

  for i in [0...oscs] by 1
    seeds[i] = Math.pow(2,(i+1)) + (Math.random() * 2 - 1) * 10

  draw()


draw = (time) ->
  can.width = can.width

  vs = []
  for x in [0...bits] by 1

    v = 0
    for i in [0...oscs] by 1
      o = Math.sin((time / 10 + x) * seeds[i] * 0.01 ) / Math.pow(2,(i+1))
      y = centre + o * 100

      r = 100 + 50 * i
      b = 200 - 50 * i
      ctx.fillStyle = "rgba(#{r},0,#{b},0.5)"
      ctx.fillRect(x * gap, y, 2, 2)

      v += o
    vs.push(v)

  for x in [0...bits] by 1
    v = vs[x]
    y = centre + v * centre / oscs

    r = x * 255 / bits
    b = 255 - r
    ctx.fillStyle = "rgb(#{r},0,#{b})"
    ctx.fillRect(x * gap, y, 10, 10)

  requestAnimationFrame(draw)


init()