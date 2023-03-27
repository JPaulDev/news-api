const { selectAllTopics } = require('../models/topic.model');

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = await selectAllTopics();
    res.status(200).send({ topics });
  } catch (err) {
    next(err);
  }
};
