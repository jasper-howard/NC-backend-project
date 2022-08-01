const db = require("../db/connection");

//try using asyn
exports.selectTopics = async () => {
  const { rows } = await db.query(`SELECT * FROM topics;`);
  return rows;
};
