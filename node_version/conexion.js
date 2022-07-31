const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

export default function move_up() {
  socket.emit("move_up", "hello");
}
