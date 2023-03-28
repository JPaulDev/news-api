const {
  selectArticleById,
  selectAllArticles,
} = require('../models/article.model');
const { selectCommentsByArticleId } = require('../models/comment.model');

exports.getAllArticles = async (req, res, next) => {
  try {
    const articles = await selectAllArticles();
    res.status(200).send({ articles });
  } catch (err) {
    next(err);
  }
};

exports.getArticleById = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const article = await selectArticleById(article_id);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};

exports.getCommentsByArticleId = async (req, res, next) => {
  const { article_id } = req.params;

  try {
    const comments = await selectCommentsByArticleId(article_id);
    res.status(200).send({ comments });
  } catch (err) {
    next(err);
  }
};
