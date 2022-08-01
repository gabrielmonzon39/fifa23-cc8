import kaboom from "kaboom";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("hello", (arg, callback) => {
  console.log(arg); // "world"
});

function move_up() {
  socket.emit("hello", "world", (response) => {
    console.log(response); // "got it"
  });
  console.log(socket.id);
}

// MUSIC
let audio = document.getElementById("gol");

const width = 1600;
const height = 1000;

const fieldWidth = 1350;
const fieldHeight = 850;

const speedX = 269;
const speedY = 365;
//const speedX = 0
//const speedY = -50

const remainingTime = 120;

let currentSpeedX = speedX;
let currentSpeedY = speedY;

let horizontalCollide = false;
let verticalCollide = false;

let goals1 = 0;
let goals2 = 0;

const playerSpeed = 1200;
const friction = 0.1;

let p3Counter = 0,
  p3UP = false,
  p3DOWN = false,
  p3Limit = 3;
let p2Counter = 0,
  p2UP = false,
  p2DOWN = false,
  p2Limit = 4;
let p1Counter = 0,
  p1UP = false,
  p1DOWN = false,
  p1Limit = 5;

let e3Counter = 0,
  e3UP = false,
  e3DOWN = false,
  e3Limit = 3;
let e2Counter = 0,
  e2UP = false,
  e2DOWN = false,
  e2Limit = 4;
let e1Counter = 0,
  e1UP = false,
  e1DOWN = false,
  e1Limit = 5;

let awaitChange = false;
let previousX = 0;
let previousY = 0;

// initialize context
kaboom({
  width: width,
  height: height,
  font: "sinko",
  canvas: document.querySelector("#mycanvas"),
});

// load assets
loadSprite(
  "background",
  "https://static.vecteezy.com/system/resources/previews/000/264/902/original/vector-scifi-space-background-for-ui-game.jpg"
);
loadSprite(
  "ball",
  "https://www.mariowiki.com/images/thumb/1/15/Ball_MarioStrikersCharged.png/180px-Ball_MarioStrikersCharged.png"
);
loadSprite(
  "player",
  "https://static.vecteezy.com/system/resources/previews/000/545/296/original/abstract-stripes-oblique-lines-texture-red-background-vector.jpg"
);
//loadSprite("player", "https://snap.skindb.co/fallguys/faceplate/5f419b7b15498d2a702a989b/icon.png")
loadSprite(
  "lightning",
  "https://gifimage.net/wp-content/uploads/2018/04/lightning-gif-transparent-1.gif"
);
loadSprite(
  "enemy",
  "http://4.bp.blogspot.com/-ZcYLHi0RNNc/UEBlZivLzyI/AAAAAAAACYs/RGa97yyjW7Y/s72-c/green_website_background_pattern.jpg"
);

// player  556*556
//         scale(0.005)

// enemy   72*72
//         scale(0.38)

layer(["obj", "ui"], "obj");

// add the background to screen
add([sprite("background"), pos(0, 0), scale(0.2257, 0.2051)]);

// add the outer field
add([
  rect(fieldWidth, 1),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 - fieldWidth / 2, height / 2 - fieldHeight / 2),
  area(),
  solid(),
  "bordeHorizontal",
]);
add([
  rect(fieldWidth, 1),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 - fieldWidth / 2, height / 2 + fieldHeight / 2),
  area(),
  solid(),
  "bordeHorizontal",
]);
add([
  rect(1, fieldHeight / 2 - fieldHeight / 5),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 - fieldWidth / 2, height / 2 - fieldHeight / 2),
  area(),
  solid(),
  "bordeVertical",
]);
add([
  rect(1, fieldHeight / 2 - fieldHeight / 5),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 + fieldWidth / 2, height / 2 - fieldHeight / 2),
  area(),
  solid(),
  "bordeVertical",
]);
add([
  rect(1, fieldHeight / 2 - fieldHeight / 5),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 - fieldWidth / 2, height / 2 + fieldHeight / 5),
  area(),
  solid(),
  "bordeVertical",
]);
add([
  rect(1, fieldHeight / 2 - fieldHeight / 5),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 + fieldWidth / 2, height / 2 + fieldHeight / 5),
  area(),
  solid(),
  "bordeVertical",
]);
add([
  rect(100, 1),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 - fieldWidth / 2 - 100, height / 2 - fieldHeight / 5),
  area(),
  solid(),
  "bordeHorizontal",
]);
add([
  rect(100, 1),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 + fieldWidth / 2, height / 2 - fieldHeight / 5),
  area(),
  solid(),
  "bordeHorizontal",
]);
add([
  rect(100, 1),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 - fieldWidth / 2 - 100, height / 2 + fieldHeight / 5),
  area(),
  solid(),
  "bordeHorizontal",
]);
add([
  rect(100, 1),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 + fieldWidth / 2, height / 2 + fieldHeight / 5),
  area(),
  solid(),
  "bordeHorizontal",
]);

const porteria1 = add([
  rect(1, (2 * fieldHeight) / 5),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 - fieldWidth / 2 - 100, height / 2 - fieldHeight / 5),
  area(),
  solid(),
  "porteria1",
]);

const porteria2 = add([
  rect(1, (2 * fieldHeight) / 5),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2 + fieldWidth / 2 + 100, height / 2 - fieldHeight / 5),
  area(),
  solid(),
  "porteria2",
]);

// add the inner field
add([
  rect(1, fieldHeight),
  outline(10, CYAN),
  opacity(0),
  pos(width / 2, height / 2 - fieldHeight / 2),
]);

add([
  pos(width / 2, height / 2),
  outline(10, CYAN),
  opacity(0),
  circle(fieldWidth / 17),
]);

// add the ball to screen
var ball = add([
  sprite("ball"),
  scale(0.3),
  // --33*2
  pos(width / 2, height / 2 - height / 5),
  //pos(70, height/2),
  //move(UP, speedX),
  area(),
  solid(),
  "ball",
]);

// add the player (3) to screen
var players3 = [
  add([
    sprite("player"),
    scale(0.005),
    pos(fieldWidth / 2 - fieldWidth / 11, fieldHeight / 2 - fieldHeight / 3.5),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("player"),
    scale(0.005),
    pos(fieldWidth / 2 - fieldWidth / 11, fieldHeight / 2),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("player"),
    scale(0.005),
    pos(fieldWidth / 2 - fieldWidth / 11, fieldHeight / 2 + fieldHeight / 3.5),
    area(),
    solid(),
    "player1",
  ]),
];

// add the player (1) to screen
var players1 = [
  add([
    sprite("player"),
    scale(0.005),
    pos(fieldWidth / 11, fieldHeight / 2 + fieldHeight / 21),
    area(),
    solid(),
    "player1",
  ]),
];

// add the player (2) to screen
var players2 = [
  add([
    sprite("player"),
    scale(0.005),
    pos(fieldWidth / 2 + fieldWidth / 2.8, fieldHeight / 2 - fieldHeight / 7),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("player"),
    scale(0.005),
    pos(fieldWidth / 2 + fieldWidth / 2.8, fieldHeight / 2 + fieldHeight / 5),
    area(),
    solid(),
    "player1",
  ]),
];

// add the enemy (3) to screen
var enemy3 = [
  add([
    sprite("enemy"),
    scale(0.38),
    pos(fieldWidth / 2 + fieldWidth / 5, fieldHeight / 2 - fieldHeight / 3.5),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("enemy"),
    scale(0.38),
    pos(fieldWidth / 2 + fieldWidth / 5, fieldHeight / 2),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("enemy"),
    scale(0.38),
    pos(fieldWidth / 2 + fieldWidth / 5, fieldHeight / 2 + fieldHeight / 3.5),
    area(),
    solid(),
    "player1",
  ]),
];

// add the enemy (1) to screen
var enemy1 = [
  add([
    sprite("enemy"),
    scale(0.38),
    pos(width - fieldWidth / 7, fieldHeight / 2 + fieldHeight / 21),
    area(),
    solid(),
    "player1",
  ]),
];

// add the enemy (2) to screen
var enemy2 = [
  add([
    sprite("enemy"),
    scale(0.38),
    pos(fieldWidth / 2 - fieldWidth / 4, fieldHeight / 2 - fieldHeight / 7),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("enemy"),
    scale(0.38),
    pos(fieldWidth / 2 - fieldWidth / 4, fieldHeight / 2 + fieldHeight / 5),
    area(),
    solid(),
    "player1",
  ]),
];

const score = add([
  text("0:0"),
  pos(width / 2 - 57, 25),
  layer("ui"),
  scale(5),
  {
    value: 0,
  },
]);

const timer = add([
  text("0"),
  pos(120, 25),
  scale(5),
  layer("ui"),
  {
    time: remainingTime,
  },
]);

timer.action(() => {
  if (timer.time > 0) timer.time -= dt();
  timer.text = timer.time.toFixed(2);
  if (timer.time <= 0) {
    add([
      text("JUEGO TERMINADO"),
      pos(width / 2 - width / 5, height / 2),
      scale(5),
    ]);
  }
});

onUpdate("ball", (b) => {
  if (
    currentSpeedX < 5 &&
    currentSpeedX > -5 &&
    currentSpeedY < 5 &&
    currentSpeedY > -5
  ) {
    b.pos.x = width / 2;
    b.pos.y = height / 2;
    currentSpeedX = speedX;
    currentSpeedY = speedY;
    return;
  }
  while (true) {
    if (horizontalCollide) {
      currentSpeedX = currentSpeedX * -1;
      horizontalCollide = false;
    }
    if (verticalCollide) {
      currentSpeedY = currentSpeedY * -1;
      verticalCollide = false;
    }
    awaitChange = false;
    b.move(currentSpeedX, currentSpeedY);

    if (b.pos.x == previousX && b.pos.y == previousY) {
      horizontalCollide = true;
      verticalCollide = true;
    } else {
      previousX = b.pos.x;
      previousY = b.pos.y;
      break;
    }
  }
  if (currentSpeedY > 0) {
    currentSpeedY -= friction;
  } else {
    currentSpeedY += friction;
  }
  if (currentSpeedX > 0) {
    currentSpeedX -= friction;
  } else {
    currentSpeedX += friction;
  }
});

onUpdate("player1", () => {
  // -----------  PLAYER 3  -----------
  if (p3UP) {
    if (p3Counter < p3Limit) {
      for (var i = 0; i < players3.length; i++) {
        let player = players3[i];
        player.move(0, -playerSpeed);
      }
      p3Counter++;
    }
    p3UP = false;
  }
  if (p3DOWN) {
    if (p3Counter > -p3Limit) {
      for (var i = 0; i < players3.length; i++) {
        let player = players3[i];
        player.move(0, playerSpeed);
      }
      p3Counter--;
    }
    p3DOWN = false;
  }

  // -----------  PLAYER 2  -----------
  if (p2UP) {
    if (p2Counter < p2Limit) {
      for (var i = 0; i < players2.length; i++) {
        let player = players2[i];
        player.move(0, -playerSpeed);
      }
      p2Counter++;
    }
    p2UP = false;
  }
  if (p2DOWN) {
    if (p2Counter > -p2Limit) {
      for (var i = 0; i < players2.length; i++) {
        let player = players2[i];
        player.move(0, playerSpeed);
      }
      p2Counter--;
    }
    p2DOWN = false;
  }

  // -----------  PLAYER 1  -----------
  if (p1UP) {
    if (p1Counter < p1Limit) {
      for (var i = 0; i < players1.length; i++) {
        let player = players1[i];
        player.move(0, -playerSpeed);
      }
      p1Counter++;
    }
    p1UP = false;
  }
  if (p1DOWN) {
    if (p1Counter > -p1Limit) {
      for (var i = 0; i < players1.length; i++) {
        let player = players1[i];
        player.move(0, playerSpeed);
      }
      p1Counter--;
    }
    p1DOWN = false;
  }

  // -----------  Enemigo 3  -----------
  if (e3UP) {
    if (e3Counter < e3Limit) {
      for (var i = 0; i < enemy3.length; i++) {
        let player = enemy3[i];
        player.move(0, -playerSpeed);
      }
      e3Counter++;
    }
    e3UP = false;
  }
  if (e3DOWN) {
    if (e3Counter > -e3Limit) {
      for (var i = 0; i < enemy3.length; i++) {
        let player = enemy3[i];
        player.move(0, playerSpeed);
      }
      e3Counter--;
    }
    e3DOWN = false;
  }

  // -----------  Enemigo 2  -----------
  if (e2UP) {
    if (e2Counter < e2Limit) {
      for (var i = 0; i < enemy2.length; i++) {
        let player = enemy2[i];
        player.move(0, -playerSpeed);
      }
      e2Counter++;
    }
    e2UP = false;
  }
  if (e2DOWN) {
    if (e2Counter > -e2Limit) {
      for (var i = 0; i < enemy2.length; i++) {
        let player = enemy2[i];
        player.move(0, playerSpeed);
      }
      e2Counter--;
    }
    e2DOWN = false;
  }

  // -----------  Enemigo 1  -----------
  if (e1UP) {
    if (e1Counter < e1Limit) {
      for (var i = 0; i < enemy1.length; i++) {
        let player = enemy1[i];
        player.move(0, -playerSpeed);
      }
      e1Counter++;
    }
    e1UP = false;
  }
  if (e1DOWN) {
    if (e1Counter > -e1Limit) {
      for (var i = 0; i < enemy1.length; i++) {
        let player = enemy1[i];
        player.move(0, playerSpeed);
      }
      e1Counter--;
    }
    e1DOWN = false;
  }
});

// pelota 180*169 scale(0.3)
// cuadros 72*72 scale(0.38)
// 72 * 0.38 = 25 ancho de imagen por la escala colocada
// ...
onCollide("ball", "player1", () => {
  const allPlayers = get("player1");
  //console.log(currentSpeedY);
  for (var i = 0; i < allPlayers.length; i++) {
    var player = allPlayers[i];
    //console.log(i + " - " + ball.pos.x + ", " + ball.pos.y + " : " + player.pos.x + ", " + player.pos.y)
    if (
      Math.abs(ball.pos.x - player.pos.x) < 60 &&
      Math.abs(ball.pos.y - player.pos.y) < 20 &&
      !awaitChange
    ) {
      awaitChange = true;
      horizontalCollide = true;
      //console.log("Horizontal X");
      break;
    }
    if (
      Math.abs(ball.pos.y - player.pos.y) < 55 &&
      Math.abs(ball.pos.x - player.pos.x) < 55 &&
      !awaitChange
    ) {
      awaitChange = true;
      verticalCollide = true;
      //console.log("Vertical X");
      break;
    }
  }
});

// -----------  PLAYER 3  -----------
onKeyPress("w", () => {
  p3UP = true;
  move_up();
});
onKeyPress("s", () => {
  p3DOWN = true;
});

// -----------  PLAYER 2  -----------
onKeyPress("e", () => {
  p2UP = true;
});
onKeyPress("d", () => {
  p2DOWN = true;
});

// -----------  PLAYER 1  -----------
onKeyPress("q", () => {
  p1UP = true;
});
onKeyPress("a", () => {
  p1DOWN = true;
});

// -----------  ENEMY 3  -----------
onKeyPress("i", () => {
  e3UP = true;
});
onKeyPress("k", () => {
  e3DOWN = true;
});

// -----------  ENEMY 2  -----------
onKeyPress("u", () => {
  e2UP = true;
});
onKeyPress("j", () => {
  e2DOWN = true;
});

// -----------  ENEMY 1  -----------
onKeyPress("o", () => {
  e1UP = true;
});
onKeyPress("l", () => {
  e1DOWN = true;
});

onCollide("ball", "bordeVertical", () => {
  horizontalCollide = true;
});

onCollide("ball", "bordeHorizontal", () => {
  verticalCollide = true;
});

onCollide("ball", "porteria1", () => {
  audio.play();
  horizontalCollide = true;
  goals2++;
  score.text = goals1 / 2 + ":" + goals2 / 2;
  ball.pos = new Vec2(width / 2, height / 2);
  currentSpeedX = speedX;
  currentSpeedY = speedY;
  shake();
  add([
    pos(-width / 5, height / 2 - height / 4),
    sprite("lightning"),
    lifespan(3, { fade: 2 }),
  ]);
});

onCollide("ball", "porteria2", () => {
  audio.play();
  horizontalCollide = true;
  goals1++;
  score.text = goals1 / 2 + ":" + goals2 / 2;
  ball.pos = new Vec2(width / 2, height / 2);
  currentSpeedX = speedX;
  currentSpeedY = speedY;
  shake();
  add([
    pos(width / 2 + width / 7, height / 2 - height / 4),
    sprite("lightning"),
    lifespan(3, { fade: 2 }),
  ]);
});
