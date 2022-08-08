const io = require("socket.io")(3000, {
    cors: {
      origin: "*",
    },
  });
  
  socket_hash = {};
  readyCount = 0;

  io.on("connection", (socket) => {
    // emit to player the player number
    socket.emit("player_number", Object.keys(socket_hash).length);
  
    //add to socket_hash, player number is the count of players
    socket_hash[socket.id] = {
      socket: socket,
      player_number: Object.keys(socket_hash).length,
    };
  
    //if player number is 6, broadcast to all players that the game is full
    socket.on("ready", (player_number) => {
        console.log("player " + player_number + " is ready");
        readyCount++;
        console.log("Los listos son: " + readyCount);
        if (readyCount == 2) {
        io.emit("game_full");
        console.log("game full");
        }
    });
  
    //when move_up is sent, broadcast with player number to all players
    socket.on("move_up", (player_number) => {
      io.emit("move_up", player_number);
      console.log("move up" + player_number);
    });
  
    //when move_down is sent, broadcast with player number to all players
    socket.on("move_down", (player_number) => {
      io.emit("move_down", player_number);
      console.log("move down" + player_number);
    });
  
    //on disconnect, remove from socket_hash
    socket.on("disconnect", () => {
      delete socket_hash[socket.id];
      console.log("disconnect" + socket.id);
    });
  
    console.log("a user connected" + socket.id);
  });