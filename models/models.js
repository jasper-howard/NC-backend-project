const db = require("../db/connection");
const { checkIfExits } = require("./utils");
const fs = require("fs/promises");

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
    GROUP BY a.article_id;`,
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
  let aliasFix = "a.";
  const niceSortBys = [
    "article_id",
    "author",
    "topic",
    "comment_count",
    "created_at",
    "votes",
    "title",
  ];

  const topics = await this.selectTopics();
  const niceTopics = topics.map((element) => element.slug);
  niceTopics.push("*");
  const niceOrder = ["DESC", "ASC"];
  if (
    !niceSortBys.includes(sort_by) ||
    !niceOrder.includes(order) ||
    !niceTopics.includes(topic)
  ) {
    return Promise.reject({ status: 400, msg: "bad query" });
  } else {
    let where = `WHERE a.topic = '${topic}'`;
    if (topic === "*") {
      where = `WHERE a.topic = ANY (SELECT topic FROM topics)`;
    }
    if (sort_by === "comment_count") {
      aliasFix = "";
    }
    const { rows } = await db.query(
      `SELECT CAST(COUNT(c.comment_id)as int) as comment_count,a.body, a.author,a.title,a.article_id, a.topic , a.created_at, a.votes
    FROM articles AS a
    LEFT  JOIN comments as c ON c.article_id = a.article_id
    ${where}
    GROUP BY a.article_id 
    ORDER BY ${aliasFix}${sort_by} ${order};`
    );
    return rows;
  }
};

exports.selectCommentsByAId = async (id) => {
  await checkIfExits("articles", "article_id", id);

  const { rows } = await db.query(
    `SELECT comment_id, votes, created_at, body, author
    FROM comments 
    WHERE article_id = $1`,
    [id]
  );

  return rows;
};

exports.removeComment = async (id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [id]
  );
  return rows;
};
exports.addComment = async (name, body, id) => {
  await checkIfExits("articles", "article_id", id);

  const { rows } = await db.query(
    `
    INSERT INTO comments
    (author, body, article_id)
    VALUES 
    ($1,$2, $3) RETURNING *;`,
    [name, body, id]
  );

  return rows;
};

exports.selectEndpoints = async () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`)
    .then((data) => JSON.parse(data));
};

exports.addUser = async (username, name) => {
  const { rows } = await db.query(
    `
  INSERT INTO users
  (username, name)
  VALUES
  ($1,$2) RETURNING *;`,
    [username, name]
  );
  return rows;
};
