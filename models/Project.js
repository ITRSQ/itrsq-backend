// Model for Projects

const mongoose = require("mongoose");

const Project = mongoose.model("Project", {
  client: {
    clientId: String,
    firstName: String,
    lastName: String,
  },

  type: String,
  refNumber: String,
  title: String,
});

module.exports = Project;
