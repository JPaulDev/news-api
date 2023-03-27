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
