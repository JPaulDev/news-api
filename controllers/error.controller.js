exports.handle500Errors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({
    error: { msg: 'Oops something went wrong, please try again later.' },
  });
};

exports.handle404Errors = (req, res, next) => {
  res.status(404).send({ error: { msg: "Sorry can't find that!" } });
};
