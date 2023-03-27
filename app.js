const express = require('express');
const { getAllTopics } = require('./controllers/topic.controller');
const {
  handle500Errors,
  handle404Errors,
} = require('./controllers/error.controller');

const app = express();

app.get('/api/topics', getAllTopics);

app.use(handle500Errors);
app.use('/*', handle404Errors);

module.exports = app;
