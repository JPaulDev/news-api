exports.handlePSQL400Errors = (err, req, res, next) => {
  const codes = ['22P02', '42703', '23502'];

  if (codes.includes(err.code)) {
    res.status(400).send({ error: { msg: 'Bad Request' } });
  } else {
    next(err);
  }
};

exports.handlePSQL422Errors = (err, req, res, next) => {
  const codes = ['23503'];

  if (codes.includes(err.code)) {
    res.status(404).send({ error: { msg: 'Invalid key provided.' } });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ error: { msg: err.msg } });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({
    error: { msg: 'Oops something went wrong, please try again later.' },
  });
};

exports.handle404Errors = (req, res, next) => {
  res.status(404).send({ error: { msg: "Sorry can't find that!" } });
};
