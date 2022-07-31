const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

io.on("move_up", (socket) => {
  var msg = data + "world";
  socket.emit("news-response", msg);
  console.log("hola");
});
