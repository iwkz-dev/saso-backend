"use strict";

const mongoose = require("mongoose");

let url;
if (process.env.NODE_ENV === "production") {
  url = process.env.MONGODB_URI_PRODUCTION;
} else if (process.env.NODE_ENV === "development") {
  url = process.env.MONGODB_URI_DEVELOPMENT;
}
mongoose.connect(url, (err) => {
  if (err) {
    console.log(err, "Connect to the database fail");
  } else {
    console.log("Connect to the database success");
  }
});
