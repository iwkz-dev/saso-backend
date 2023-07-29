'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const cron = require('node-cron');

const { paymentPaypalCleaner } = require('./paymentPaypalCleaner');

const startJobs = () => {
  cron.schedule('0 23 * * *', () => {
    paymentPaypalCleaner();
  });
};

module.exports = { startJobs };
