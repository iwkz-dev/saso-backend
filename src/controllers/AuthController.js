"use strict";

const httpStatus = require("http-status-codes");
const User = require("@models/user");
const resHelpers = require("@helpers/responseHelpers");
const { comparePassword, hashPassword } = require("@helpers/bcrypt");
const { jwtSign } = require("@helpers/jwt");

class AuthController {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      // ! FLOW LOGIN -> check email ada apa gk -> compare password dari user yg dicari-> check password sama apa gk dengan password.body -> done / kirim token
      const findUser = await User.findOne({ email }).select("+password");
      if (!findUser) {
        throw { name: "Invalid Auth", message: "Email / Password is wrong" };
      } else {
        if (findUser.isActive) {
          const verifiedPassword = comparePassword(password, findUser.password);
          if (!verifiedPassword) {
            throw {
              name: "Invalid Auth",
              message: "Email / Password is wrong",
            };
          } else {
            const accessToken = jwtSign({
              id: findUser._id,
              email: findUser.email,
              role: findUser.role,
            });
            /**
             * ROLE: 1 -> super_admin
             * ROLE: 2 -> admin
             * ROLE: 3 -> customer page
             */
            const result = {
              id: findUser._id,
              email: findUser.email,
              accessToken,
              role: findUser.role,
            };
            res
              .status(httpStatus.StatusCodes.OK)
              .json(resHelpers.success("Success login", result));
          }
        } else {
          throw { name: "Forbidden", message: "Your account is inactive" };
        }
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async forgetPassword(req, res, next) {
    const { email } = req.body;

    try {
      const forgetPasswordToken = jwtSign(
        {
          email,
        },
        { expiresIn: "1h" }
      );

      const findUser = await User.findOne({ email });

      const updateUser = await User.findOneAndUpdate(
        { _id: findUser._id },
        { forgetPasswordToken },
        {
          new: true,
        }
      );

      if (!updateUser) {
        throw { name: "Not Found", message: "User not found" };
      }

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success update data", updateUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async changePassword(req, res, next) {
    const { password, id } = req.body;

    try {
      const hashedPassword = hashPassword(password);

      const updateUser = await User.findOneAndUpdate(
        { _id: id },
        { password: hashedPassword, forgetPasswordToken: null },
        {
          new: true,
        }
      );

      if (!updateUser) {
        throw { name: "Not Found", message: "User not found" };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success("success update password", updateUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;
