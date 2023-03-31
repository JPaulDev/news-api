const endpoints = require('../endpoints.json');

exports.getApiEndpoints = async (req, res) => {
  res.status(200).send(endpoints);
};
