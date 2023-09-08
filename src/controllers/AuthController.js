'use strict';

const httpStatus = require('http-status-codes');
const User = require('@models/user');
const resHelpers = require('@helpers/responseHelpers');
const { mailer } = require('@helpers/nodemailer');
const { changePasswordTemplate } = require('@helpers/templates');
const { comparePassword, hashPassword } = require('@helpers/bcrypt');
const { jwtSign } = require('@helpers/jwt');

class AuthController {
  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} next
   */
  static async login(req, res, next) {
    const { password, type } = req.body;
    const email = req.body.email.toLowerCase();

    try {
      if (!type) {
        throw {
          name: 'Bad Request',
          message: 'Something wrong with your request',
        };
      }
      // ! FLOW LOGIN -> check email ada apa gk -> compare password dari user yg dicari-> check password sama apa gk dengan password.body -> done / kirim token
      const findUser = await User.findOne({ email }).select('+password');
      if (!findUser) {
        throw { name: 'Invalid Auth', message: 'Email / Password is wrong' };
      } else if (findUser.isActive) {
        const verifiedPassword = comparePassword(password, findUser.password);
        if (!verifiedPassword) {
          throw {
            name: 'Invalid Auth',
            message: 'Email / Password is wrong',
          };
        } else {
          const accessToken = jwtSign({
            id: findUser._id,
            email: findUser.email,
            role: findUser.role,
          });

          const isUserAdmin = findUser.role === 1 || findUser.role === 2;

          if (type === 'admin' && !isUserAdmin) {
            throw {
              name: 'Forbidden',
              message: 'You are not allowed to access this page',
            };
          }

          if (type === 'client' && isUserAdmin) {
            throw {
              name: 'Forbidden',
              message: 'You are not allowed to access this page',
            };
          }
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
            .json(resHelpers.success('Success login', result));
        }
      } else {
        throw { name: 'Forbidden', message: 'Your account is inactive' };
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async forgetPassword(req, res, next) {
    const email = req.body.email.toLowerCase();

    try {
      const forgetPasswordToken = jwtSign(
        {
          email,
        },
        { expiresIn: '1h' }
      );

      const findUser = await User.findOne({ email });
      if (!findUser) {
        throw { name: 'Not Found', message: 'User not found' };
      }

      if (findUser.role !== 3) {
        throw {
          name: 'Forbidden',
          message: 'Can not change password for this user',
        };
      }
      const updateUser = await User.findOneAndUpdate(
        { _id: findUser._id },
        { forgetPasswordToken },
        {
          new: true,
        }
      );

      if (!updateUser) {
        throw { name: 'Not Found', message: 'User not found' };
      }

      const forgetPasswordTemplate = changePasswordTemplate(
        email,
        forgetPasswordToken
      );
      await mailer(forgetPasswordTemplate);
      res.status(httpStatus.StatusCodes.OK).json(
        resHelpers.success('success update data', {
          forgetPasswordToken: updateUser.forgetPasswordToken,
        })
      );
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
        throw { name: 'Not Found', message: 'User not found' };
      }
      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success update password', updateUser));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;
