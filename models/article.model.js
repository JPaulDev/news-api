const db = require('../db/connection');

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
