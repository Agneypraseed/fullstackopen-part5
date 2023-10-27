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
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.get("#username").type("tester");
      cy.get("#password").type("test");
      cy.get("#login-button").click();
    });

    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("Cypress Test Blog");
      cy.get("#url").type("test.com");
      cy.get("#author").type("tester");
      cy.get("#addBlog").click();
      cy.contains("a new blog Cypress Test Blog by tester added");
      cy.contains("view");
    });

    describe("and a blog exists", function () {
      beforeEach(function () {
        cy.contains("create new blog").click();
        cy.get("#title").type("Cypress Test Blog");
        cy.get("#url").type("test.com");
        cy.get("#author").type("tester");
        cy.get("#addBlog").click();
      });

      it("it can be liked", function () {
        cy.contains("view").click();
        cy.get("#like").click();
        cy.contains("likes 1");
      });

      it("it can be deleted by the user who created it", function () {
        cy.contains("create new blog").click();
        cy.get("#title").type("Test blog to delete");
        cy.get("#url").type("test.com");
        cy.get("#author").type("tester");
        cy.get("#addBlog").click();
        cy.contains("Test blog to delete").contains("view").click();
        cy.get("#delete").click();
        cy.on("window:confirm", () => true);
        cy.contains("Test blog to delete").should("not.exist");
      });
    });
  });
});
