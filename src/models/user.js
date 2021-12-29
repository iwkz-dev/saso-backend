"use strict";

const mongoose = require("mongoose");
const { ObjectId } = require("bson");
const validator = require("validator");
const { hashPassword } = require("@helpers/bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Fullname is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [5, "Your password length should be greater than 5"],
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
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
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

// ! HOOKS
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  user.password = hashPassword(user.password);
});

const User = mongoose.model("User", userSchema);
module.exports = User;
