"use strict";

const { jwtVerify } = require("@helpers/jwt");
const User = require("@models/user");

async function authAdmin(req, res, next) {
  // ! DI HEADERS TAMBAH -> access_token
  const { access_token: accessToken } = req.headers;

  try {
    if (!accessToken) {
      throw { name: "No Access Token", message: accessToken };
    } else {
      const verifiedAccessToken = jwtVerify(accessToken);
      console.log(
        "🚀 ~ file: auth.js ~ line 15 ~ authAdmin ~ verifiedAccessToken",
        verifiedAccessToken
      );

      const findUser = await User.findById(verifiedAccessToken.id);
      if (!findUser || findUser.role === 3) {
        throw {
          name: "User and role not fit",
          message: "Invalid Access Token",
        };
      } else {
        req.user = verifiedAccessToken;
        next();
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function authSuperAdmin(req, res, next) {
  const { access_token: accessToken } = req.headers;

  try {
    if (!accessToken) {
      throw { name: "In auth sa no token", message: "Invalid Access Token" };
    } else {
      const verifiedAccessToken = jwtVerify(accessToken);

      const findUser = await User.findById(verifiedAccessToken.id);
      if (!findUser || findUser.role !== 1) {
        throw {
          name: "In auth sa no fit role and user ",
          message: "Invalid Access Token",
        };
      } else {
        next();
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function authCustomer(req, res, next) {
  // ! DI HEADERS TAMBAH -> access_token
  const { access_token: accessToken } = req.headers;

  try {
    if (!accessToken) {
      throw { name: "Invalid Auth", message: "Invalid Access Token" };
    } else {
      const verifiedAccessToken = jwtVerify(accessToken);

      const findUser = await User.findById(verifiedAccessToken.id);
      if (!findUser || findUser.role !== 3) {
        throw { name: "Invalid Auth", message: "Invalid Access Token" };
      } else {
        req.user = verifiedAccessToken;
        next();
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = { authAdmin, authSuperAdmin, authCustomer };
