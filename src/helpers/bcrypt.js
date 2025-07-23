'use strict';

const bcrypt = require('bcryptjs');

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}

function hashPassword(password) {
  const saltNum = parseInt(process.env.BCRYPT_SALT_NUM, 10);

  if (!saltNum || Number.isNaN(saltNum)) {
    throw new Error(
      'BCRYPT_SALT_NUM must be a valid number in environment variables'
    );
  }

  const salt = bcrypt.genSaltSync(saltNum);
  return bcrypt.hashSync(password, salt);
}

module.exports = { comparePassword, hashPassword };
