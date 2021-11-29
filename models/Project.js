// Model for Projects

const mongoose = require("mongoose");

const Project = mongoose.model("Project", {
  client: {
    clientId: String,
    firstName: String,
    lastName: String,
  },
  progress: Array,
  type: String,
  refNumber: String,
  title: String,
  preview: String,
});

module.exports = Project;
