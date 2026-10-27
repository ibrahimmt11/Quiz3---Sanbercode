import { loginData } from "../data/loginData";

class ForgotPasswordPage {
  elements = {
    title: () => cy.contains("h6", "Reset Password"),
    username: () => cy.get('input[name="username"]'),
    cancelBtn: () => cy.get("button.orangehrm-forgot-password-button--cancel"),
    resetBtn: () => cy.get("button.orangehrm-forgot-password-button--reset"),
  };

  assertPageOpened() {
    cy.url().should("include", loginData.path.resetPassword);
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

  assertResetSuccess() {
    cy.contains(loginData.message.resetSuccess, { timeout: 15000 }).should(
      "be.visible",
    );
  }
}

export default new ForgotPasswordPage();
