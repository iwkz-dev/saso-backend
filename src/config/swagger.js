const swaggerJsdoc = require("swagger-jsdoc");

const apiUrl = process.env.PROD_API_URL || "https://saso.iwkz.de";
const port = process.env.LOCAL_PORT_API || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SASO-api",
      version: "1.0.0",
      description: "Saso API",
    },
    servers: [{ url: apiUrl }, { url: `http://localhost:${port}/api/v1` }],
  },
  apis: ["src/docs/*.yml", "./src/routes/*.js", "./src/routes/*/*.js"], // files containing annotations as above
};

const openAPIDocs = swaggerJsdoc(options);

module.exports = { openAPIDocs };
