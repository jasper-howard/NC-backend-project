const format = require("pg-format");
const db = require("../db/connection");

exports.checkIfExits = async (table, column, val) => {
  const query = format(`SELECT * FROM %I WHERE %I = $1`, table, column);
  const queryRes = await db.query(query, [val]);

  if (queryRes.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "not found" });
  }
};
