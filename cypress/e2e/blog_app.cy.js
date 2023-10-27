describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      username: "tester",
      name: "Test User",
      password: "test",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to Application");
    cy.contains("username");
    cy.contains("password");
    cy.contains("login");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.get("#username").type("tester");
      cy.get("#password").type("test");
      cy.get("#login-button").click();

      cy.contains("tester logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#username").type("tester");
      cy.get("#password").type("fail");
      cy.get("#login-button").click();

      cy.contains("Wrong username or password");
    });
  });
});
