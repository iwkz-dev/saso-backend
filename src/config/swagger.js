const swaggerJsdoc = require("swagger-jsdoc");
const { version, description } = require("../../package.json");

const apiUrl = process.env.PROD_API_URL || "https://saso-dev.iwkz.de/";
const port = process.env.LOCAL_PORT_API || 3000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SASO-api",
      version: version,
      description: description,
    },
    servers: [
      { url: apiUrl },
      { url: `http://localhost:${port}/api/${version}` },
    ],
  },
  apis: ["src/docs/*.yml", "./src/routes/*.js", "./src/routes/*/*.js"], // files containing annotations as above
};

const openAPIDocs = swaggerJsdoc(options);

module.exports = { openAPIDocs };
