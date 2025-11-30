window.onload = function () {
  const ui = window.ui;

  ui.getSystem().events.on("response", (res) => {
    const response = res.responseObj;
    const path = res.path;
    const method = res.method;

    if (path === "/api/auth/login" && method === "post") {
      try {
        const token = response.data.accessToken;
        const refresh = response.data.refreshToken;

        if (token) {
          localStorage.setItem("swagger_token", token);
          ui.preauthorizeApiKey("BearerAuth", token);
        }
        if (refresh) {
          localStorage.setItem("swagger_refresh_token", refresh);
        }

        console.log("✔ Login token & refreshToken saved automatically");
      } catch (e) {
        console.error("Login save error:", e);
      }
    }

    if (path === "/api/auth/refresh-token" && method === "post") {
      try {
        const token = response.data.accessToken;
        const refresh = response.data.refreshToken;

        if (token) {
          localStorage.setItem("swagger_token", token);
          ui.preauthorizeApiKey("BearerAuth", token);
        }
        if (refresh) {
          localStorage.setItem("swagger_refresh_token", refresh);
        }

        console.log("✔ Tokens refreshed successfully");
      } catch (e) {
        console.error("Refresh save error:", e);
      }
    }
  });

  const savedToken = localStorage.getItem("swagger_token");
  if (savedToken) {
    ui.preauthorizeApiKey("BearerAuth", savedToken);
  }
};
