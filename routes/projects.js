const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

router.get(`/projects`, async (req, res) => {
  console.log("Using Route : /projects");
  console.log(req.query);
  try {
    const projects = await Article.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/project/create", async (req, res) => {
  console.log("Using Route : /project/create");
  try {
    const { clientId, type, refNumber, title, firstName, lastName } =
      req.fields;

    const newProject = await new Project({
      client: {
        firstName,
        lastName,
        clientId,
      },

      type,
      refNumber,
      title,
    });
    newProject.save();
    res.status(200).json({
      _id: newProject._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get(`/projects/:clientId`, async (req, res) => {
  console.log("Using Route : /projects/:clientId");
  console.log(req.params.clientId);
  try {
    const projects = await Project.find();
    const newProjects = [];

    if (
      projects.findIndex((x) => x.client.clientId === req.params.clientId) ===
      -1
    ) {
      res
        .status(400)
        .json({ error: "Could not find any orders for this client" });
    } else {
      for (i = 0; i < projects.length; i++) {
        if (projects[i].client.clientId === req.params.clientId) {
          newProjects.push(projects[i]);
        }
      }
      res.status(200).json(newProjects);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
