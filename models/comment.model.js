const db = require('../db/connection');

exports.selectCommentsByArticleId = async (articleId) => {
  const queries = [
    'SELECT * FROM articles WHERE article_id=$1;',
    'SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC;',
  ];

  const [articleData, commentsData] = await Promise.all(
    queries.map((queryString) => {
      return db.query(queryString, [articleId]);
    })
  );

  // If the article doesn't exist respond with a 404 status, otherwise respond
  // with an empty array if the article exists but has no comments on it.
  if (!articleData.rowCount) {
    return Promise.reject({
      status: 404,
      msg: 'Sorry, we could not find an article with that id.',
    });
  }

  const { rows: comments } = commentsData;

  return comments;
};

exports.insertArticleComment = async (articleId, username, body) => {
  const { rows } = await db.query(
    `
      INSERT INTO comments (article_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
    [articleId, username, body]
  );
  const [comment] = rows;

  return comment;
};
