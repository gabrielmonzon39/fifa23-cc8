const { io } = require("socket.io-client");

export default function bar() {
  const socket = io("ws://localhost:3000");

  // send a message to the server
  socket.emit("hello from client");
}
