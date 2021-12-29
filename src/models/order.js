"use strict";

const mongoose = require("mongoose");
const { ObjectId } = require("bson");

const orderSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
  },
  //   ! LATER: STATUS BUAT YANG SUDAH BAYAR ATAU BELOM
  status: {
    type: Number,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  totalPrice: {
    type: Number,
  },
  menus: {
    type: Array,
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
