const express = require("express");
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
} = require("./controllers/controllers");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getAllUsers);

app.patch("/api/articles/:article_id", updateVotes);

app.get("/api/articles/:article_id/comments", getCommentsByAId);

app.get("/api/articles", getAllArticles);

app.delete("/api/comments/:comment_id", deleteComment);
app.post("/api/articles/:article_id/comments", postComments);

app.get("/api/face", (req, res, next) => {
  res.status(200).send(`     _.-'''''-._ \n
.'  _     _  '.\n
/   (o)   (o)   \\ \n
|                 | \n
|  \\           /  | \n 
\\  '.       .'  / \n
'.  \`'---'\`  .' \n
jgs   '-._____.-'`);
});

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
  console.log("in custom error bit");
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "endpoint not found" });
});

module.exports = app;
