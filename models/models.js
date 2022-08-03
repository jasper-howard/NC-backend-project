const db = require("../db/connection");
const { checkIfExits } = require("./utils");

exports.selectTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows;
};

exports.selectArticleById = async (id) => {
  const { rows: article } = await db.query(
    `SELECT * FROM articles 
             WHERE article_id = $1;`,
    [id]
  );
  if (article.length === 0) {
    return Promise.reject({ custom: "not found" });
  }
  return article;
};

exports.changeVotes = async (v, id) => {
  const { rows: article } = await db.query(
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
    [v, id]
  );

  if (!article.length) {
    await checkIfExits("articles", "article_id", id);
  }
  return article;
};
exports.selectAllUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users;`);
  return rows;
};

exports.selectArticles = async () => {
  const { rows } = await db.query(
    `SELECT CAST(COUNT(c.comment_id)as int) as comment_count, a.author,a.title,a.article_id, a.topic , a.created_at, a.votes 
  FROM articles AS a
  LEFT  JOIN comments as c ON c.article_id = a.article_id
  GROUP BY a.author,a.title,a.article_id, a.topic , a.created_at, a.votes
  ORDER BY a.created_at DESC;`
  );
  return rows;
};
