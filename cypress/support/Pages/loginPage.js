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

  visit(baseUrl) {
    cy.visit(baseUrl);
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

  assertLoginPage(loginPath) {
    cy.url().should("include", loginPath);
    this.elements.username().should("be.visible");
  }

  assertRequiredCount(count, requiredMessage) {
    this.elements
      .fieldError()
      .should("have.length", count)
      .each(($el) => cy.wrap($el).should("have.text", requiredMessage));
  }

  assertRequiredOn(field, requiredMessage) {
    this.elements[field]()
      .parents(".oxd-input-group")
      .find(".oxd-input-field-error-message")
      .should("have.text", requiredMessage);
  }

  assertInvalidCredentials(invalidMessage, loginPath) {
    this.elements.alertError().should("have.text", invalidMessage);
    cy.url().should("include", loginPath);
  }

  assertPasswordMasked(password) {
    this.elements
      .password()
      .should("have.attr", "type", "password")
      .and("have.value", password);
  }

  assertLinkedinLink(linkedinUrl) {
    this.elements
      .linkedinLink()
      .should("be.visible")
      .and("have.attr", "href", linkedinUrl);
    this.elements.linkedinLink().should("have.attr", "target", "_blank");
  }
}

export default new LoginPage();
