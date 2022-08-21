"use strict";

const jwt = require("jsonwebtoken");
module.exports = {
  jwtSign: (payload, expired) => {
    let accessToken = jwt.sign(payload, process.env.SECRET_KEY, expired);
    return accessToken;
  },

  jwtVerify: (access_token) => {
    const payload = jwt.verify(access_token, process.env.SECRET_KEY);
    return payload;
  },
};
