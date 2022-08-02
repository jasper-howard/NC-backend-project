const express = require("express");
const {
  getTopics,
  getArticleById,
  updateVotes,
} = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateVotes);

/////////

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.custom === "not found") {
    res.status(404).send({ msg: "not found" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log("in custom error bit");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "endpoint not found" });
});

module.exports = app;
