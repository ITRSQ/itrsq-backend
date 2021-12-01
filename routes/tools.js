const express = require("express");
const router = express.Router();
const languages = require("../lang/errorMessages.json");
const axios = require("axios");

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
        response.data.is_valid_format
      ) {
        res.status(200).json("This email is valid !");
      } else {
        res.status(400).json(languages.en.invalidEmail);
      }
    } catch (error) {
      res.status(400).json(languages.en.invalidEmail);
    }
  } else {
    return res.status(400).json(languages.en.missingData);
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
        res.status(400).json(languages.en.invalidPhone);
      }
    } catch (error) {
      res.status(400).json(languages.en.invalidPhone);
    }
  } else {
    return res.status(400).json(languages.en.missingData);
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
        res.status(400).json(languages.en.invalidVat);
      }
    } catch (error) {
      res.status(400).json(languages.en.invalidVat);
    }
  } else {
    return res.status(400).json(languages.en.missingData);
  }
});

module.exports = router;
