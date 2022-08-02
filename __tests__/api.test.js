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
        for (let i in body.topics) {
          expect(body.topics[i]).toMatchObject(objOfCorrectShape);
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
          created_at: expect.any(String),
          votes: expect.any(Number),
        };

        expect(body.article).toMatchObject(objOfCorrectShape);
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

        expect(body.article).toMatchObject(objCorrect);
      });
  });
  test("should respond with 400 invalid id when given invalid article_id", () => {
    return request(app)
      .get("/api/articles/help")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
  test("should respond with 404 not found when given valid but non existent article_id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("5. PATCH /api/articles/:article_id", () => {
  test("should return status 200 ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200);
  });
  test("should return updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50 })
      .then(({ body }) => {
        const expectedArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 150,
        };
        expect(body.article[0]).toEqual(expectedArticle);
      });
  });
  test("should respond with 400 invalid id when given invalid author_id", () => {
    return request(app)
      .patch("/api/articles/help")
      .send({ inc_votes: 50 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
  test("should respond with 400 not acceptable when sent malformed body - too many fields ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50, bad: "string" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with 400 not acceptable when sent malformed body - wrong field ", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_otes: 50 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with 404 not found when given valid but non existent author_id", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 50 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("6. GET /api/users", () => {
  test("should return status 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("should return array of obj with username, name and avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const objOfCorrectShape = {
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        };

        expect(body.users.length).not.toBe(0);
        for (let i in body.users) {
          expect(body.users[i]).toMatchObject(objOfCorrectShape);
        }
      });
  });
});
