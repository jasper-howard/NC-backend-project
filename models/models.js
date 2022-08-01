const db = require("../db/connection");

//try using asyn
exports.selectTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows;
};

exports.selectArticleById = async (id) => {
  try {
    const { rows: article } = await db.query(
      `SELECT *FROM articles 
             WHERE article_id = $1;`,
      [id]
    );
    if (article.length === 0) {
      return Promise.reject({ status: 404, msg: "not found" });
    }
    return article;
  } catch (error) {
    throw error;
  }
};
