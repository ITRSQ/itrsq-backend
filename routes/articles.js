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

router.get(`/article/:id`, async (req, res) => {
  console.log("Using Route : /articles");
  console.log(req.query);
  try {
    const articles = await Article.findById(req.params.id);
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
    newPicture = result.secure_url;

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

router.put("/article/update", async (req, res) => {
  console.log("Using Route : /article/update");
  const urlCheck = /^((http|https|ftp):\/\/)/;
  try {
    let newPicture = "";
    const { author, text, title, tags, id } = req.fields;
    const article = await Article.findById(id);
    const picture = req.files.picture
      ? req.files.picture.path
      : req.fields.picture;
    if (!urlCheck.test(picture)) {
      const result = await cloudinary.uploader.upload(picture, {
        folder: "/articles",
      });
      newPicture = result.secure_url;
    } else {
      newPicture = picture;
    }
    article.author = author;
    article.text = text;
    article.title = title;
    article.tags = tags;
    article.picture = newPicture;
    await article.save();
    res.status(200).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/article/delete", async (req, res) => {
  console.log("Using Route : /article/delete");
  try {
    await Article.findByIdAndDelete(req.fields.id);
    const article = await Article.findById(req.fields.id);
    if (article) {
      res.status(400).json("There has been a problem");
    } else {
      res.status(200).json("Article Deleted");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
