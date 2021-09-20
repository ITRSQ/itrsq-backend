const express = require("express");
const router = express.Router();
const Article = require("../models/Article");

router.get(`/articles`, async (req, res) => {
  console.log("Using Route : /articles");
  console.log(req.query);
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/article/create", async (req, res) => {
  console.log("Using Route : /article/create");
  try {
    const { author, text, picture, title, tags } = req.fields;

    const newArticle = await new Article({
      author,
      text,
      picture,
      title,
      tags,
    });
    newArticle.save();
    res.status(200).json({
      _id: newArticle._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
