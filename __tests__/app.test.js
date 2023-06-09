const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api', () => {
  it('200: should respond with a JSON representation of the available API endpoints', async () => {
    const { body } = await request(app).get('/api').expect(200);

    expect(endpoints).toEqual(body);
  });
});

describe('GET /api/topics', () => {
  it('200: should return a list of all three topic objects inside of an array', async () => {
    const { body } = await request(app).get('/api/topics').expect(200);
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

describe('GET /api/articles', () => {
  it('200: should return all twelve article objects including their comment counts inside of an array if no topic is specified', async () => {
    const { body } = await request(app).get('/api/articles').expect(200);
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
  it('200: should return all of the articles that match the specified topic query', async () => {
    const { body } = await request(app)
      .get('/api/articles?topic=mitch')
      .expect(200);
    const { articles } = body;

    expect(articles).toBeInstanceOf(Array);
    expect(articles.length).toBe(11);

    articles.forEach((article) => {
      expect(article).toMatchObject({
        topic: 'mitch',
        article_id: expect.any(Number),
        title: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: expect.any(Number),
      });
    });
  });
  it('200: should return an empty array if a topic exists but has no articles associated with it', async () => {
    const { body } = await request(app)
      .get('/api/articles?topic=paper')
      .expect(200);
    const { articles } = body;

    expect(articles).toEqual([]);
  });
  it('404: should return a not found error when an non-existant topic query is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles?topic=invalid-topic')
      .expect(404);
    const { error } = body;

    expect(error).toHaveProperty('msg', "Sorry we can't find that topic.");
  });
  it('200: should return all of the articles sorted by created_at in descending order if no order or sort_by query is provided', async () => {
    const { body } = await request(app).get('/api/articles').expect(200);
    const { articles } = body;

    expect(articles).toBeSortedBy('created_at', {
      descending: true,
    });
  });
  it('200: should return all of the the articles sorted by created_at in ascending order if no sort_by query is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles?order=asc')
      .expect(200);
    const { articles } = body;

    expect(articles).toBeSortedBy('created_at');
  });
  it('200: should return the articles sorted by the provided sort_by query in descending order by default', async () => {
    const sortByValues = [
      'article_id',
      'author',
      'votes',
      'created_at',
      'comment_count',
      'title',
      'topic',
    ];

    const promises = sortByValues.map(async (value) => {
      const { body } = await request(app)
        .get(`/api/articles?sort_by=${value}`)
        .expect(200);
      const { articles } = body;

      expect(articles).toBeSortedBy(value, {
        descending: true,
      });
    });

    await Promise.all(promises);
  });
  it('200: should return the articles sorted by the provided sort_by query in ascending order', async () => {
    const sortByValues = [
      'article_id',
      'author',
      'votes',
      'created_at',
      'comment_count',
      'title',
      'topic',
    ];

    const promises = sortByValues.map(async (value) => {
      const { body } = await request(app)
        .get(`/api/articles?sort_by=${value}&order=asc`)
        .expect(200);
      const { articles } = body;

      expect(articles).toBeSortedBy(value);
    });

    await Promise.all(promises);
  });
  it('400: should return a bad request when an invalid sort_by query is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles?sort_by=invalid-sort-by')
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
  it('400: should return a bad request when an invalid order query is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles?order=invalid-order')
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
});

describe('GET /api/articles/:article_id', () => {
  it('200: should return the correct article object corresponding to the provided id', async () => {
    const { body } = await request(app).get('/api/articles/5').expect(200);
    const { article } = body;

    expect(article).toMatchObject({
      article_id: 5,
      comment_count: 2,
      title: 'UNCOVERED: catspiracy to bring down democracy',
      topic: 'cats',
      author: 'rogersop',
      body: 'Bastet walks amongst us, and the cats are taking arms!',
      created_at: '2020-08-03T13:14:00.000Z',
      votes: 0,
      article_img_url:
        'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
    });
  });
  it('400: should return a bad request when an invalid article id is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles/invalid-id')
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
  it('404: should return a not found message when a non-existent article id is provided', async () => {
    const { body } = await request(app).get('/api/articles/999').expect(404);
    const { error } = body;

    expect(error).toHaveProperty(
      'msg',
      'Sorry, we could not find an article with that id.'
    );
  });
});

describe('PATCH /api/articles/:article_id', () => {
  it('200: should increment the vote count on the specified article by the given value and return the article object', async () => {
    const { body } = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 100 })
      .expect(200);
    const { article } = body;

    expect(article).toMatchObject({
      article_id: 1,
      votes: 200,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      article_img_url:
        'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
    });
  });
  it('200: should decrement the vote count on the specified article by the given value and return the article object', async () => {
    const { body } = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -100 })
      .expect(200);
    const { article } = body;

    expect(article).toMatchObject({
      article_id: 1,
      votes: 0,
      title: 'Living in the shadow of a great man',
      topic: 'mitch',
      author: 'butter_bridge',
      body: 'I find this existence challenging',
      created_at: '2020-07-09T20:11:00.000Z',
      article_img_url:
        'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
    });
  });
  it('400: should return a bad request when an invalid article id is provided', async () => {
    const { body } = await request(app)
      .patch('/api/articles/invalid-id')
      .send({ inc_votes: 100 })
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
  it('404: should return a not found message when a non-existent article id is provided', async () => {
    const { body } = await request(app)
      .patch('/api/articles/999')
      .send({ inc_votes: -100 })
      .expect(404);
    const { error } = body;

    expect(error).toHaveProperty(
      'msg',
      'Sorry, we could not find an article with that id.'
    );
  });
  it('400: should respond with a bad request error if the body is missing the required key/value', async () => {
    const { body } = await request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
  it('400: should respond with a bad request error if inc_votes value is not a valid integer', async () => {
    const { body } = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'not-a-valid-number' })
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  it('200: should return all eleven of the comment objects belonging to the article with an id of one inside of an array', async () => {
    const { body } = await request(app)
      .get('/api/articles/1/comments')
      .expect(200);
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
  it('200: should sort comments by created_at in descending order by default', async () => {
    const { body } = await request(app)
      .get('/api/articles/1/comments')
      .expect(200);
    const { comments } = body;

    expect(comments).toBeSortedBy('created_at', {
      descending: true,
    });
  });
  it('200: should respond with an empty array if the given article exists but has no comments', async () => {
    const { body } = await request(app)
      .get('/api/articles/4/comments')
      .expect(200);
    const { comments } = body;

    expect(comments).toEqual([]);
  });
  it('400: should return a bad request when an invalid article id is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles/invalid-id/comments')
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
  it('404: should return a not found message when a non-existent article id is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles/999/comments')
      .expect(404);
    const { error } = body;

    expect(error).toHaveProperty(
      'msg',
      'Sorry, we could not find an article with that id.'
    );
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  it('201: should post a new comment and then return a comment object upon being added successfully', async () => {
    const { body } = await request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'rogersop', body: 'test comment' })
      .expect(201);
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
  it('404: should return a not found error when an non-existant article id is provided', async () => {
    const { body } = await request(app)
      .post('/api/articles/999/comments')
      .send({ username: 'rogersop', body: 'test comment' })
      .expect(404);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Invalid key provided.');
  });
  it('404: should return a not found error when an non-existant username is provided', async () => {
    const { body } = await request(app)
      .post('/api/articles/1/comments')
      .send({ username: 'unknown-user', body: 'test comment' })
      .expect(404);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Invalid key provided.');
  });
  it('400: should return a bad request when an invalid article id is provided', async () => {
    const { body } = await request(app)
      .get('/api/articles/invalid-id/comments')
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
  it('400: should respond with a bad request error if the body is missing the required keys', async () => {
    const { body } = await request(app)
      .post('/api/articles/1/comments')
      .send({})
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  it('204: should delete the comment matching the provided comment id from the database', async () => {
    await request(app).delete('/api/comments/1').expect(204);
    const { rows } = await db.query('SELECT FROM comments WHERE comment_id=1;');

    expect(rows.length).toBe(0);
  });
  it('204: should respond with a no content status and an empty body upon successful deletion', async () => {
    const { body } = await request(app).delete('/api/comments/1').expect(204);

    expect(body).toEqual({});
  });
  it('400: should respond with a bad request error when an invalid comment id is provided', async () => {
    const { body } = await request(app)
      .delete('/api/comments/invalid-id')
      .expect(400);
    const { error } = body;

    expect(error).toHaveProperty('msg', 'Bad Request');
  });
  it('404: should respond with a not found error when a non-existent comment id is provided', async () => {
    const { body } = await request(app).delete('/api/comments/999').expect(404);
    const { error } = body;

    expect(error).toHaveProperty(
      'msg',
      'Sorry, we could not find a comment with that id.'
    );
  });
});

describe('GET /api/users', () => {
  it('200: should return a list of all four user objects inside of an array', async () => {
    const { body } = await request(app).get('/api/users').expect(200);
    const { users } = body;

    expect(users).toBeInstanceOf(Array);
    expect(users.length).toBe(4);

    users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      });
    });
  });
});

describe('/api/invalid-url', () => {
  it('404: should return an error message if an invalid url is provided', async () => {
    const { body } = await request(app).get('/api/invalid-url').expect(404);
    const { error } = body;

    expect(error).toHaveProperty('msg', "Sorry can't find that!");
  });
});
