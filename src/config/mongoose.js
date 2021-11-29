"use strict";

const mongoose = require("mongoose");

// bungkus jadi function
let url;
if (process.env.NODE_ENV === "production") {
  url = process.env.MONGODB_URL;
} else if (process.env.NODE_ENV === "development") {
  url = "mongodb://localhost:27017/saso-api";
}
mongoose.connect(url, (err) => {
  if (err) {
    console.log(err, "connect to the database fail");
  } else {
    console.log("connect to the database success");
  }
});
