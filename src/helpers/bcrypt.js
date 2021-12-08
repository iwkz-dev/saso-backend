"use strict";

const bcrypt = require("bcryptjs");

function comparePassword(password, hashPassword) {
  return bcrypt.compareSync(password, hashPassword);
}
function hashPassword(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

module.exports = { comparePassword, hashPassword };
