const {
  selectArticleById,
  selectAllArticles,
  updateArticleVotesById,
} = require('../models/article.model');
const {
  selectCommentsByArticleId,
  insertArticleComment,
} = require('../models/comment.model');

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

exports.postArticleComment = async (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  try {
    const comment = await insertArticleComment(article_id, username, body);
    res.status(201).send({ comment });
  } catch (err) {
    next(err);
  }
};

exports.patchUpdateArticleVotes = async (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const article = await updateArticleVotesById(article_id, inc_votes);
    res.status(200).send({ article });
  } catch (err) {
    next(err);
  }
};
