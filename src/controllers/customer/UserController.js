'use strict';

const mongoose = require('mongoose');
const httpStatus = require('http-status-codes');
const User = require('@models/user');
const resHelpers = require('@helpers/responseHelpers');
const { detailById } = require('@helpers/dataHelper');
const { jwtSign } = require('@helpers/jwt');
const { generateVerificationToken } = require('@helpers/verificationToken');
const { mailer } = require('@helpers/nodemailer');
const { comparePassword } = require('@helpers/bcrypt');
const crypto = require('crypto');
const {
  changePasswordTemplate,
  resetPasswordSuccessTemplate,
} = require('@helpers/templates');
const {
  verificationEmailTemplate,
  welcomeEmailTemplate,
} = require('@helpers/templates');

class UserController {
  static async register(req, res, next) {
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

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

      const verificationToken = generateVerificationToken();
      const verificationTokenExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      );

      const user = new User({
        ...payload,
        verificationToken,
        verificationTokenExpiresAt,
      });

      const createdUser = await user.save({ session });

      const result = {
        _id: createdUser._id,
        fullname: createdUser.fullname,
        email: createdUser.email,
        isActive: createdUser.isActive,
        role: createdUser.role,
        phone: createdUser.phone,
        updated_at: createdUser.updated_at,
        created_at: createdUser.created_at,
      };

      jwtSign({ userId: user._id }, { expiresIn: '7d' }, res);

      await session.commitTransaction();

      const emailTemplate = verificationEmailTemplate(
        createdUser.email,
        verificationToken
      );

      await mailer(emailTemplate);

      res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('Success create a user', result));
    } catch (error) {
      await session.abortTransaction();
      console.error(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async verifyEmail(req, res, next) {
    const { token: code } = req.params;
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findOne({
        _id: userId,
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: new Date() },
      }).session(session);

      if (!user) {
        throw {
          name: 'Bad Request',
          message: 'Invalid or expired verification token',
        };
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save({ session });

      const emailTemplate = welcomeEmailTemplate(user.email, user.fullname);

      await mailer(emailTemplate);

      await session.commitTransaction();

      const result = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        isActive: user.isActive,
        role: user.role,
        phone: user.phone,
        updated_at: user.updated_at,
        created_at: user.created_at,
      };

      return res
        .status(httpStatus.StatusCodes.CREATED)
        .json(resHelpers.success('Email verified successfully', result));
    } catch (error) {
      console.error('Error in verifyEmail controller:', error);

      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async requestVerifyEmail(req, res, next) {
    const userId = req.user._id;
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const user = await User.findById(userId).session(session);

      if (!user) {
        throw { name: 'Not Found', message: 'User not found' };
      }

      if (user.isVerified) {
        throw { name: 'Bad Request', message: 'Email is already verified' };
      }

      const verificationToken = generateVerificationToken();
      const verificationTokenExpiresAt = new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ); // 24 hours

      user.verificationToken = verificationToken;
      user.verificationTokenExpiresAt = verificationTokenExpiresAt;

      await user.save({ session });

      await session.commitTransaction();

      const emailTemplate = verificationEmailTemplate(
        user.email,
        verificationToken
      );
      await mailer(emailTemplate);

      return res
        .status(httpStatus.StatusCodes.OK)
        .json(
          resHelpers.success('New verification email sent successfully', {})
        );
    } catch (error) {
      if (session) await session.abortTransaction();
      console.error('Error in requestVerifyEmail controller:', error);
      next(error);
    } finally {
      if (session) session.endSession();
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

  static async checkAuth(req, res, next) {
    const userId = req.user._id;
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      const user = await User.findById(userId).session(session);

      if (!user) {
        throw new Error('User not found');
      }

      await session.commitTransaction();

      return res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success fetch data', user));
    } catch (error) {
      console.error('Error in checkAuth controller:', error);
      await session.abortTransaction();
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const verifiedPassword = comparePassword(password, user.password);
      if (!verifiedPassword) {
        throw {
          name: 'Invalid Auth',
          message: 'Email / Password is wrong',
        };
      }

      if (user.isActive === false) {
        throw {
          name: 'Forbidden',
          message: 'Your account is inactive',
        };
      }

      jwtSign({ userId: user._id }, { expiresIn: '7d' }, res);

      user.lastLogin = new Date();

      await user.save({ session });
      await session.commitTransaction();

      const result = {
        id: user._id,
        email: user.email,
      };

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success login', result));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async logout(req, res, next) {
    try {
      res.clearCookie('jwtToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        partitioned: true,
      });

      return res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Successfully logged out', null));
    } catch (error) {
      console.error('Error in logout controller:', error);
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    const { email } = req.body;
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      if (!email) {
        throw { name: 'Bad Request', message: 'Email is required' };
      }

      const user = await User.findOne({ email }).session(session);
      if (!user) {
        throw { name: 'Not Found', message: 'User not found' };
      }

      const forgotPasswordToken = crypto.randomBytes(32).toString('hex');

      user.resetPasswordToken = forgotPasswordToken;
      user.resetPasswordExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await user.save({ session });
      await session.commitTransaction();

      const forgetPasswordTemplate = changePasswordTemplate(
        email,
        forgotPasswordToken
      );

      await mailer(forgetPasswordTemplate);

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('Success send forgot password email', {}));
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      next(error);
    } finally {
      session.endSession();
    }
  }

  static async resetPassword(req, res, next) {
    const { token, email } = req.query;
    const { newPassword } = req.body;
    let session;

    try {
      session = await mongoose.startSession();
      session.startTransaction();

      if (!token || !newPassword) {
        throw {
          name: 'Bad Request',
          message: 'Token and new password are required',
        };
      }

      const user = await User.findOne({
        email,
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: new Date() },
      })
        .select('+password')
        .session(session);

      if (!user) {
        throw new Error('Invalid or expired reset password token');
      }

      const isPasswordValid = comparePassword(newPassword, user.password);

      if (isPasswordValid) {
        throw {
          name: 'Bad Request',
          message: 'New password must be different from the old password',
        };
      }

      user.password = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;

      await user.save({ session });
      await session.commitTransaction();

      const resetPasswordTemplate = resetPasswordSuccessTemplate(
        user.email,
        user.fullname
      );
      await mailer(resetPasswordTemplate);

      res
        .status(httpStatus.StatusCodes.OK)
        .json(resHelpers.success('success update password', {}));
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = UserController;
