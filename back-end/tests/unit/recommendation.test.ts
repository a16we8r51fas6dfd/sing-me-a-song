import {
  CreateRecommendationData,
  recommendationService,
} from "../../src/services/recommendationsService.js";
import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { conflictError } from "../../src/utils/errorUtils";
import { Recommendation } from "@prisma/client";

describe("recommendation service unit tests", () => {
  it("should throw a conflict error given a duplicate recommendation name", async () => {
    const recommendation: CreateRecommendationData = {
      name: "lucia fumero - quisiera ser um robot",
      youtubeLink: "https://www.youtube.com/watch?v=K5h-2-IW348",
    };

    jest.spyOn(recommendationRepository, "findByName").mockResolvedValue({
      id: 1,
      score: 0,
      ...recommendation,
    });

    expect(recommendationService.insert(recommendation)).rejects.toEqual(
      conflictError("Recommendations names must be unique")
    );
  });

  it("should remove recommendation whith score below -5", async () => {
    const recommendation: Recommendation = {
      id: 1,
      name: "lucia fumero - quisiera ser um robot 2",
      youtubeLink: "https://www.youtube.com/watch?v=K5h-2-IW348",
      score: -6,
    };

    jest
      .spyOn(recommendationRepository, "find")
      .mockResolvedValue(recommendation);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockResolvedValue(recommendation);

    const removeRecommendation = jest
      .spyOn(recommendationRepository, "remove")
      .mockResolvedValue(null);

    await recommendationService.downvote(recommendation.id);

    expect(removeRecommendation).toBeCalled();
  });
});
