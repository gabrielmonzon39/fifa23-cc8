const path = require("path");

module.exports = {
  entry: { local: "./kaboom.js", multiplayer: "./kaboom_multiplayer.js" },
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "[name].js",
  },
};
