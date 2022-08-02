const db = require("../db/connection");
const { checkIfExits } = require("./utils");

//try using asyn
exports.selectTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows;
};

exports.selectArticleById = async (id) => {
  try {
    const { rows: article } = await db.query(
      `SELECT * FROM articles 
             WHERE article_id = $1;`,
      [id]
    );
    if (article.length === 0) {
      return Promise.reject({ custom: "not found" });
    }
    return article;
  } catch (error) {
    return Promise.reject(error);
  }
};

exports.changeVotes = async (v, id) => {
  try {
    const { rows: article } = await db.query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [v, id]
    );

    // should i invoke this helper in the controller with promise all?
    if (!article.length) {
      await checkIfExits("articles", "article_id", id);
    }
    return article;
  } catch (error) {
    return Promise.reject(error);
  }
};
