// Model for Testimonals

const mongoose = require("mongoose");

const Testimonal = mongoose.model("Testimonal", {
  author: String,
  authorPosition: String,
  picture: String,
  testimonial: String,
});

module.exports = Testimonal;
