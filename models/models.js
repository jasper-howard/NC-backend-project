const db = require("../db/connection");
const { checkIfExits } = require("./utils");

exports.selectTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows;
};

exports.selectArticleById = async (id) => {
  const { rows: article } = await db.query(
    // not nice
    `SELECT CAST(COUNT(c.comment_id)as int)  as comment_count, a.author,a.title,a.article_id, a.body, a.topic , a.created_at, a.votes 
    FROM articles AS a
    LEFT  JOIN comments as c ON c.article_id = a.article_id
    WHERE a.article_id = $1  
    GROUP BY a.author,a.title,a.article_id, a.body, a.topic , a.created_at, a.votes;`,
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

exports.selectArticles = async (
  sort_by = "created_at",
  order = "DESC",
  topic = "*"
) => {
  const niceSortBys = [
    "article_id",
    "author",
    "topic",
    "comment_count",
    "created_at",
    "votes",
    "title",
  ];
  const niceOrder = ["DESC", "ASC"];
  const niceTopics = ["mitch", "cats", "paper", "*"]; ///will have to be changed as topic added
  if (
    !niceSortBys.includes(sort_by) ||
    !niceOrder.includes(order) ||
    !niceTopics.includes(topic)
  ) {
    return Promise.reject({ custom: "bad query" });
  } else {
    let where = `WHERE a.topic = '${topic}'`;
    if (topic === "*") {
      where = `WHERE a.topic = ANY (SELECT topic FROM topics)`;
    }

    const { rows } = await db.query(
      `SELECT CAST(COUNT(c.comment_id)as int) as comment_count, a.author,a.title,a.article_id, a.topic , a.created_at, a.votes 
    FROM articles AS a
    LEFT  JOIN comments as c ON c.article_id = a.article_id
    ${where}
    GROUP BY a.article_id 
    ORDER BY a.${sort_by} ${order};`
    );
    return rows;
  }
};
