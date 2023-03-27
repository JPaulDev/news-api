const db = require('../db/connection');

exports.selectAllTopics = async () => {
  const { rows: topics } = await db.query('SELECT * FROM topics;');
  return topics;
};
