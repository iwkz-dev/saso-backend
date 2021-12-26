"use strict";

const httpStatus = require("http-status-codes");
const User = require("@models/user");
const resHelpers = require("@helpers/responseHelpers");
const { comparePassword } = require("@helpers/bcrypt");
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
    // const payload = {
    //   email,
    //   password,
    // };
    try {
      // ! FLOW LOGIN -> check email ada apa gk -> compare password dari user yg dicari-> check password sama apa gk dengan password.body -> done / kirim token
      const findUser = await User.findOne({ email });
      if (!findUser) {
        throw { name: "Invalid Auth", message: "Email / Password is wrong" };
      } else {
        const verifiedPassword = comparePassword(password, findUser.password);
        if (!verifiedPassword) {
          throw { name: "Invalid Auth", message: "Email / Password is wrong" };
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
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;
