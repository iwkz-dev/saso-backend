'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const User = require('@models/user');
const resHelpers = require('@helpers/responseHelpers');
const { detailById } = require('@helpers/dataHelper');
const { jwtSign } = require('@helpers/jwt');

class UserController {
  static async register(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
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

      const findEmail = await User.findOne({ email: payload.email }).session(
        session
      );
      if (findEmail) {
        throw { name: 'Bad Request', message: 'Email is already registered' };
      }

      const createUser = await User.create([payload], { session });
      const result = {
        _id: createUser[0]._id,
        fullname: createUser[0].fullname,
        email: createUser[0].email,
        isActive: createUser[0].isActive,
        role: createUser[0].role,
        phone: createUser[0].phone,
        updated_at: createUser[0].updated_at,
        created_at: createUser[0].created_at,
      };

      const accessToken = jwtSign({
        id: result._id,
        email: result.email,
        role: result.role,
      });
      result.accessToken = accessToken;

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('Success create a user', result));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { id } = req.user;
      const findUser = await detailById(User, id, '-password');
      if (!findUser) {
        throw { name: 'Not Found', message: 'User not found' };
      }

      await session.commitTransaction();
      session.endSession();

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success fetch data', findUser));
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }
}

module.exports = UserController;
