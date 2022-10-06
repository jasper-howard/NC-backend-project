const express = require("express");
const cors = require("cors");
const {
  getTopics,
  getArticleById,
  updateVotes,
  getAllUsers,
  getCommentsByAId,
  getAllArticles,
  deleteComment,
  postComments,
  getEndpoints,
  postUser,
} = require("./controllers/controllers");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getAllUsers);

app.patch("/api/articles/:article_id", updateVotes);

app.get("/api/articles/:article_id/comments", getCommentsByAId);

app.get("/api/articles", getAllArticles);

app.delete("/api/comments/:comment_id", deleteComment);

app.post("/api/articles/:article_id/comments", postComments);

app.post("/api/users", postUser);

/////////

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid id" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "42601" || err.custom === "bad query") {
    res.status(400).send({ msg: "bad query" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.custom === "not found") {
    res.status(404).send({ msg: "not found" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log("custom error");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "endpoint not found" });
});

module.exports = app;
