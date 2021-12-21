"use strict";

const mongoose = require("mongoose");

// bungkus jadi function
const url = process.env.MONGODB_URI;

mongoose.connect(url, (err) => {
  if (err) {
    console.log(err, "connect to the database fail");
  } else {
    console.log("connect to the database success");
  }
});
