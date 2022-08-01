const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");

afterAll(() => {
  if (db.end) db.end();
}); // bye bye yellow

beforeEach(() => seed(testData));

describe("3. GET /api/topics", () => {
  test("should return status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should return array of obj with slug and and description properties", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const objOfCorrectShape = {
          slug: expect.any(String),
          description: expect.any(String),
        };
        // vvvv not sure if silly for larger queries??
        for (let i in body) {
          expect(body[i]).toMatchObject(objOfCorrectShape);
        }
      });
  });
});

describe("4. GET /api/articles/:article_id", () => {
  test("should return  status 200", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("should respond with an article obj with correct properties", () => {
    return request(app)
      .get("/api/articles/2")
      .then(({ body }) => {
        const objOfCorrectShape = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String), // is there a timestamp costructor i need to use?
          votes: expect.any(Number),
        };

        // console.log(body.article);
        expect(body.article[0]).toMatchObject(objOfCorrectShape);
      });
  });
  test("should respond with object specific to specified id", () => {
    return request(app)
      .get("/api/articles/1")
      .then(({ body }) => {
        const objCorrect = {
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        };

        expect(body.article[0]).toMatchObject(objCorrect);
      });
  });
  test("should respond with 400 invalid id when given invalid author_id", () => {
    return request(app)
      .get("/api/articles/help")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
  test("should respond with 404 not found when given valid but non existent author_id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});
