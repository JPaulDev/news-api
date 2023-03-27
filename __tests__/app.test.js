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

describe('/api/topics', () => {
  it('200: should return a list of all three topics objects inside of an array', () => {
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

describe('/api/articles', () => {
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
  it('400: should return a bad request when an invalid article_id is provided', () => {
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
