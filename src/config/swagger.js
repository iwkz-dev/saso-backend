const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SASO-api",
      version: "1.0.0",
      description: "Saso API",
    },
    servers: [{ url: "http://localhost:3000/api/v1" }],
    components: {
      securitySchemes: {
        JWT: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          name: "access_token",
          in: "header",
        },
      },
    },
  },
  apis: ["./src/routes/*/*.js"], // files containing annotations as above
};

const openAPIDocs = swaggerJsdoc(options);

module.exports = { openAPIDocs };
