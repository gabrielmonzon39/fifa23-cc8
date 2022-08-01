const io = require("socket.io")(3000, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  socket.emit("hello", "world", (response) => {
    console.log(response); // "got it"
  });
  console.log(socket.id);
});

io.on("move_up", (arg, callback) => {
  console.log(arg); // "world"
  callback("got it");
});
