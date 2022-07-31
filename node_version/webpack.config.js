const path = require("path");

module.exports = {
  entry: "./kaboom.js",
  output: {
    path: path.resolve(__dirname, "./"),
    filename: "bundle.js",
  },
};
