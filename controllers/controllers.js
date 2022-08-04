const {
  selectTopics,
  selectArticleById,
  changeVotes,
  selectAllUsers,
  selectCommentsByAId,
  selectArticles,
  removeComment,
} = require("../models/models");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article: article[0] });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateVotes = (req, res, next) => {
  const { inc_votes: votes } = req.body;
  const { article_id: id } = req.params;
  const bodyKeys = Object.keys(req.body);
  if (bodyKeys.includes("inc_votes") && bodyKeys.length === 1) {
    changeVotes(votes, id)
      .then((article) => {
        res.status(200).send({ article: article });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(400).send({ msg: "bad request" });
  }
};

exports.getAllUsers = (req, res, next) => {
  selectAllUsers().then((users) => {
    res.status(200).send({ users: users });
  });
};

exports.getCommentsByAId = (req, res, next) => {
  const { article_id: id } = req.params;
  selectCommentsByAId(id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => next(err));
};
exports.getAllArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

exports.deleteComment = (req, res, next) => {
  //params stuff
  removeComment().then(() => {
    res.sendStatus(204);
  });
};
