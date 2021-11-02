// Model for User

const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  token: String,
  hash: String,
  salt: String,
  newsletter: Boolean,
});

module.exports = User;
