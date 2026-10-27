import LoginPage from "../../support/pages/LoginPage";
import DashboardPage from "../../support/pages/DashboardPage";
import ForgotPasswordPage from "../../support/pages/ForgotPasswordPage";
import { loginData } from "../../support/data/loginData";

describe("OrangeHRM - Fitur Login (POM)", () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  it("TC_L_001 - Login dengan kredensial yang valid", () => {
    LoginPage.login(loginData.valid.username, loginData.valid.password);
    DashboardPage.assertDashboardOpened();
  });

  it("TC_L_002 - Login dengan mengosongkan username dan password", () => {
    LoginPage.clickLogin();
    LoginPage.assertRequiredCount(2);
  });

  it("TC_L_003 - Login dengan mengosongkan username", () => {
    LoginPage.login("", loginData.valid.password);
    LoginPage.assertRequiredCount(1);
    LoginPage.assertRequiredOn("username");
  });

  it("TC_L_004 - Login dengan mengosongkan password", () => {
    LoginPage.login(loginData.valid.username, "");
    LoginPage.assertRequiredCount(1);
    LoginPage.assertRequiredOn("password");
  });

  it("TC_L_005 - Login dengan password salah", () => {
    LoginPage.login(
      loginData.wrongPassword.username,
      loginData.wrongPassword.password,
    );
    LoginPage.assertInvalidCredentials();
  });

  it("TC_L_006 - Login dengan username tidak terdaftar", () => {
    LoginPage.login(
      loginData.unknownUser.username,
      loginData.unknownUser.password,
    );
    LoginPage.assertInvalidCredentials();
  });

  it("TC_L_007 - Sensor/hide input teks di field password", () => {
    LoginPage.typePassword(loginData.valid.password);
    LoginPage.assertPasswordMasked(loginData.valid.password);
  });

  it("TC_L_008 - Uji huruf kapital/kecil pada kolom username", () => {
    LoginPage.login(
      loginData.mixedCaseUser.username,
      loginData.mixedCaseUser.password,
    );
    DashboardPage.assertDashboardOpened();
  });

  it('TC_L_009 - Navigasi ke fitur "Forgot your password?"', () => {
    LoginPage.clickForgotPassword();
    ForgotPasswordPage.assertPageOpened();
  });

  it("TC_L_010 - Verifikasi fungsionalitas tombol Cancel di Reset Password", () => {
    LoginPage.clickForgotPassword();
    ForgotPasswordPage.assertPageOpened();
    ForgotPasswordPage.clickCancel();
    LoginPage.assertLoginPage();
  });

  it("TC_L_011 - Verifikasi instruksi reset password dengan username valid", () => {
    cy.intercept("POST", "**/auth/requestResetPassword", {
      statusCode: 200,
      headers: { "content-type": "text/html" },
      body: `<html><body><h6>${loginData.message.resetSuccess}</h6></body></html>`,
    }).as("resetRequest");

    LoginPage.clickForgotPassword();
    ForgotPasswordPage.assertPageOpened();
    ForgotPasswordPage.typeUsername(loginData.resetUsername);
    ForgotPasswordPage.clickReset();

    cy.wait("@resetRequest");
    ForgotPasswordPage.assertResetSuccess();
  });

  it("TC_L_012 - Verifikasi link sosial media (LinkedIn) di footer", () => {
    LoginPage.assertLinkedinLink();
  });
});
