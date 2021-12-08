const express = require("express");
const router = express.Router();
const languages = require("../lang/errorMessages.json");
const axios = require("axios");
const validUrl = require("valid-url");
const shortid = require("shortid");
const Url = require("../models/Url");

router.post(`/tools/email`, async (req, res) => {
  console.log("Using Route : /tools/email");
  const { email } = req.fields;

  if (email !== undefined) {
    try {
      const response = await axios.get(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY_MAIL}&email=${email}`
      );
      if (
        response.data.deliverability === "DELIVERABLE" &&
        response.data.is_valid_format.value === true
      ) {
        res.status(200).json("This email is valid !");
      } else {
        res.status(500).json({ error: languages.en.invalidEmail });
      }
    } catch (error) {
      res.status(500).json({ error: languages.en.invalidEmail });
    }
  } else {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  }
});

router.post(`/tools/phone`, async (req, res) => {
  console.log("Using Route : /tools/phone");
  const { phone } = req.fields;

  if (phone !== undefined) {
    try {
      const response = await axios.get(
        `https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY_PHONE}&phone=${phone}`
      );
      if (response.data.valid === true) {
        res.status(200).json("This phone number is valid !");
      } else {
        res.status(400).json({ error: languages.en.invalidPhone });
      }
    } catch (error) {
      res.status(400).json({ error: languages.en.invalidPhone });
    }
  } else {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  }
});

router.post(`/tools/vat`, async (req, res) => {
  console.log("Using Route : /tools/vat");
  const { vat } = req.fields;

  if (vat !== undefined) {
    try {
      const response = await axios.get(
        `https://vat.abstractapi.com/v1/validate/?api_key=${process.env.ABSTRACT_API_KEY_VAT}&vat_number=${vat}`
      );
      if (response.data.valid === true) {
        res.status(200).json("This VAT number is valid !");
      } else {
        res.status(400).json({ error: languages.en.invalidVat });
      }
    } catch (error) {
      res.status(400).json({ error: languages.en.invalidVat });
    }
  } else {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  }
});

router.post(`/tools/url`, async (req, res) => {
  console.log(`Using route : /tools/url`);
  const { longUrl } = req.fields;
  console.log(longUrl);
  const baseUrl = "https://itrsq.herokuapp.com";

  const urlCode = shortid.generate();
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({
        longUrl,
      });

      if (url) {
        res.json(url);
      } else {
        const shortUrl = baseUrl + "/" + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode,
          date: new Date(),
        });
        await url.save();
        res.json(url);
      }
    } catch (err) {
      console.log(err);
      res.status(500).json("Server Error");
    }
  } else {
    res.status(401).json("Invalid longUrl");
  }
});

router.get("/:code", async (req, res) => {
  try {
    const url = await Url.findOne({
      urlCode: req.params.code,
    });
    if (url) {
      return res.redirect(url.longUrl);
    } else {
      return res.status(404).json("No URL Found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Server Error");
  }
});

module.exports = router;
