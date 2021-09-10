// Model for Articles

const mongoose = require("mongoose");

const Article = mongoose.model("Article", {
  author: String,
  text: String,
  picture: String,
  title: String,
});

module.exports = Article;
