import kaboom from "kaboom";
import { io } from "socket.io-client";

// get ip from url params
const url = new URL(window.location.href);
const ip = url.searchParams.get("ip");

// CONEXION CON EL SERVIDOR
const socket = io("ws://" + ip);
let player_number = -1;
let game_full = false;

socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("player_number", (number) => {
  player_number = number;
  console.log(`Player number: ${player_number}`);
});

socket.on("game_full", () => {
  game_full = true; //if player number is 0, call send_ball_coordinates every 100ms
  if (player_number == 0) {
    setInterval(send_ball_coordinates, 10);
  }
  console.log("Game full");
});

var current_pos_x = 0;
var current_pos_y = 0;
//get ball_coordinates from socket
socket.on("ball_coordinates", (x, y, vx, vy) => {
  // ignore if player_number is 0
  if (player_number == 0) return;
  currentSpeedX = vx;
  currentSpeedY = vy;
  current_pos_x = x;
  current_pos_y = y;
});

//send ball_coordinates to server
function send_ball_coordinates() {
  socket.emit(
    "ball_coordinates",
    current_pos_x,
    current_pos_y,
    currentSpeedX,
    currentSpeedY
  );
}

// emit move_up to server with player number
function move_up() {
  socket.emit("move_up", player_number);
}

function move_down() {
  socket.emit("move_down", player_number);
}

// send swing action
function swing_offensive() {
  socket.emit("swing_offensive", player_number);
}

function swing_defensive() {
  socket.emit("swing_defensive", player_number);
}

// receive swing action
socket.on("swing_offensive", (player_number) => {
  // console.log(`Player ${player_number} make a swing offensive`);
  // switch player number to move up
  switch (player_number) {
    case 0:
      make_swing_offensive(players1);
      break;
    case 1:
      make_swing_offensive(players3);
      break;
    case 2:
      make_swing_offensive(players2);
      break;
    case 3:
      make_swing_offensive(enemy1);
      break;
    case 4:
      make_swing_offensive(enemy3);
      break;
    case 5:
      make_swing_offensive(enemy2);
      break;
  }
});

socket.on("swing_defensive", (player_number) => {
  // console.log(`Player ${player_number} make a swing defensive`);
  // switch player number to move up
  switch (player_number) {
    case 0:
      make_swing_defensive(players1);
      break;
    case 1:
      make_swing_defensive(players3);
      break;
    case 2:
      make_swing_defensive(players2);
      break;
    case 3:
      make_swing_defensive(enemy1);
      break;
    case 4:
      make_swing_defensive(enemy3);
      break;
    case 5:
      make_swing_defensive(enemy2);
      break;
  }
});

function make_swing_offensive(player) {
  for (var i = 0; i < player.length; i++) {
    add([
      sprite("swing"),
      scale(0.2),
      lifespan(1),
      pos(player[i].pos.x + swingX, player[i].pos.y - swingY),
      area(),
      solid(),
      "swing",
    ]);
  }
}

function make_swing_defensive(player) {
  for (var i = 0; i < player.length; i++) {
    add([
      sprite("swing"),
      scale(0.2),
      lifespan(1),
      pos(player[i].pos.x - 2.5 * swingX, player[i].pos.y - swingY),
      area(),
      solid(),
      "swing",
    ]);
  }
}

socket.on("move_up", (player_number) => {
  // console.log(`Player ${player_number} moved up`);
  movePlayer = true;
  // switch player number to move up
  switch (player_number) {
    case 0:
      p1UP = true;
      break;
    case 1:
      p3UP = true;
      break;
    case 2:
      p2UP = true;
      break;
    case 3:
      e1UP = true;
      break;
    case 4:
      e3UP = true;
      break;
    case 5:
      e2UP = true;
      break;
  }
});

socket.on("move_down", (player_number) => {
  // console.log(`Player ${player_number} moved down`);
  movePlayer = true;
  // switch player number to move down
  switch (player_number) {
    case 0:
      p1DOWN = true;
      break;
    case 1:
      p3DOWN = true;
      break;
    case 2:
      p2DOWN = true;
      break;
    case 3:
      e1DOWN = true;
      break;
    case 4:
      e3DOWN = true;
      break;
    case 5:
      e2DOWN = true;
      break;
  }
});

// MUSIC
let audioMusica = document.getElementById("musica");
let audioGol = document.getElementById("gol");
let audioAviso = document.getElementById("aviso");
//let audioChoque = document.getElementById("choque");
audioMusica.volume = 0.2;
audioMusica.play();

const width = 1600;
const height = 1000;

const fieldWidth = 1350;
const fieldHeight = 850;

const speedX = 175;
const speedY = 275;
//const speedX = 0
//const speedY = -50

const remainingTime = 120;

let currentSpeedX = speedX;
let currentSpeedY = speedY;

let horizontalCollide = false;
let verticalCollide = false;
let readyState = true;

let goals1 = 0;
let goals2 = 0;
let moveBall = true;
let movePlayer = true;

const playerSpeed = 1200;
const friction = 0;
const impulsePlayer = 0;
const impulseSwing = 100;

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
loadSprite("background", "./background.jpg");
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
loadSprite(
  "swing",
  "http://2.bp.blogspot.com/_lj_y7Z_fw94/S7hJYY0udEI/AAAAAAAAA14/P-cNKvMZBV0/s1600/sun+animated+clip+art.gif"
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

// mensaje de indicación de jugador
function getPlayerLocation(player_number) {
  switch (player_number) {
    case 0:
      return "\t\tEsperando...\nEres el portero\n de los rojos\n\t\t\t\t\t\tP1";
    case 1:
      return "\t\tEsperando...\nEres el centrocampista\n de los rojos\n\t\t\t\t\t\tP3";
    case 2:
      return "\t\tEsperando...\nEres el delantero\n de los rojos\n\t\t\t\t\t\tP2";
    case 3:
      return "\t\tEsperando...\nEres el portero\n de los verdes\n\t\t\t\t\t\tE1";
    case 4:
      return "\t\tEsperando...\nEres el centrocampista\n de los verdes\n\t\t\t\t\t\tE3";
    case 5:
      return "\t\tEsperando...\nEres el delantero\n de los verdes\n\t\t\t\t\tE2";
  }
  return "Ha ocurrido un error";
}

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
    pos(
      fieldWidth / 2 - fieldWidth / 11 + 45,
      fieldHeight / 2 - fieldHeight / 3.5
    ),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("player"),
    scale(0.005),
    pos(fieldWidth / 2 - fieldWidth / 11 + 45, fieldHeight / 2),
    area(),
    solid(),
    "player1",
  ]),
  add([
    sprite("player"),
    scale(0.005),
    pos(
      fieldWidth / 2 - fieldWidth / 11 + 45,
      fieldHeight / 2 + fieldHeight / 3.5
    ),
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

const P1 = add([text("P1"), pos(120, 950), scale(3), layer("ui")]);

const P3 = add([text("P3"), pos(550, 950), scale(3), layer("ui")]);

const P2 = add([text("P2"), pos(1170, 950), scale(3), layer("ui")]);

const E2 = add([text("E2"), pos(330, 950), scale(3), layer("ui")]);

const E3 = add([text("E3"), pos(950, 950), scale(3), layer("ui")]);

const E1 = add([text("E1"), pos(1400, 950), scale(3), layer("ui")]);

timer.onUpdate(() => {
  if (
    timer.time <= remainingTime / 2 + 1 &&
    timer.time >= remainingTime / 2 - 1
  ) {
    shake(8);
    audioAviso.play();
    add([
      text("Quedan " + remainingTime / 2 + "segundos"),
      origin("left"),
      pos(width / 2 - width / 4, height / 2),
      scale(6),
      lifespan(3),
    ]);
    add([
      pos(width / 2 + width / 7, height / 2 - height / 4),
      sprite("lightning"),
      lifespan(3),
    ]);
  }
  if (timer.time >= 119 && player_number != -1) {
    //while (player_number == -1);
    if (readyState) {
      readyState = false;
      socket.emit("ready", player_number);
    }
    add([
      text(getPlayerLocation(player_number)),
      origin("left"),
      pos(width / 2 - width / 7, height / 2),
      scale(4),
      lifespan(3),
    ]);
  }
  if (timer.time > 0 && game_full) timer.time -= dt();
  timer.text = timer.time.toFixed(2);
  if (timer.time <= 0) {
    moveBall = false;
    movePlayer = false;
    var message = getScoreMessage(player_number);
    message = "JUEGO TERMINADO\n\t\t" + message;
    add([
      text(message),
      origin("left"),
      pos(width / 2 - width / 5, height / 2),
      scale(5),
    ]);
  }
});

function getScoreMessage(player_number) {
  //goals1 == goals2 ? "EMPATE" : goals1 < goals2 ? "DERROTA" : "VICTORIA";
  if (goals1 == goals2) return "EMPATE";
  if (player_number == 0 || player_number == 1 || player_number == 2) {
    if (goals1 > goals2) return "VICTORIA";
    return "DERROTA";
  } else {
    if (goals2 > goals1) return "VICTORIA";
    return "DERROTA";
  }
}

function reduceSpeed(impulseX, impulseY) {
  if (currentSpeedY > 0) {
    currentSpeedY -= friction + impulseY;
  } else {
    currentSpeedY += friction + impulseY;
  }
  if (currentSpeedX > 0) {
    currentSpeedX -= friction + impulseX;
  } else {
    currentSpeedX += friction + impulseX;
  }
}

function swingChangeSpeed(impulseX, impulseY) {
  if (currentSpeedY > 0) {
    currentSpeedY += impulseY;
  } else {
    currentSpeedY -= impulseY;
  }
  if (currentSpeedX > 0) {
    currentSpeedX += impulseX;
  } else {
    currentSpeedX -= impulseX;
  }
}

onLoad(() => {});

onUpdate("ball", (b) => {
  if (!moveBall) return;
  if (!game_full) return;
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
  if (player_number != 0) {
    b.pos.x = current_pos_x;
    b.pos.y = current_pos_y;
    //b.move(currentSpeedX, currentSpeedY);
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
    if (player_number == 0) b.move(currentSpeedX, currentSpeedY);

    if (b.pos.x == previousX && b.pos.y == previousY) {
      horizontalCollide = true;
      verticalCollide = true;
    } else {
      previousX = b.pos.x;
      previousY = b.pos.y;
      break;
    }
  }
  current_pos_x = b.pos.x;
  current_pos_y = b.pos.y;
  reduceSpeed(0, 0);
});

onUpdate("player1", () => {
  // -----------  PLAYER 3  -----------
  if (!movePlayer) return;
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
  for (var i = 0; i < allPlayers.length; i++) {
    var player = allPlayers[i];
    if (
      Math.abs(ball.pos.x - player.pos.x) < 60 &&
      Math.abs(ball.pos.y - player.pos.y) < 20 &&
      !awaitChange
    ) {
      awaitChange = true;
      horizontalCollide = true;
      reduceSpeed(impulsePlayer, 0);
      break;
    }
    if (
      Math.abs(ball.pos.y - player.pos.y) < 55 &&
      Math.abs(ball.pos.x - player.pos.x) < 55 &&
      !awaitChange
    ) {
      awaitChange = true;
      verticalCollide = true;
      reduceSpeed(0, impulsePlayer);
      break;
    }
  }
});

onCollide("ball", "swing", () => {
  //audioChoque.play();
  const allSwings = get("swing");
  for (var i = 0; i < allSwings.length; i++) {
    var swingObject = allSwings[i];
    if (
      Math.abs(ball.pos.x - swingObject.pos.x) < 60 &&
      Math.abs(ball.pos.y - swingObject.pos.y) < 20 &&
      !awaitChange
    ) {
      awaitChange = true;
      horizontalCollide = true;
      swingChangeSpeed(impulseSwing, impulseSwing);
      //break;
    } else {
      verticalCollide = true;
    }
    /*if (
      Math.abs(ball.pos.y - swingObject.pos.y) < 55 &&
      Math.abs(ball.pos.x - swingObject.pos.x) < 55 &&
      !awaitChange
    ) {
      awaitChange = true;
      verticalCollide = true;
      swingChangeSpeed(impulseSwing, impulseSwing);
      break;
    }*/
  }
});

// -----------------------------------
// Desfases del swing de cada jugador
const swingX = 30;
const swingY = 20;

// -----------  PLAYER 3  -----------
onKeyPress("w", () => {
  move_up();
});

onKeyPress("s", () => {
  move_down();
});

onKeyPress("j", () => {
  swing_defensive();
});

onKeyPress("l", () => {
  swing_offensive();
});

onCollide("ball", "bordeVertical", () => {
  horizontalCollide = true;
  reduceSpeed(0, impulsePlayer);
});

onCollide("ball", "bordeHorizontal", () => {
  verticalCollide = true;
  reduceSpeed(impulsePlayer, 0);
});

onCollide("ball", "porteria1", () => {
  audioGol.play();
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
  audioGol.play();
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
