const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SASO-api",
      version: "1.0.0",
      description: "Saso API",
    },
    servers: [
      { url: `${process.env.PROD_API_URL}/api/v1` },
      { url: `http://localhost:${process.env.LOCAL_PORT_API}/api/v1` },
    ],
  },
  apis: ["src/docs/*.yml", "./src/routes/*.js", "./src/routes/*/*.js"], // files containing annotations as above
};

const openAPIDocs = swaggerJsdoc(options);

module.exports = { openAPIDocs };
