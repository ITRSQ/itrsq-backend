const express = require("express");
const router = express.Router();
const Tutorial = require("../models/Tutorial");

router.get(`/tutorials`, async (req, res) => {
  console.log("Using Route : /tutorials");
  console.log(req.query);
  try {
    const tutorials = await Tutorial.find();
    res.status(200).json(tutorials);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/tutorial/create", async (req, res) => {
  console.log("Using Route : /tutorial/create");
  try {
    const { author, text, picture, title } = req.fields;

    const newTutorial = await new Tutorial({
      author,
      text,
      picture,
      title,
    });
    newTutorial.save();
    res.status(200).json({
      _id: newTutorial._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
