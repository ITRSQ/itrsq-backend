// Packages
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const formidable = require("express-formidable");
app.use(formidable());
const cors = require("cors");
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT ,DELETE, OPTIONS");

  next();
});

// Database configuration
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
const mailsRoutes = require("./routes/mails");
app.use(mailsRoutes);
const testimonialsRoutes = require("./routes/testimonials");
app.use(testimonialsRoutes);
const tutorialsRoutes = require("./routes/tutorials");
app.use(tutorialsRoutes);
const articlesRoutes = require("./routes/articles");
app.use(articlesRoutes);
const usersRoutes = require("./routes/users");
app.use(usersRoutes);
const projectsRoutes = require("./routes/projects");
app.use(projectsRoutes);
const toolsRoutes = require("./routes/tools");
app.use(toolsRoutes);

app.all("*", function (req, res) {
  res.json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
