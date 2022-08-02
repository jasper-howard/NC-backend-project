const {
  selectTopics,
  selectArticleById,
  changeVotes,
} = require("../models/models");

exports.log = (arg) => console.log(arg);

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics }); // change to {topics: topic}??
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (req, res, next) => {
  const { inc_votes: votes } = req.body;
  const { article_id: id } = req.params;
  const b = Object.keys(req.body);
  if (b.includes("inc_votes") && b.length === 1) {
    changeVotes(votes, id)
      .then((article) => {
        res.status(200).send({ article: article });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(406).send({ msg: "bad request" });
  }
};
