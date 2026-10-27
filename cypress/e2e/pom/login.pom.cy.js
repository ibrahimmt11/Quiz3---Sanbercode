import LoginPage from "../../support/pages/LoginPage";
import DashboardPage from "../../support/pages/DashboardPage";
import ForgotPasswordPage from "../../support/pages/ForgotPasswordPage";

describe("OrangeHRM - Fitur Login (POM + fixtures)", () => {
  let data;

  before(() => {
    cy.fixture("loginData").then((loginData) => {
      data = loginData;
    });
  });

  beforeEach(() => {
    LoginPage.visit(data.baseUrl);
  });

  it("TC_L_001 - Login dengan kredensial yang valid", () => {
    LoginPage.login(data.valid.username, data.valid.password);
    DashboardPage.assertDashboardOpened(data.path.dashboard);
  });

  it("TC_L_002 - Login dengan mengosongkan username dan password", () => {
    LoginPage.clickLogin();
    LoginPage.assertRequiredCount(2, data.message.required);
  });

  it("TC_L_003 - Login dengan mengosongkan username", () => {
    LoginPage.login("", data.valid.password);
    LoginPage.assertRequiredCount(1, data.message.required);
    LoginPage.assertRequiredOn("username", data.message.required);
  });

  it("TC_L_004 - Login dengan mengosongkan password", () => {
    LoginPage.login(data.valid.username, "");
    LoginPage.assertRequiredCount(1, data.message.required);
    LoginPage.assertRequiredOn("password", data.message.required);
  });

  it("TC_L_005 - Login dengan password salah", () => {
    LoginPage.login(data.wrongPassword.username, data.wrongPassword.password);
    LoginPage.assertInvalidCredentials(data.message.invalid, data.path.login);
  });

  it("TC_L_006 - Login dengan username tidak terdaftar", () => {
    LoginPage.login(data.unknownUser.username, data.unknownUser.password);
    LoginPage.assertInvalidCredentials(data.message.invalid, data.path.login);
  });

  it("TC_L_007 - Sensor/hide input teks di field password", () => {
    LoginPage.typePassword(data.valid.password);
    LoginPage.assertPasswordMasked(data.valid.password);
  });

  it("TC_L_008 - Uji huruf kapital/kecil pada kolom username", () => {
    LoginPage.login(data.mixedCaseUser.username, data.mixedCaseUser.password);
    DashboardPage.assertDashboardOpened(data.path.dashboard);
  });

  it('TC_L_009 - Navigasi ke fitur "Forgot your password?"', () => {
    LoginPage.clickForgotPassword();
    ForgotPasswordPage.assertPageOpened(data.path.resetPassword);
  });

  it("TC_L_010 - Verifikasi fungsionalitas tombol Cancel di Reset Password", () => {
    LoginPage.clickForgotPassword();
    ForgotPasswordPage.assertPageOpened(data.path.resetPassword);
    ForgotPasswordPage.clickCancel();
    LoginPage.assertLoginPage(data.path.login);
  });

  it("TC_L_011 - Verifikasi instruksi reset password dengan username valid", () => {
    cy.intercept("POST", "**/auth/requestResetPassword", {
      statusCode: 200,
      headers: { "content-type": "text/html" },
      body: `<html><body><h6>${data.message.resetSuccess}</h6></body></html>`,
    }).as("resetRequest");

    LoginPage.clickForgotPassword();
    ForgotPasswordPage.assertPageOpened(data.path.resetPassword);
    ForgotPasswordPage.typeUsername(data.resetUsername);
    ForgotPasswordPage.clickReset();

    cy.wait("@resetRequest");
    ForgotPasswordPage.assertResetSuccess(data.message.resetSuccess);
  });

  it("TC_L_012 - Verifikasi link sosial media (LinkedIn) di footer", () => {
    LoginPage.assertLinkedinLink(data.linkedinUrl);
  });
});
