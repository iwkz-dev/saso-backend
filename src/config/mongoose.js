'use strict';

const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.connect(url, (err) => {
  if (err) {
    console.log(err, 'Connect to the database fail');
  } else {
    console.log('Connect to the database success');
  }
});
