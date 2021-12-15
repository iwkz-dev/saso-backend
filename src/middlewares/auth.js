"use strict";

const { jwtVerify } = require("@helpers/jwt");
const User = require("@models/user");

async function authAdmin(req, res, next) {
  // ! DI HEADERS TAMBAH -> access_token
  const { access_token: accessToken } = req.headers;

  try {
    if (!accessToken) {
      throw { name: "Invalid Auth", message: "Invalid Access Token" };
    } else {
      const verifiedAccessToken = jwtVerify(accessToken);

      const findUser = await User.findById(verifiedAccessToken.id);
      if (!findUser) {
        throw { name: "Invalid Auth", message: "Invalid Access Token" };
      } else {
        next();
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = { authAdmin };
