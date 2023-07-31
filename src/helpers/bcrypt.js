'use strict';

const bcrypt = require('bcryptjs');

function comparePassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = { comparePassword, hashPassword };
