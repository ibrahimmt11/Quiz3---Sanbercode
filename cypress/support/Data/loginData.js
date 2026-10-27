export const loginData = {
  baseUrl: "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",

  valid: { username: "Admin", password: "admin123" },
  wrongPassword: { username: "Admin", password: "admin" },
  unknownUser: { username: "User", password: "admin123" },
  mixedCaseUser: { username: "aDmIn", password: "admin123" },

  resetUsername: "Admin",

  message: {
    required: "Required",
    invalid: "Invalid credentials",
    resetSuccess: "Reset Password link sent successfully",
  },

  path: {
    login: "/auth/login",
    dashboard: "/dashboard/index",
    resetPassword: "/auth/requestPasswordResetCode",
  },

  linkedinUrl: "https://www.linkedin.com/company/orangehrm/mycompany/",
};
