class DashboardPage {
  elements = {
    breadcrumb: () => cy.get(".oxd-topbar-header-breadcrumb"),
  };

  assertDashboardOpened(dashboardPath) {
    cy.url({ timeout: 15000 }).should("include", dashboardPath);
    this.elements.breadcrumb().should("contain.text", "Dashboard");
  }
}

export default new DashboardPage();
