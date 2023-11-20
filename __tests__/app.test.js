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