const db = require('../db/connection');

exports.selectAllUsers = async () => {
  const { rows: users } = await db.query('SELECT * FROM users;');
  return users;
};
