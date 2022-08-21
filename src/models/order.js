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
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  customerFullname: {
    type: String,
  },
  customerEmail: {
    type: String,
  },
  customerPhone: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events",
  },
  note: {
    type: String,
  },
  arrived_at: {
    type: String,
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
