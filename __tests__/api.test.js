const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");
const db = require("../db/connection");
const { checkIfExits } = require("../models/utils");

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
  test("should respond with object when obj with 0 comments if article has 0 comments", () => {
    return request(app)
      .get("/api/articles/2")
      .then(({ body }) => {
        const objCorrect = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: 2,
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: 0,
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

describe("9. GET /api/articles/:article_id/comments", () => {
  test("should return status 200 ", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("should return array of comments in specified shape", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body: comments }) => {
        const objOfCorrectShape = {
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        };
        for (let comment of comments) {
          expect(comment).toMatchObject(objOfCorrectShape);
        }
      });
  });

  test("should return specific comments from a specified article", () => {
    return request(app)
      .get("/api/articles/6/comments")
      .then(({ body: comments }) => {
        const actualComment = {
          comment_id: 16,
          votes: 1,
          created_at: "2020-10-11T15:23:00.000Z",
          author: "butter_bridge",
          body: "This is a bad article name",
        };
        expect(comments).toEqual([actualComment]);
      });
  });
  test("should return empty array when article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: comments }) => {
        expect(comments).toEqual([]);
      });
  });
  test("should respond with 400 invalid id when given invalid article_id", () => {
    return request(app)
      .get("/api/articles/help/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });
  test("should respond with 404 not found when given valid but non existent article_id", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
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
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("12. DELETE /api/comments/:comment_id", () => {
  test("should return status 204 ", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should return status 404 when comment doesn't exist ", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("not found");
      });
  });
  test("should return status 400 when given invalid comment id ", () => {
    return request(app)
      .delete("/api/comments/help")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid id");
      });
  });
});

describe("10. POST /api/articles/:article_id/comments", () => {
  test("should return status 201", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: "wow" })
      .expect(201);
  });
  test("should return posted comment", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send({ username: "butter_bridge", body: "wow" })
      .then(({ body: { comment } }) => {
        const expected = {
          comment_id: 19,
          body: "wow",
          article_id: 2,
          author: "butter_bridge",
          votes: 0,
          created_at: expect.any(String),
        };
        expect(comment).toEqual(expected);
      });
  });

  test("should respond with 400 invalid id when given invalid article_id", () => {
    return request(app)
      .post("/api/articles/help/comments")
      .send({ username: "butter_bridge", body: "wow" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id");
      });
  });

  test("should respond with 400 not acceptable when sent malformed body - wrong field ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ usernam: "butter_bridge", body: "wow" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with 400 not acceptable when sent malformed body - wrong input type", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ usernam: "butter_bridge", body: 999 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with 404 not found when given valid but non existent author_id", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .send({ username: "butter_bridge", body: "wow" })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("11. GET /api/articles queries", () => {
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
  test("should return articles sorted by a given column when queried ", () => {
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
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("should return status 200 and empty array when queried with topic that has not articles", () => {
    return request(app)
      .get("/api/articles?topic=paper&order=ASC&sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toEqual([]);
      });
  });
  test("should return status 400 bad request went sent malformed topic query", () => {
    return request(app)
      .get("/api/articles?topic=cat&order=ASC&sort_by=title")
      .expect(400)
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

describe("GET /api", () => {
  test("status 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("should return contents of endpoints.json file as string", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        const actualEndpoints = {
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },

          "GET /api/users": {
            description: "serves an array of all users",
            queries: [],
            exampleResponse: {
              users: [
                {
                  username: "butter_bridge",
                  name: "jonny",
                  avatar_url:
                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
                },
              ],
            },
          },
          "POST /api/users": {
            description: "post a user and serves the new user",
            queries: [],
            "example body": { username: "butter_bridge", name: "dave" },
            exampleResponse: {
              user: {
                username: "butter_bridge",
                name: "dave",
                avatar_url: null,
              },
            },
          },

          "GET /api/articles": {
            description: "serves an array of all topics",
            queries: ["topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: "2020-07-09T20:11:00.000Z",
                },
              ],
            },
          },
          "GET /api/articles/:article_id": {
            description: "serves an article with specified article_id ",
            queries: [],
            exampleResponse: {
              article: {
                comment_count: 11,
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 100,
              },
            },
          },
          "GET /api/articles/:article_id/comments": {
            description:
              "serves an array of the comment for a specific article by article_id",
            queries: [],
            exampleResponse: {
              comments: [
                {
                  comment_id: 2,
                  votes: 14,
                  created_at: "2020-10-31T03:03:00.000Z",
                  body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                  author: "butter_bridge",
                },
              ],
            },
          },
          "PATCH /api/articles/:article_id": {
            description:
              "increments votes property for a given article by id and serves the updated article",
            queries: [],
            "example body": { inc_votes: 50 },
            exampleResponse: {
              article: {
                comment_count: 11,
                author: "butter_bridge",
                title: "Living in the shadow of a great man",
                article_id: 1,
                body: "I find this existence challenging",
                topic: "mitch",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 150,
              },
            },
          },
          "POST /api/articles/:article_id/comments": {
            description:
              "post a comment to an article of given article_id and serves the new comment",
            queries: [],
            "example body": { username: "butter_bridge", body: "comment" },
            exampleResponse: {
              comment: {
                comment_id: 19,
                body: "comment",
                article_id: 2,
                author: "butter_bridge",
                votes: 0,
                created_at: "2022-08-05T08:40:49.325Z",
              },
            },
          },

          "DELETE /api/comments/:comment_id": {
            description: "deletes a comment given comment_id",
            queries: [],
          },
        };
        expect(endpoints).toMatchObject(actualEndpoints);
      });
  });
});

describe("13. POST /api/users", () => {
  test("should return status 201", () => {
    return request(app)
      .post("/api/users")
      .send({ username: "mighty_dave", name: "dave" })
      .expect(201);
  });
  test("should return posted user", () => {
    return request(app)
      .post("/api/users")
      .send({ username: "mighty_dave", name: "dave" })
      .then(({ body: { user } }) => {
        const expected = {
          username: "mighty_dave",
          name: "dave",
          avatar_url: null,
        };
        expect(user).toEqual(expected);
      });
  });

  test("should respond with 400 not acceptable when sent malformed body - wrong field ", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ usernam: "butter_bridge", name: "wow" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("should respond with 400 not acceptable when sent malformed body - wrong input type", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", name: 999 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
