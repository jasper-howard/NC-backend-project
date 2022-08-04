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
      .get("/api/articles/1")
      .then(({ body }) => {
        const objOfCorrectShape = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
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
          comment_count: 11,
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

describe("6. GET /api/articles", () => {
  test("should return status 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("should return array of articles with comment count", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const objOfCorrectShape = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        };
        expect(body.articles.length).not.toBe(0);
        for (let i in body.articles) {
          expect(body.articles[i]).toMatchObject(objOfCorrectShape);
        }
      });
  });
  test("should return articles sorted by data desc", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe.only("11. GET /api/articles queries", () => {
  test("should return status 200", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body: { articles } }) => {
        const objOfCorrectShape = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number),
        };
        articles.forEach((article) => {
          expect(article).toMatchObject(objOfCorrectShape);
        });
      });
  });
  test("should return articles sorted by a given when queried ", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("should return articles sorted by ascending order when given ASC in query", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("should return articles of given topic when queried", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("should return articles when given complex query", () => {
    return request(app)
      .get("/api/articles?topic=cats&order=ASC&sort_by=title")
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("title", { descending: true });
        articles.forEach((x) => {
          expect(x.topic).toBe("cats");
        });
      });
  });
  test("should return status 200 and empty array when queried with topic that has not articles", () => {
    return request(app)
      .get("/api/articles?topic=paper&order=ASC&sort_by=title")
      .expect(200) // could be 404
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("should return status 400 bad request went sent malformed topic query", () => {
    return request(app)
      .get("/api/articles?topic=cat&order=ASC&sort_by=title")
      .expect(400) // could be 404
      .then(({ body }) => {
        expect(body.msg).toBe("bad query");
      });
  });
  test("should return status 400 bad request went sent malformed order query", () => {
    return request(app)
      .get("/api/articles?topic=cats&order=NOO&sort_by=title")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad query");
      });
  });
  test("should return status 400 bad request went sent malformed order query", () => {
    return request(app)
      .get("/api/articles?topic=cats&order=ASC&sort_by=itle")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad query");
      });
  });
});
