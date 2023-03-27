const express = require('express');
const { getAllTopics } = require('./controllers/topic.controller');
const { getArticleById } = require('./controllers/article.controller');
const {
  handlePSQL400Errors,
  handleCustomErrors,
  handle500Errors,
  handle404Errors,
} = require('./controllers/error.controller');

const app = express();

app.get('/api/topics', getAllTopics);
app.get('/api/articles/:article_id', getArticleById);

app.use(handlePSQL400Errors);
app.use(handleCustomErrors);
app.use(handle500Errors);
app.use('/*', handle404Errors);

module.exports = app;
