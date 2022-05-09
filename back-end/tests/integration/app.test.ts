import { prisma } from "../../src/database.js";
import supertest from "supertest";
import app from "../../src/app.js";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";

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
});

async function clearRecommendations() {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
}
