// Packages
require("dotenv").config();
const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "https://itrsq.netlify.app");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE, OPTIONS");

  next();
});

// Routes
const mailRoutes = require("./routes/mail");
app.use(mailRoutes);

app.all("*", function (req, res) {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
