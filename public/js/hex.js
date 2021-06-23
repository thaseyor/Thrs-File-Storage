var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  points,
  total = 150,
  drawn = 0,
  size = (canvas.width / 5) | 0,
  mx = 0,
  my = 0,
  sin = size * Math.sin(Math.PI / 6),
  cos = size * Math.cos(Math.PI / 6),
  color

canvas.width = document.body.clientWidth
canvas.height = Math.max(window.innerHeight, document.body.clientHeight)
ctx.shadowBlur = 15
ctx.lineWidth = 1
ctx.strokeStyle = 'rgb(10,10,10)'
ctx.shadowColor = 'rgb(10,10,10)'

function click(e) {
  for (var i = 0; i < 2; i++) {
    mx = Math.random() * canvas.width
    my = Math.random() * canvas.height
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    rndcol()
    draw(ctx)
  }
}

function rndcol() {
  color = Math.floor(Math.random() * 16777215)
    .toString(16)
    .match(/.{2}/g)
  var r = parseInt(color[0], 16) | 0,
    g = parseInt(color[1], 16) | 0,
    b = parseInt(color[2], 16) | 0
  color = r + ',' + g + ',' + b
}

function draw(c) {
  init(total)
  base(mx, my, c)
}

function init(total) {
  points = []
  for (var i = total - 1; i >= 0; i--) {
    points[i] = []
  }
  drawn = 0
}

function base(x, y, c) {
  hexa(x, y, c)
  points[drawn][0] = Math.floor(x)
  points[drawn][1] = Math.floor(y)
  drawn++

  requestAnimationFrame(function() {
    siblings(x, y)
  })
}

function hexa(x, y, c) {
  c.beginPath()
  c.moveTo(x, y)
  c.lineTo(x + size, y)
  c.lineTo(x + size + sin, y + cos)
  c.lineTo(x + size, y + 2 * cos)
  c.lineTo(x, y + 2 * cos)
  c.lineTo(x - sin, y + cos)
  c.lineTo(x, y)
  c.stroke()
  c.fillStyle = 'rgba(' + color + ',' + (1 - (drawn / total) * 1.05) + ')'
  c.fill()
}

function siblings(x, y) {
  if (drawn >= total - 1) return
  for (var i = 0; i < 2; i++) {
    var nxt = randomsiblings(x, y)
    if (nxt[0] || nxt[1]) {
      base(nxt[0], nxt[1], ctx)
    }
  }

  return
}

function randomsiblings(x, y) {
  var randomnum = [1, 2, 3, 4, 5, 6].sort(function() {
    return 0.5 - Math.random()
  })

  var newx = x
  var newy = y

  for (var i = 0; i < 6 && checker(newx, newy); ++i) {
    switch (randomnum[i]) {
      case 1:
        //top left
        newx = x - sin - size
        newy = y - cos
        break
      case 2:
        //top
        newx = x
        newy = y - 2 * cos
        break
      case 3:
        //top right
        newx = x + sin + size
        newy = y - cos
        break
      case 4:
        //bottom right
        newx = x + sin + size
        newy = y + cos
        break
      case 5:
        //bottom
        newx = x
        newy = y + 2 * cos
        break
      case 6:
        //bottom left
        newx = x - sin - size
        newy = y + cos
        break
      default:
        newx = 0
        newy = 0
        break
    }

    if (!outerbounds(newx, newy)) {
      newx = x
      newy = y
    }
  }

  if (checker(newx, newy)) {
    newx = 0
    newy = 0
  }

  var nextsibling = []
  nextsibling[0] = newx
  nextsibling[1] = newy

  return nextsibling
}

function checker(x, y) {
  for (var i = 0; i < points.length; ++i) {
    if (
      Math.abs(points[i][0] == Math.floor(x)) &&
      Math.abs(points[i][1] == Math.floor(y))
    ) {
      return true
    }
  }
  return false
}

function outerbounds(x, y) {
  return !(
    x + size * 2 < 0 ||
    y + size * 2 < 0 ||
    x - size * 2 > canvas.width ||
    y - size * 2 > canvas.height
  )
}

click()
