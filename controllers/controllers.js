const { selectTopics, selectArticleById } = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send(topics); // change to {topics: topic}??
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
