const express = require("express");
const router = express.Router();
const Testimonial = require("../models/Testimonial");

router.post("/testimonial/create", async (req, res) => {
  console.log("Using Route : /testimonial/create");
  try {
    const { author, authorPosition, picture, testimonial } = req.fields;

    const newTestimonial = new Testimonial({
      author,
      authorPosition,
      picture,
      testimonial,
    });
    newTestimonial.save();
    res.status(200).json({
      _id: newTestimonial._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
