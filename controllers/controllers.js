const {
  selectTopics,
  selectArticleById,
  changeVotes,
  selectAllUsers,
  selectCommentsByAId,
  selectArticles,
  removeComment,
  addComment,
  selectEndpoints,
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
  const { sort_by } = req.query;
  const { order } = req.query;
  const { topic } = req.query;
  selectArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles: articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id: id } = req.params;

  removeComment(id)
    .then((result) => {
      if (result.length < 1) {
        return Promise.reject({ status: 404, msg: "not found" });
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      next(err);
    });
};
exports.postComments = (req, res, next) => {
  const { username: name } = req.body;
  const { body: body } = req.body;
  const { article_id: id } = req.params;
  const bodyKeys = Object.keys(req.body);

  if (bodyKeys.includes("username") && bodyKeys.includes("body")) {
    addComment(name, body, id)
      .then(([comment]) => {
        res.status(201).send({ comment: comment });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(400).send({ msg: "bad request" });
  }
};

exports.getEndpoints = (req, res, next) => {
  selectEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints: endpoints });
  });
};
