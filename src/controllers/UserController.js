"use strict";

const httpStatus = require("http-status-codes");
const User = require("@models/user");
const resHelpers = require("@helpers/responseHelpers");

class UserController {
  static async register(req, res, next) {
    const payload = {
      fullname: req.body.fullname,
      email: req.body.email,
      password: req.body.password,
      isActive: req.body.isActive || false,
      role: req.body.role,
      updated_at: new Date(),
      created_at: new Date(),
    };
    try {
      const createUser = await User.create(payload).select("-password");
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
      console.log(error);
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const findUsers = await User.find().select("-password");
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findUsers));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getUserById(req, res, next) {
    const { id } = req.params;
    try {
      const findUser = await User.findById(id).select("-password");
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findUser));
    } catch (error) {}
  }
}

module.exports = UserController;
