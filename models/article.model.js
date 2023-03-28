const db = require('../db/connection');

exports.selectAllArticles = async () => {
  const { rows: articles } = await db.query(`
    SELECT articles.*, COUNT(comment_id)::int AS comment_count FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
  `);

  return articles;
};

exports.selectArticleById = async (articleId) => {
  const { rows } = await db.query(
    'SELECT * FROM articles WHERE article_id=$1;',
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
