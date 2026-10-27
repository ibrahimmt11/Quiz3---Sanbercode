import { loginData } from "../data/loginData";

class DashboardPage {
  elements = {
    breadcrumb: () => cy.get(".oxd-topbar-header-breadcrumb"),
  };

  assertDashboardOpened() {
    cy.url({ timeout: 15000 }).should("include", loginData.path.dashboard);
    this.elements.breadcrumb().should("contain.text", "Dashboard");
  }
}

export default new DashboardPage();
