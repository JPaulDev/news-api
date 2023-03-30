const db = require('../db/connection');
const format = require('pg-format');

exports.selectAllArticles = async (
  topic,
  sort_by = 'created_at',
  order = 'desc'
) => {
  // Check that the supplied order is valid.
  if (!['asc', 'desc'].includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad Request' });
  }

  let queryString = `
    SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  if (topic) {
    // If a topic is provided we must first check if it exists and return
    // a custom error if it does not.
    const topicData = await db.query('SELECT * FROM topics WHERE slug=$1;', [
      topic,
    ]);

    if (!topicData.rowCount) {
      return Promise.reject({
        status: 404,
        msg: "Sorry we can't find that topic.",
      });
    }

    queryString += format("WHERE articles.topic = '%s'", topic);
  }

  queryString += format(
    'GROUP BY articles.article_id ORDER BY %I %s;',
    sort_by,
    order
  );

  const { rows: articles } = await db.query(queryString);

  return articles;
};

exports.selectArticleById = async (articleId) => {
  const { rows } = await db.query(
    `
      SELECT a.*,
        (SELECT COUNT(*)::int FROM comments c WHERE c.article_id = a.article_id) AS comment_count
      FROM articles a
      WHERE a.article_id=$1;
    `,
    [articleId]
  );
  const [article] = rows;

  if (!article) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry, we could not find an article with that id.',
    });
  }

  return article;
};

exports.updateArticleVotesById = async (articleId, votes) => {
  const { rows } = await db.query(
    'UPDATE articles SET votes=votes+$2 WHERE article_id=$1 RETURNING *;',
    [articleId, votes]
  );
  const [article] = rows;

  if (!article) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry, we could not find an article with that id.',
    });
  }

  return article;
};
