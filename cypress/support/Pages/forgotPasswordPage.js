class ForgotPasswordPage {
  elements = {
    title: () => cy.contains("h6", "Reset Password"),
    username: () => cy.get('input[name="username"]'),
    cancelBtn: () => cy.get("button.orangehrm-forgot-password-button--cancel"),
    resetBtn: () => cy.get("button.orangehrm-forgot-password-button--reset"),
  };

  assertPageOpened(resetPath) {
    cy.url().should("include", resetPath);
    this.elements.title().should("be.visible");
  }

  typeUsername(username) {
    this.elements.username().type(username);
  }

  clickCancel() {
    this.elements.cancelBtn().click();
  }

  clickReset() {
    this.elements.resetBtn().click();
  }

  assertResetSuccess(successMessage) {
    cy.contains(successMessage, { timeout: 15000 }).should("be.visible");
  }
}

export default new ForgotPasswordPage();
