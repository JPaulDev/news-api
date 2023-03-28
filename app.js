const express = require('express');
const { getAllTopics } = require('./controllers/topic.controller');
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postArticleComment,
} = require('./controllers/article.controller');
const { deleteCommentById } = require('./controllers/comment.controller');
const {
  handlePSQL400Errors,
  handlePSQL422Errors,
  handleCustomErrors,
  handle500Errors,
  handle404Errors,
} = require('./controllers/error.controller');

const app = express();

app.use(express.json());

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postArticleComment);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.use(handlePSQL400Errors);
app.use(handlePSQL422Errors);
app.use(handleCustomErrors);
app.use(handle500Errors);
app.use('/*', handle404Errors);

module.exports = app;
