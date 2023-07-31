'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  jwtSign: (payload, expired) => {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, expired);
    return accessToken;
  },

  jwtVerify: (accessToken) => {
    const payload = jwt.verify(accessToken, process.env.SECRET_KEY);
    return payload;
  },
};
