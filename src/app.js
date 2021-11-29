"use strict";

require("dotenv").config();
require("module-alias/register");
require("./config/mongoose");

const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const routers = require("@routes");

// ! LATER
// const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1", routers);
// ! LATER
// app.use(errorHandler);

module.exports = app;
