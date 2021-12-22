"use strict";

const httpStatus = require("http-status-codes");
const User = require("@models/user");
const resHelpers = require("@helpers/responseHelpers");
const { dataPagination } = require("@helpers/dataHelper");

class UserController {
  static async register(req, res, next) {
    const payload = {
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      isActive: true,
      role: 3,
      updated_at: new Date(),
      created_at: new Date(),
    };
    try {
      const createUser = await User.create(payload);
      const result = {
        _id: createUser._id,
        fullname: createUser.fullname,
        email: createUser.email,
        isActive: createUser.isActive,
        role: createUser.role,
        updated_at: createUser.updated_at,
        created_at: createUser.created_at,
      };
      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success("success create an user", result));
    } catch (error) {
      logger.error(error);
      next(error);
    }
  }
}

module.exports = UserController;
