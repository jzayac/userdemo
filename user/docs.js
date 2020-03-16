const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

module.exports = function(app) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.0",
      info: {
        title: "user API",
        description: "user API Information",
        contact: {
          name: "xyndata",
        },
        version: "1.0.0",
      },
    },
    apis: ["./frontend-api/router/*/*.js"],
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
  });
};
