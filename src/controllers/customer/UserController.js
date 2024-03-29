'use strict';

const httpStatus = require('http-status-codes');
const User = require('@models/user');
const resHelpers = require('@helpers/responseHelpers');
const { detailById } = require('@helpers/dataHelper');
const { jwtSign } = require('@helpers/jwt');

class UserController {
  static async register(req, res, next) {
    const payload = {
      fullname: req.body.fullname,
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      isActive: true,
      phone: req.body.phone,
      role: 3,
      updated_at: new Date(),
      created_at: new Date(),
    };
    try {
      const findEmail = await User.findOne({
        email: payload.email,
      });

      if (findEmail) {
        throw { name: 'Bad Request', message: 'Email is already registered' };
      } else {
        const createUser = await User.create(payload);
        const result = {
          _id: createUser._id,
          fullname: createUser.fullname,
          email: createUser.email,
          isActive: createUser.isActive,
          role: createUser.role,
          phone: createUser.phone,
          updated_at: createUser.updated_at,
          created_at: createUser.created_at,
        };
        const accessToken = jwtSign({
          id: result._id,
          email: result.email,
          role: result.role,
        });
        result.accessToken = accessToken;
        res
          .status(httpStatus.StatusCodes.CREATED)
          .json(resHelpers.success('success create an user', result));
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    const { id } = req.user;
    try {
      const findUser = await detailById(User, id, '-password');
      if (!findUser) {
        throw { name: 'Not Found', message: 'User not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success fetch data', findUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
