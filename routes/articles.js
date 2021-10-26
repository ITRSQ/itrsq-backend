const express = require("express");
const router = express.Router();
const Article = require("../models/Article");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  console.log(req.fields.author);
  try {
    let newPicture = "";
    const { author, text, title, tags } = req.fields;
    const picture = req.files.picture.path;

    const result = await cloudinary.uploader.upload(picture, {
      folder: "/articles",
    });
    newPicture = result.url;

    const newArticle = await new Article({
      author,
      text,
      picture: newPicture,
      title,
      tags,
    });
    newArticle.save();
    res.status(200).json({
      _id: newArticle._id,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
