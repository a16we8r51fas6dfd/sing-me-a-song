/// <reference types="cypress" />

const recommendation = {
  name: "rita payés",
  youtubeLink: "https://www.youtube.com/watch?v=C8wpfQ5pdfo",
};

describe("post recommendation and recommendation flow", () => {
  it("should create an recommendation", () => {
    cy.visit("http://localhost:3000");

    cy.get("#name").type(recommendation.name);
    cy.get("#url").type(recommendation.youtubeLink);

    cy.intercept("POST", "recommendations").as("postRecommendation");

    cy.get("#submit").click();

    cy.wait("@postRecommendation");
    cy.contains(recommendation.name).should("be.visible");
  });

  it("should increase the score when click arrow up", () => {
    cy.get(".arrowUp").click();
    cy.get(".arrowUp").click();
    cy.get(".arrowUp").click();
    cy.get(".recommendationScore").should("have.text", "3");
  });

  it("should decrease the score when click arrow down", () => {
    cy.get(".arrowDown").click();
    cy.get(".arrowDown").click();
    cy.get(".arrowDown").click();
    cy.get(".recommendationScore").should("have.text", "0");
  });

  it("should remove the the recommendation when score is below -5", () => {
    cy.get(".arrowDown").click();
    cy.get(".arrowDown").click();
    cy.get(".arrowDown").click();
    cy.get(".arrowDown").click();
    cy.get(".arrowDown").click();
    cy.get(".arrowDown").click();
    cy.contains(recommendation.name).should("not.be.null");
  });
});

describe("top menu navigation flow", () => {
  it("should visit top page", () => {
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "/recommendations/top/*").as("getTopRecommendations");

    cy.contains("Top").click();

    cy.wait("@getTopRecommendations");
    cy.url().should("equal", "http://localhost:3000/top");
  });

  it("should visit top page", () => {
    cy.visit("http://localhost:3000");

    cy.intercept("GET", "/recommendations/random").as(
      "getRandomRecommendation"
    );

    cy.contains("Random").click();

    cy.wait("@getRandomRecommendation");
    cy.url().should("equal", "http://localhost:3000/random");
  });
});
