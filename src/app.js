"use strict";

require("dotenv").config();
require("module-alias/register");
require("./config/mongoose");

const express = require("express");
const createError = require("http-errors");
const logger = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const routers = require("@routes");
const { openAPIDocs } = require("@configs/swagger");

// ! BEST PRACTICE REQUIRE YANG DARI MODULE DIATAS ABIS ITU REQUIRE YANG ADA DI FILE LOCAL
const app = express();

app.use(logger("dev"));

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SWAGGER
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openAPIDocs));
// app.get("/api-docs", );

const apiVersion = "v1";
app.use("/api/" + apiVersion, routers);

app.use(function (req, res, next) {
  next(createError(404));
});

module.exports = app;
