'use strict';

const mongoose = require('mongoose');
const validator = require('validator');
const { hashPassword } = require('@helpers/bcrypt');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'Fullname is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'Your password length should be greater than 5'],
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Phone is required'],
  },
  isActive: {
    type: Boolean,
  },
  /**
   * ROLE: 1 -> super_admin
   * ROLE: 2 -> admin
   * ROLE: 3 -> customer page
   * SWAGGER -> API DOCUMETANTION ->
   * mongolab -> mlab
   */
  role: {
    type: Number,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpiresAt: {
    type: Date,
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiresAt: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

// ! HOOKS
userSchema.pre('save', async function preSaveHook(next) {
  try {
    if (!this.isModified('password')) return next();
    this.password = await hashPassword(this.password);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
