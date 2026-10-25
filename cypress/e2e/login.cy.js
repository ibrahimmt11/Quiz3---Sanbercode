describe("Fitur Login", () => {
  const baseUrl =
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

  const selector = {
    username: 'input[name="username"]',
    password: 'input[name="password"]',
    loginBtn: 'button[type="submit"]',
    fieldError: ".oxd-input-field-error-message",
    alertError: ".oxd-alert-content-text",
    forgotLink: ".orangehrm-login-forgot-header",
    cancelBtn: "button.orangehrm-forgot-password-button--cancel",
    resetBtn: "button.orangehrm-forgot-password-button--reset",
    linkedinLink: '.orangehrm-login-footer-sm a[href*="linkedin"]',
  };

  beforeEach(() => {
    cy.visit(baseUrl);
    cy.get(selector.username).should("be.visible");
  });

  it("TC_L_001 - Login dengan kredensial yang valid", () => {
    cy.get(selector.username).type("Admin");
    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.url({ timeout: 10000 }).should("include", "/dashboard/index");
    cy.get(".oxd-topbar-header-breadcrumb").should("contain.text", "Dashboard");
  });

  it("TC_L_002 - Login dengan mengosongkan username dan password", () => {
    cy.get(selector.loginBtn).click();

    cy.get(selector.fieldError)
      .should("have.length", 2)
      .each(($el) => {
        cy.wrap($el).should("have.text", "Required");
      });
  });

  it("TC_L_003 - Login dengan mengosongkan username", () => {
    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.get(selector.fieldError)
      .should("have.length", 1)
      .and("have.text", "Required");
    cy.get(selector.username)
      .parents(".oxd-input-group")
      .find(selector.fieldError)
      .should("have.text", "Required");
  });

  it("TC_L_004 - Login dengan mengosongkan password", () => {
    cy.get(selector.username).type("Admin");
    cy.get(selector.loginBtn).click();

    cy.get(selector.fieldError)
      .should("have.length", 1)
      .and("have.text", "Required");
    cy.get(selector.password)
      .parents(".oxd-input-group")
      .find(selector.fieldError)
      .should("have.text", "Required");
  });

  it("TC_L_005 - Login dengan password salah", () => {
    cy.get(selector.username).type("Admin");
    cy.get(selector.password).type("admin");
    cy.get(selector.loginBtn).click();

    cy.get(selector.alertError).should("have.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });

  it("TC_L_006 - Login dengan username tidak terdaftar", () => {
    cy.get(selector.username).type("User");
    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.get(selector.alertError).should("have.text", "Invalid credentials");
    cy.url().should("include", "/auth/login");
  });

  it("TC_L_007 - Sensor/hide input teks di field password", () => {
    cy.get(selector.password)
      .type("admin123")
      .should("have.attr", "type", "password")
      .and("have.value", "admin123");
  });

  it("TC_L_008 - Uji huruf kapital/kecil pada kolom username", () => {
    cy.get(selector.username).type("aDmIn");
    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.url().should("include", "/dashboard/index");
  });

  it('TC_L_009 - Navigasi ke fitur "Forgot your password?"', () => {
    cy.get(selector.forgotLink).click();

    cy.url({ timeout: 10000 }).should(
      "include",
      "/auth/requestPasswordResetCode",
    );
    cy.contains("h6", "Reset Password").should("be.visible");
  });

  it("TC_L_010 - Verifikasi fungsionalitas tombol Cancel di Reset Password", () => {
    cy.get(selector.forgotLink).click();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/auth/requestPasswordResetCode",
    );

    cy.get(selector.cancelBtn).click();

    cy.url().should("include", "/auth/login");
    cy.get(selector.username).should("be.visible");
  });

  it("TC_L_011 - Verifikasi instruksi reset password dengan username valid", () => {
    cy.intercept("POST", "**/auth/requestResetPassword").as("resetRequest");

    cy.get(selector.forgotLink).click();
    cy.url({ timeout: 10000 }).should(
      "include",
      "/auth/requestPasswordResetCode",
    );

    cy.get(selector.username).type("Admin");
    cy.get(selector.resetBtn).click();

    // Karena server lambar, ditambahkan timeout yang lebih lama untuk menunggu respons
    cy.url({ timeout: 90000 }).should("include", "/auth/requestResetPassword");
    cy.contains("Reset Password link sent successfully").should("be.visible");
  });

  it("TC_L_012 - Verifikasi link sosial media (LinkedIn) di footer", () => {
    cy.get(selector.linkedinLink)
      .should("be.visible")
      .and(
        "have.attr",
        "href",
        "https://www.linkedin.com/company/orangehrm/mycompany/",
      );

    cy.get(selector.linkedinLink).should("have.attr", "target", "_blank");
  });
});
