const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const {articleData, commentData, topicData, userData} = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");


afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed({articleData, commentData, topicData, userData});
});


describe("GET /api/(non existent end point)", () => {
    test("404", () => {
      return request(app)
        .get("/api/banana")
        .expect(404)
    });
})



describe("GET /api/topics", () => {
    test("200 sends an array of topics to the client", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string");
            expect(typeof topic.description).toBe("string");
          });
        });
    });
})

describe("GET /api/articles/:article_id", () => {
    test("200 sends article object that matches the parametric article_ID to the client", () => {
        const article_id = 5
        return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body }) => {
          expect(typeof body.article.title).toBe('string');
          expect(typeof body.article.topic).toBe('string');
          expect(typeof body.article.author).toBe('string');
          expect(typeof body.article.body).toBe('string');
          expect(typeof body.article.votes).toBe('number');
          expect(typeof body.article.created_at).toBe('string');
          expect(typeof body.article.article_img_url).toBe('string');
          expect(body.article.article_id).toBe(article_id);
        });
    });
    test("400 bad request, wrong datatype used in parametric article_id", () => {
        return request(app)
        .get(`/api/articles/banana`)
        .expect(400)
        .then(({ body }) => {
            console.log(body)
          expect(body.msg).toBe('Bad request.');
       
        });
    });
    test("404 not found, correct datatype used but nothing exists at that parametric article_id", () => {
        return request(app)
        .get(`/api/articles/15`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article does not exist.');
       
        });
    });
})

