const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe('GET /api/topics', () => {
  it('200: should return a list of all three topic objects inside of an array', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;

        expect(topics).toBeInstanceOf(Array);
        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe('GET /api/articles', () => {
  it('200: should return a list of all twelve article objects including their comment counts inside of an array', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        let totalComments = 0;

        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBe(12);

        articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
          totalComments += article.comment_count;
        });

        expect(totalComments).toBe(18);
      });
  });
  it('200: should sort articles by created_at in descending order by default', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;

        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});

describe('GET /api/articles/:article_id', () => {
  it('200: should return the correct article object corresponding to the provided id', () => {
    return request(app)
      .get('/api/articles/5')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;

        expect(article).toMatchObject({
          article_id: 5,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  it('400: should return a bad request when an invalid article id is provided', () => {
    return request(app)
      .get('/api/articles/invalid-id')
      .expect(400)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty('msg', 'Bad Request');
      });
  });
  it('404: should return a not found message when a non-existent article id is provided', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty(
          'msg',
          'Sorry, we could not find an article with that id.'
        );
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  it('200: should return all eleven of the comment objects belonging to the article with an id of one inside of an array', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toBeInstanceOf(Array);
        expect(comments.length).toBe(11);

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            body: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  it('200: should sort comments by created_at in descending order by default', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
  it('200: should respond with an empty array if the given article exists but has no comments', () => {
    return request(app)
      .get('/api/articles/4/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;

        expect(comments).toEqual([]);
      });
  });
  it('400: should return a bad request when an invalid article id is provided', () => {
    return request(app)
      .get('/api/articles/invalid-id/comments')
      .expect(400)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty('msg', 'Bad Request');
      });
  });
  it('404: should return a not found message when a non-existent article id is provided', () => {
    return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty(
          'msg',
          'Sorry, we could not find an article with that id.'
        );
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  it('201: should post a new comment and then return a comment object upon being added successfully', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'rogersop', body: 'test comment' })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;

        expect(comment).toMatchObject({
          article_id: 1,
          author: 'rogersop',
          body: 'test comment',
          votes: 0,
          comment_id: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  it('422: should return a unprocessable content error when an non-existant article id is provided', () => {
    return request(app)
      .post('/api/articles/999/comments')
      .send({ username: 'rogersop', body: 'test comment' })
      .expect(422)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty('msg', 'Unprocessable Content');
      });
  });
  it('422: should return a unprocessable content error when an non-existant username is provided', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'unknown-user', body: 'test comment' })
      .expect(422)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty('msg', 'Unprocessable Content');
      });
  });
  it('400: should return a bad request when an invalid article id is provided', () => {
    return request(app)
      .get('/api/articles/invalid-id/comments')
      .expect(400)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty('msg', 'Bad Request');
      });
  });
  it('400: should respond with a bad request error if the body is missing the required keys', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({})
      .expect(400)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty('msg', 'Bad Request');
      });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  it('204: should delete the comment matching the provided comment id from the database', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then(() => {
        return db.query('SELECT FROM comments WHERE comment_id=1;');
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });
  it('204: should respond with a no content status and an empty body upon successful deletion', () => {
    return request(app)
      .delete('/api/comments/1')
      .expect(204)
      .then(({ body }) => {
        expect(body).toEqual({});
      });
  });
  it('400: should respond with a bad request error when an invalid comment id is provided', () => {
    return request(app)
      .delete('/api/comments/invalid-id')
      .expect(400)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty('msg', 'Bad Request');
      });
  });
  it('404: should respond with a not found error when a non-existent comment id is provided', () => {
    return request(app)
      .delete('/api/comments/999')
      .expect(404)
      .then(({ body }) => {
        const { error } = body;

        expect(error).toHaveProperty(
          'msg',
          'Sorry, we could not find a comment with that id.'
        );
      });
  });
});

describe('/api/invalid-url', () => {
  it('404: should return an error message if an invalid url is provided', () => {
    return request(app)
      .get('/api/invalid-url')
      .expect(404)
      .then(({ body }) => {
        const { error } = body;
        expect(error).toHaveProperty('msg', "Sorry can't find that!");
      });
  });
});
