"use strict";

const mongoose = require("mongoose");
const { ObjectId } = require("bson");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  quantity: {
    type: Number,
    min: [0, "Cannot be lower than 0"],
    required: [true, "Quantity is required"],
  },
  price: {
    type: Number,
    min: [0, "Cannot be lower than 0"],
    required: [true, "Quantity is required"],
    currency:{
      type: String,
      default: "EUR"
    }
  },
  category:{
    type: String,
    required: [true, "Category is required"],
  },
  started_at: {
    type: Date,
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
