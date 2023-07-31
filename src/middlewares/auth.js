'use strict';

const { jwtVerify } = require('@helpers/jwt');
const User = require('@models/user');

async function authAdmin(req, res, next) {
  // const { access_token: accessToken } = req.headers;
  const { authorization } = req.headers;

  const accessToken = authorization && authorization.split(' ')[1];

  try {
    if (!accessToken) {
      throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
    } else {
      const verifiedAccessToken = jwtVerify(accessToken);

      const findUser = await User.findOne({
        _id: verifiedAccessToken.id,
      });

      if (!findUser || findUser.role === 3) {
        throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
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
  const { authorization } = req.headers;
  const accessToken = authorization && authorization.split(' ')[1];

  try {
    if (!accessToken) {
      throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
    } else {
      const verifiedAccessToken = jwtVerify(accessToken);

      const findUser = await User.findOne({
        _id: verifiedAccessToken.id,
      });
      if (!findUser || findUser.role !== 1) {
        throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
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
  const { authorization } = req.headers;
  const accessToken = authorization && authorization.split(' ')[1];

  try {
    if (!accessToken) {
      throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
    } else {
      const verifiedAccessToken = jwtVerify(accessToken);
      const findUser = await User.findOne({
        _id: verifiedAccessToken.id,
      });
      if (!findUser || findUser.role !== 3) {
        throw { name: 'Invalid Auth', message: 'Invalid Access Token' };
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

async function authChangePassword(req, res, next) {
  const { token } = req.body;
  try {
    if (!token) {
      throw { name: 'Invalid Auth', message: 'Invalid Token' };
    } else {
      const verifiedToken = jwtVerify(token);

      const findUser = await User.findOne({ email: verifiedToken.email });
      if (!findUser) {
        throw { name: 'Not Found', message: 'User not found' };
      } else if (token !== findUser.forgetPasswordToken) {
        throw { name: 'Invalid Auth', message: 'Invalid Token' };
      } else {
        req.body.id = findUser._id;
        next();
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
}

module.exports = {
  authAdmin,
  authSuperAdmin,
  authCustomer,
  authChangePassword,
};
