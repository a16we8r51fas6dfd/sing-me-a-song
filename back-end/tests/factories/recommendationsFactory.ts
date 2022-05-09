import { faker } from "@faker-js/faker";
import { CreateRecommendationData } from "../../src/services/recommendationsService.js";
import { prisma } from "../../src/database.js";

export function createRecommendationData() {
  const recommendation: CreateRecommendationData = {
    name: faker.lorem.words(4),
    youtubeLink: "https://www.youtube.com/watch?v=AySBPCkGyyY",
  };

  return recommendation;
}

export async function recommendationFactory() {
  await prisma.recommendation.create({
    data: createRecommendationData(),
  });
}

export async function recommendationsFactory() {
  await prisma.recommendation.createMany({
    data: [
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
      createRecommendationData(),
    ],
  });
}
