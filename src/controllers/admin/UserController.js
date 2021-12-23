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
      isActive: req.body.isActive || false,
      role: +req.body.role,
      phone: req.body.phone,
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
        phone: createUser.phone,
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
    const { page, limit } = req.query;

    try {
      const options = {
        page: page || 1,
        limit: limit || 100000,
        sort: {
          type: "updated_at",
          method: -1,
        },
      };
      const findUsers = await dataPagination(
        User,
        { $or: [{ role: 1 }, { role: 2 }] },
        ["-password"],
        options
      );
      // const findUsers = await User.find()
      //   .select("-password")
      //   .sort({ updated_at: -1 });
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
      if (!findUser) {
        throw { name: "Not Found", message: "User not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success fetch data", findUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      const deletedUser = await User.findOneAndDelete({ _id: id });
      if (!deletedUser) {
        throw { name: "Not Found", message: "User not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success delete data", deletedUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  static async changeActive(req, res, next) {
    const { id } = req.params;
    const payload = {
      isActive: req.body.isActive,
    };

    try {
      const updatedUser = await User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      }).select("-password");
      if (!updatedUser) {
        throw { name: "Not Found", message: "User not found" };
      }

      let msg = "";
      if (payload.isActive === "true") {
        msg += "active";
      } else {
        msg += "inactive";
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("User is " + msg, updatedUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async changeRole(req, res, next) {
    const { id } = req.params;
    const payload = {
      role: +req.body.role,
    };

    try {
      const updatedUser = await User.findOneAndUpdate({ _id: id }, payload, {
        new: true,
      }).select("-password");
      if (!updatedUser) {
        throw { name: "Not Found", message: "User not found" };
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("User's role has changed", updatedUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
