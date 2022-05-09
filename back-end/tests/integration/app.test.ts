import { prisma } from "../../src/database.js";
import supertest from "supertest";
import app from "../../src/app.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";
import {
  recommendationFactory,
  recommendationsFactory,
} from "../factories/recommendationsFactory.js";

describe("integration tests", () => {
  afterAll(() => {
    clearRecommendations();
  });

  describe("POST  /recommendations", () => {
    it("should persist the recommendation given a valid body", async () => {
      const recommendation: CreateRecommendationData = {
        name: "rita payés - nunca vas a comprender",
        youtubeLink: "https://www.youtube.com/watch?v=AySBPCkGyyY",
      };

      const response = await supertest(app)
        .post("/recommendations")
        .send(recommendation);

      const createdRecommendation = await prisma.recommendation.findUnique({
        where: { name: recommendation.name },
      });

      expect(response.status).toEqual(201);
      expect(createdRecommendation).not.toBeNull();
    });
  });

  describe("POST /recommendations/:id/upvote", () => {
    it("should iincrease the song score given a valid recommendation id", async () => {
      const response = await supertest(app).post("/recommendations/1/upvote");

      const recommendation = await prisma.recommendation.findUnique({
        where: {
          id: 1,
        },
      });

      expect(response.status).toEqual(200);
      expect(recommendation.score).toEqual(1);
    });
  });

  describe("POST /recommendations/:id/downvote", () => {
    it("should decrease the song score given a valid recommendation id", async () => {
      const response = await supertest(app).post("/recommendations/1/downvote");

      const recommendation = await prisma.recommendation.findUnique({
        where: {
          id: 1,
        },
      });

      expect(response.status).toEqual(200);
      expect(recommendation.score).toEqual(0);
    });
  });

  describe("GET /recommendations", () => {
    afterAll(() => {
      clearRecommendations();
    });

    it("should return the last 10 recommendations", async () => {
      await recommendationsFactory();

      const recommendations = await supertest(app).get("/recommendations");

      expect(recommendations.body).toHaveLength(10);
      expect(recommendations.body[0].id).toEqual(21);
    });
  });

  describe("GET /recommendations/:id", () => {
    afterAll(() => {
      clearRecommendations();
    });

    it("should return the recommendation with id equals to params id", async () => {
      await recommendationFactory();

      const recommendation = await supertest(app).get("/recommendations/1");

      expect(recommendation.body.id).toEqual(1);
    });
  });

  describe("GET /recommendations/random", () => {
    beforeEach(() => {
      clearRecommendations();
    });

    it("should return a valid recommendation", async () => {
      await recommendationsFactory();

      const recommendation = await supertest(app).get(
        "/recommendations/random"
      );

      expect(recommendation.status).toEqual(200);
      expect(recommendation.body.id).not.toBe(null);
      expect(recommendation.body.name).not.toBe(null);
      expect(recommendation.body.youtubeLink).not.toBe(null);
      //expect(recommendation.body.score).toBeGreaterThan(10);
    });
  });

  describe("GET /recommendations/top/:amount", () => {
    afterAll(() => {
      clearRecommendations();
    });

    it("should return a list of recommendations ordered by score", async () => {
      await recommendationsFactory();

      await supertest(app).post("/recommendations/1/upvote");

      const recommendations = await supertest(app).get(
        "/recommendations/top/5"
      );

      expect(recommendations.status).toEqual(200);
      expect(recommendations.body.length).toEqual(5);
      expect(recommendations.body[0].score).toBeGreaterThan(
        recommendations.body[4].score
      );
    });
  });
});

async function clearRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
}
