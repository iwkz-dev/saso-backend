'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
require('module-alias/register');
require('./config/mongoose');

const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const routers = require('@routes');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
const { openAPIDocs } = require('@configs/swagger');
// const { startJobs } = require('./controllers/jobs');

// ! BEST PRACTICE REQUIRE YANG DARI MODULE DIATAS ABIS ITU REQUIRE YANG ADA DI FILE LOCAL
const app = express();

// paypal payment test
// app.get('/', (req, res) => res.sendFile(`${__dirname}/paypal.html`));

app.use(logger('dev'));

const allowedOrigins = process.env.FRONTEND_URLS.split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SWAGGER
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openAPIDocs));
// app.get("/api-docs", );

const uriPrefix = process.env.API_PREFIX || '/api/v1';
app.use(uriPrefix, routers);

app.use((req, res, next) => {
  next(createError(404));
});

// startJobs();

module.exports = app;
