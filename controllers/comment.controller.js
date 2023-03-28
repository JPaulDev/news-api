const { removeCommentById } = require('../models/comment.model');

exports.deleteCommentById = async (req, res, next) => {
  const { comment_id } = req.params;

  try {
    await removeCommentById(comment_id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
