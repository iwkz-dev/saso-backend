'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
const cron = require('node-cron');

const { orderCleaner } = require('./orderCleaner');

const startJobs = () => {
  cron.schedule('0 23 */2 * *', () => {
    orderCleaner();
  });
};

module.exports = { startJobs };
