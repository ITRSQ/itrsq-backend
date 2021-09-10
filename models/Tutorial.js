// Model for Tutorials

const mongoose = require("mongoose");

const Tutorial = mongoose.model("Tutorial", {
  author: String,
  text: String,
  picture: String,
  title: String,
});

module.exports = Tutorial;
