'use strict';

const bcrypt = require('bcryptjs');

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
function hashPassword(password) {
  return bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(process.env.BCRYPT_SALT_NUM)
  );
}

module.exports = { comparePassword, hashPassword };
