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
