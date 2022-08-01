const { io } = require("socket.io-client");
const socket = io("ws://localhost:3000");

socket.on("connect", () => {
  console.log(socket.id); // ojIckSD2jqNzOqIrAGzL
});

socket.on("hello", (arg, callback) => {
  console.log(arg); // "world"
});

export default function move_up() {
  socket.emit("hello", "world", (response) => {
    console.log(response); // "got it"
  });
  console.log(socket.id);
}
