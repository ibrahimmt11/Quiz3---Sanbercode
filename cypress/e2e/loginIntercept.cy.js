describe("OrangeHRM - Fitur Login (dengan cy.intercept)", () => {
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
    cy.intercept("POST", "**/auth/validate").as("loginRequest");

    cy.get(selector.username).type("Admin");
    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.wait("@loginRequest", { timeout: 15000 }).then(
      ({ request, response }) => {
        expect(request.method).to.eq("POST");
        expect(response.statusCode).to.be.oneOf([301, 302, 303]);
        expect(response.headers.location).to.include("/dashboard/index");
      },
    );

    cy.url({ timeout: 15000 }).should("include", "/dashboard/index");
  });

  it("TC_L_002 - Login dengan mengosongkan username dan password", () => {
    cy.intercept("GET", "**/dashboard/index*", cy.spy().as("dashboardPage"));

    cy.get(selector.loginBtn).click();

    cy.get(selector.fieldError)
      .should("have.length", 2)
      .each(($el) => {
        cy.wrap($el).should("have.text", "Required");
      });
    cy.get("@dashboardPage").should("not.have.been.called");
  });

  it("TC_L_003 - Login dengan mengosongkan username", () => {
    cy.intercept(
      "GET",
      "**/api/v2/dashboard/employees/action-summary*",
      cy.spy().as("actionSummary"),
    );

    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.get(selector.fieldError)
      .should("have.length", 1)
      .and("have.text", "Required");
    cy.get(selector.username)
      .parents(".oxd-input-group")
      .find(selector.fieldError)
      .should("have.text", "Required");
    cy.get("@actionSummary").should("not.have.been.called");
  });

  it("TC_L_004 - Login dengan mengosongkan password", () => {
    cy.intercept(
      "GET",
      "**/api/v2/dashboard/employees/locations*",
      cy.spy().as("employeeLocations"),
    );

    cy.get(selector.username).type("Admin");
    cy.get(selector.loginBtn).click();

    cy.get(selector.fieldError)
      .should("have.length", 1)
      .and("have.text", "Required");
    cy.get(selector.password)
      .parents(".oxd-input-group")
      .find(selector.fieldError)
      .should("have.text", "Required");
    cy.get("@employeeLocations").should("not.have.been.called");
  });

  it("TC_L_005 - Login dengan password salah", () => {
    cy.intercept(
      "GET",
      "**/api/v2/dashboard/employees/time-at-work*",
      cy.spy().as("timeAtWork"),
    );

    cy.get(selector.username).type("Admin");
    cy.get(selector.password).type("admin");
    cy.get(selector.loginBtn).click();

    cy.get(selector.alertError, { timeout: 15000 }).should(
      "have.text",
      "Invalid credentials",
    );
    cy.url().should("include", "/auth/login");
    cy.get("@timeAtWork").should("not.have.been.called");
  });

  it("TC_L_006 - Login dengan username tidak terdaftar", () => {
    cy.intercept(
      "GET",
      "**/api/v2/dashboard/employees/subunit*",
      cy.spy().as("employeeSubunit"),
    );

    cy.get(selector.username).type("User");
    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.get(selector.alertError, { timeout: 15000 }).should(
      "have.text",
      "Invalid credentials",
    );
    cy.url().should("include", "/auth/login");
    cy.get("@employeeSubunit").should("not.have.been.called");
  });

  it("TC_L_007 - Sensor/hide input teks di field password", () => {
    cy.intercept("POST", "**/auth/**", cy.spy().as("authPost"));

    cy.get(selector.password)
      .type("admin123")
      .should("have.attr", "type", "password")
      .and("have.value", "admin123");

    cy.get("@authPost").should("not.have.been.called");
  });

  it("TC_L_008 - Uji huruf kapital/kecil pada kolom username", () => {
    cy.intercept("GET", "**/api/v2/dashboard/shortcuts*").as(
      "dashboardShortcuts",
    );

    cy.get(selector.username).type("aDmIn");
    cy.get(selector.password).type("admin123");
    cy.get(selector.loginBtn).click();

    cy.wait("@dashboardShortcuts", { timeout: 20000 })
      .its("response.statusCode")
      .should("eq", 200);
    cy.url().should("include", "/dashboard/index");
  });

  it('TC_L_009 - Navigasi ke fitur "Forgot your password?"', () => {
    cy.intercept("GET", "**/auth/requestPasswordResetCode*").as("resetPage");

    cy.get(selector.forgotLink).click();

    cy.wait("@resetPage", { timeout: 15000 })
      .its("response.statusCode")
      .should("eq", 200);
    cy.url().should("include", "/auth/requestPasswordResetCode");
    cy.contains("h6", "Reset Password").should("be.visible");
  });

  it("TC_L_010 - Verifikasi fungsionalitas tombol Cancel di Reset Password", () => {
    cy.get(selector.forgotLink).click();
    cy.url().should("include", "/auth/requestPasswordResetCode");

    cy.intercept("GET", "**/auth/login*").as("backToLogin");
    cy.get(selector.cancelBtn).click();

    cy.wait("@backToLogin", { timeout: 15000 })
      .its("response.statusCode")
      .should("eq", 200);
    cy.url().should("include", "/auth/login");
    cy.get(selector.username).should("be.visible");
  });

  it("TC_L_011 - Verifikasi instruksi reset password dengan username valid", () => {
    cy.intercept("POST", "**/auth/requestResetPassword", {
      statusCode: 200,
      headers: { "content-type": "text/html" },
      body: "<html><body><h6>Reset Password link sent successfully</h6></body></html>",
    }).as("resetRequest");

    cy.get(selector.forgotLink).click();
    cy.url().should("include", "/auth/requestPasswordResetCode");

    cy.get(selector.username).type("Admin");
    cy.get(selector.resetBtn).click();

    cy.wait("@resetRequest", { timeout: 15000 }).then(({ request }) => {
      expect(request.method).to.eq("POST");
      expect(String(request.body)).to.include("username=Admin");
    });
    cy.contains("Reset Password link sent successfully").should("be.visible");
  });

  it("TC_L_012 - Verifikasi link sosial media (LinkedIn) di footer", () => {
    cy.intercept(
      "GET",
      "https://www.linkedin.com/**",
      cy.spy().as("linkedinRequest"),
    );

    cy.get(selector.linkedinLink)
      .should("be.visible")
      .and(
        "have.attr",
        "href",
        "https://www.linkedin.com/company/orangehrm/mycompany/",
      );
    cy.get(selector.linkedinLink).should("have.attr", "target", "_blank");

    cy.get("@linkedinRequest").should("not.have.been.called");
  });
});
