"use strict";

require("dotenv").config();
require("module-alias/register");

const express = require("express");
const routers = require("@routes");
const cors = require("cors");

// ! LATER
// const errorHandler = require("./middlewares/errorHandler");
const app = express();
require("./config/mongoose");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ! LATER
app.use("/", routers);
// app.use(errorHandler);

module.exports = app;
