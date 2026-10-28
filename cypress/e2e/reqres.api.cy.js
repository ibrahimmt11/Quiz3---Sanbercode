describe("reqres.in - API Automation", () => {
  const baseUrl = "https://reqres.in/api";
  const apiKey = "reqres_4c2180098f67456da79f9f8f74c2e764";

  const api = ({ method, path, body, failOnStatusCode = true }) =>
    cy.request({
      method,
      url: `${baseUrl}${path}`,
      body,
      headers: apiKey ? { "x-api-key": apiKey } : {},
      failOnStatusCode,
    });

  it("GET list users", () => {
    api({ method: "GET", path: "/users?page=2" }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.page).to.eq(2);
      expect(res.body.data).to.be.an("array").and.not.be.empty;
      expect(res.body.data[0]).to.include.keys(
        "id",
        "email",
        "first_name",
        "last_name",
        "avatar",
      );
    });
  });

  it("GET user by valid ID", () => {
    api({ method: "GET", path: "/users/2" }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data.id).to.eq(2);
      expect(res.body.data.email).to.eq("janet.weaver@reqres.in");
      expect(res.body.data.first_name).to.eq("Janet");
      expect(res.body.data.last_name).to.eq("Weaver");
    });
  });

  it("GET user by invalid ID", () => {
    api({ method: "GET", path: "/users/23", failOnStatusCode: false }).then(
      (res) => {
        expect(res.status).to.eq(404);
        expect(res.body).to.be.empty;
      },
    );
  });

  it("POST create user", () => {
    const payload = { name: "Dodi", job: "leader" };
    api({ method: "POST", path: "/users", body: payload }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.name).to.eq(payload.name);
      expect(res.body.job).to.eq(payload.job);
      expect(res.body).to.have.property("id");
      expect(res.body).to.have.property("createdAt");
    });
  });

  it("PUT update user", () => {
    const payload = { name: "Dodi", job: "Vice Leader" };
    api({ method: "PUT", path: "/users/2", body: payload }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.name).to.eq(payload.name);
      expect(res.body.job).to.eq(payload.job);
      expect(res.body).to.have.property("updatedAt");
    });
  });

  it("PATCH update user", () => {
    const payload = { job: "qa engineer" };
    api({ method: "PATCH", path: "/users/2", body: payload }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.job).to.eq(payload.job);
      expect(res.body).to.have.property("updatedAt");
    });
  });

  it("DELETE user", () => {
    api({ method: "DELETE", path: "/users/2" }).then((res) => {
      expect(res.status).to.eq(204);
      expect(res.body).to.be.oneOf([undefined, ""]);
    });
  });

  it("POST register successful", () => {
    const payload = { email: "eve.holt@reqres.in", password: "pistol" };
    api({ method: "POST", path: "/register", body: payload }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.be.a("number");
      expect(res.body.token).to.be.a("string").and.not.be.empty;
    });
  });

  it("POST register unsuccessful (tanpa password)", () => {
    api({
      method: "POST",
      path: "/register",
      body: { email: "eve.holt@reqres.in" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq("Missing password");
    });
  });

  it("POST login successful", () => {
    const payload = { email: "eve.holt@reqres.in", password: "cityslicka" };
    api({ method: "POST", path: "/login", body: payload }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.token).to.be.a("string").and.not.be.empty;
    });
  });

  it("POST login unsuccessful (tanpa password)", () => {
    api({
      method: "POST",
      path: "/login",
      body: { email: "eve.holt@reqres.in" },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body.error).to.eq("Missing password");
    });
  });

  it("GET list resource", () => {
    api({ method: "GET", path: "/unknown" }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.data).to.be.an("array").and.not.be.empty;
      res.body.data.forEach((item) => {
        expect(item).to.include.keys(
          "id",
          "name",
          "year",
          "color",
          "pantone_value",
        );
        expect(item.color).to.match(/^#[0-9A-Fa-f]{6}$/);
      });
    });
  });
});
