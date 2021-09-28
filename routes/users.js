const express = require("express");
const formidable = require("express-formidable");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const isAuthenticated = require("../middlewares/isAuthenticated");
const languages = require("../lang/errorMessages.json");
const User = require("../models/User");
const axios = require("axios");

const isValidMail = (mail) => {
  const mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return mail.match(mailformat) ? true : false;
};

router.post("/users/signup", formidable(), async (req, res) => {
  const { email, password, confirmPassword } = req.fields;

  const salt = uid2(16);
  const hash = SHA256(password + salt).toString(encBase64);
  const token = uid2(32);

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      error: languages.en.incomplete,
    });
  } else if (password !== confirmPassword) {
    return res.status(400).json({
      error: languages.en.confirmPassword,
    });
  } else {
    const isUser = await User.findOne({ email });
    if (isUser) {
      return res.status(400).json({
        error: languages.en.emailTaken,
      });
    } else {
      const response = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
      );
      if (
        response.data.deliverability === "DELIVERABLE" &&
        response.data.is_valid_format
      ) {
        try {
          const newUser = await new User({
            email,
            token,
            hash,
            salt,
          });

          await newUser.save();
          res.status(200).json({
            id: newUser._id,
            token: newUser.token,
          });
        } catch (error) {
          res.json({ error: error.message });
        }
      } else {
        res.status(400).json({ error: languages.en.invalidEmail });
      }
    }
  }
});

router.post("/users/login", formidable(), async (req, res) => {
  const { email, password } = req.fields;

  if (!email || !password) {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = {
      salt: null,
      password: null,
    };
    return res.status(400).json({ error: languages.en.invalidEmail });
  }
  const hash = SHA256(password + user.salt).toString(encBase64);
  if (hash === user.hash) {
    return res.status(200).json({
      _id: user._id,
      token: user.token,
      type: user.type,
    });
  } else {
    return res.status(401).json({
      error: languages.en.wrongInput,
    });
  }
});

router.post("/user/account", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.fields._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: "Unknown Error" });
  }
});

router.post("/user/modify/email", isAuthenticated, async (req, res) => {
  const { email, _id } = req.fields;
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({
      error: languages.en.emailTaken,
    });
  }
  try {
    const response = await axios.get(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );
    if (
      response.data.deliverability === "DELIVERABLE" &&
      response.data.is_valid_format
    ) {
      try {
        const user = await User.findById(_id);
        user.email = email;
        await user.save();
        res.status(200).json("Email Changed");
      } catch (error) {
        res.json({ error: error.message });
      }
    } else {
      res.status(400).json({ error: languages.en.invalidEmail });
    }
  } catch (error) {
    res.status(400).json(error);
  }
});

router.post("/user/modify/password", isAuthenticated, async (req, res) => {
  const { password, confirmPassword, _id } = req.fields;
  const salt = uid2(16);
  const hash = SHA256(password + salt).toString(encBase64);
  const token = uid2(32);
  if (!password || !confirmPassword) {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  } else if (password !== confirmPassword) {
    return res.status(400).json({
      error: languages.en.confirmPassword,
    });
  }
  try {
    const user = await User.findById(_id);
    user.token = token;
    user.hash = hash;
    user.salt = salt;
    await user.save();
    res.status(200).json("Password Changed");
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = router;
