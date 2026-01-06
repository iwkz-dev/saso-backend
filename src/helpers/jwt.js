'use strict';

const jwt = require('jsonwebtoken');

module.exports = {
  jwtSign: (payload, expired, res) => {
    const accessToken = jwt.sign(payload, process.env.SECRET_KEY, expired);

    res.cookie('jwtToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      partitioned: true,
    });

    return accessToken;
  },

  jwtVerify: (accessToken) => {
    const payload = jwt.verify(accessToken, process.env.SECRET_KEY);
    return payload;
  },
};
