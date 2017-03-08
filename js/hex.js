let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let context = ctx;

let width = window.innerWidth;
let height = window.innerHeight;

let centerX = width * 0.5;
let centerY = height * 0.5;
let colors = ["lightgreen", "#424254", "lightblue", "#E8CAA4", "tomato"];

canvas.width = width;
canvas.height = height;

const MAX_LINE_WIDTH = 1,
  SIZE = 25,
  OFFSET = SIZE / 5,
  VELOCITY_X = 20,
  VELOCITY_Y = 20,
  ENEMY_RADIUS = 100,
  HEX_SIZE = SIZE / 2,
  MAX_SIZE = HEX_SIZE + OFFSET;

let objs = [];
let spacingX = SIZE + OFFSET;
let spacingY = SIZE;
let enemyObj = {
  x: centerX,
  y: centerY,
  r: ENEMY_RADIUS
}

function iterate(cb) {
  let i = 0;

  for (let y = 0; y < height + spacingY; y += spacingY) {
    let iY = y / spacingY % 2;

    for (let x = 0; x < width + spacingX; x += spacingX) {
      let cX = x;
      if (iY % 2 == 0) {
        cX += spacingX / 2;
      };

      cb({
        x: cX,
        y,
        i
      });
      i++;
    }
  }
}

function init() {
  if (!objs.length) {
    iterate(({
      x,
      y,
      i
    }) => {
      objs.push(newObj(x, y));
    })
  }
}

function animate() {
  window.requestAnimationFrame(animate);
  render();
}

function render() {
  ctx.clearRect(0, 0, width, height);

  reset();
  enemyLoop();

  iterate(({
    i
  }) => {
    let o = objs[i];

    if (isEnemy(o)) {
      if (o.s < MAX_SIZE) {
        o.s += 0.1;
      }
    } else {
      let d = new Date();
      if (o.s < 0) {
        o.s = Math.sin(d);
      } else {
        o.s -= 0.1;
      }

    }

    // if(o.s > MAX_SIZE) {
    //   // o.s = SIZE;
    // }

    drawHex(o);
  })
}

function isEnemy(hex) {
  let x = hex.x < enemyObj.x + enemyObj.r && hex.x > enemyObj.x - enemyObj.r;
  let y = hex.y < enemyObj.y + enemyObj.r && hex.y > enemyObj.y - enemyObj.r;
  return x && y;
}

function reset() {
  if (enemyObj.r > Math.max(width, height)) {
    enemyObj.r = 10;
  }

  if (enemyObj.x > width || enemyObj.x < 0) {
    enemyObj.x = centerX;
  }

  if (enemyObj.y > height || enemyObj.y < 0) {
    enemyObj.y = centerX;
  }
}

let angle = 0;

function enemyLoop() {
  let a = Math.PI / 180 * angle;
  var x = centerX + Math.cos(a) * enemyObj.r;
  var y = centerY + Math.sin(a) * enemyObj.r;

  enemyObj.x = x;
  enemyObj.y = y;
  angle += 1;
  enemyObj.r += 1;
}

function drawHex(o) {
  ctx.beginPath();
  ctx.moveTo(o.x + o.s * Math.cos(o.r), o.y + o.s * Math.sin(o.r));

  for (let i = 1; i <= o.nS; i += 1) {
    let angle = (i * 2 * Math.PI / o.nS) + o.r;
    ctx.lineTo(o.x + o.s * Math.cos(angle), o.y + o.s * Math.sin(angle));
  }

  ctx.fillStyle = o.c;
  ctx.lineWidth = o.lW;
  ctx.fill();
}

function newObj(x, y) {
  return {
    nS: 6,
    s: HEX_SIZE,
    x: x,
    y: y,
    c: randomC(),
    r: 100,
    lW: MAX_LINE_WIDTH
  }
}

init();
animate();

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomC() {
  return colors[random(0, colors.length - 1)];
}