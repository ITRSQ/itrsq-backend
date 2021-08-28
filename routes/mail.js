const express = require("express");
const router = express.Router();
const languages = require("../lang/errorMessages.json");

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mailgun = require("mailgun-js")({ apiKey: API_KEY, domain: DOMAIN });

router.post(`/mail/contact`, async (req, res) => {
  const isValidMail = (mail) => {
    const mailformat =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return mail.match(mailformat) ? true : false;
  };
  console.log("Using Route : /mail/contact");
  const { from, subject, orderRef, firstName, lastName, text } = req.fields;

  if (
    from === "" ||
    subject === "" ||
    firstName === "" ||
    lastName === "" ||
    text === ""
  ) {
    return res.status(400).json({
      error: languages.en.missingData,
    });
  } else if (!isValidMail(from)) {
    return res.status(400).json({
      error: languages.en.invalidEmail,
    });
  } else {
    try {
      const data = {
        from: `${firstName} ${lastName} <${from}>`,
        to: "ITRSQ <support@itrsq.com>",
        subject: `${orderRef && orderRef}  ${subject}`,
        text: text,
      };
      await mailgun.messages().send(data, (error, body) => {
        if (body.message === "Queued. Thank you.") {
          res.status(200).json("Email sent!");
          console.log(body);
        } else {
          res.status(400).json({ error: error.message });
        }
      });
      res.json;
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
});

module.exports = router;
