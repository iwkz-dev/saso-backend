"use strict";

const mongoose = require("mongoose");
const logger = require("./logger");

let url;
if (process.env.NODE_ENV === "production") {
  url = process.env.MONGODB_URL;
} else if (process.env.NODE_ENV === "development") {
  url = "mongodb://localhost:27017/saso-api";
}
mongoose.connect(url, (err) => {
  if (err) {
    logger.error(err, "Connect to the database fail");
  } else {
    logger.info("Connect to the database success");
  }
});
