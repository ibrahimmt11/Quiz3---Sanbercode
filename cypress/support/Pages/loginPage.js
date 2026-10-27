import { loginData } from "../data/loginData";

class LoginPage {
  elements = {
    username: () => cy.get('input[name="username"]'),
    password: () => cy.get('input[name="password"]'),
    loginBtn: () => cy.get('button[type="submit"]'),
    fieldError: () => cy.get(".oxd-input-field-error-message"),
    alertError: () => cy.get(".oxd-alert-content-text"),
    forgotLink: () => cy.get(".orangehrm-login-forgot-header"),
    linkedinLink: () =>
      cy.get('.orangehrm-login-footer-sm a[href*="linkedin"]'),
  };

  visit() {
    cy.visit(loginData.baseUrl);
    this.elements.username().should("be.visible");
  }

  typeUsername(username) {
    if (username) this.elements.username().type(username);
  }

  typePassword(password) {
    if (password) this.elements.password().type(password);
  }

  clickLogin() {
    this.elements.loginBtn().click();
  }

  login(username, password) {
    this.typeUsername(username);
    this.typePassword(password);
    this.clickLogin();
  }

  clickForgotPassword() {
    this.elements.forgotLink().click();
  }

  assertLoginPage() {
    cy.url().should("include", loginData.path.login);
    this.elements.username().should("be.visible");
  }

  assertRequiredCount(count) {
    this.elements
      .fieldError()
      .should("have.length", count)
      .each(($el) =>
        cy.wrap($el).should("have.text", loginData.message.required),
      );
  }

  assertRequiredOn(field) {
    this.elements[field]()
      .parents(".oxd-input-group")
      .find(".oxd-input-field-error-message")
      .should("have.text", loginData.message.required);
  }

  assertInvalidCredentials() {
    this.elements.alertError().should("have.text", loginData.message.invalid);
    cy.url().should("include", loginData.path.login);
  }

  assertPasswordMasked(password) {
    this.elements
      .password()
      .should("have.attr", "type", "password")
      .and("have.value", password);
  }

  assertLinkedinLink() {
    this.elements
      .linkedinLink()
      .should("be.visible")
      .and("have.attr", "href", loginData.linkedinUrl);
    this.elements.linkedinLink().should("have.attr", "target", "_blank");
  }
}

export default new LoginPage();
