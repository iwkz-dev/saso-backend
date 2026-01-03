'use strict';

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    trim: true,
  },
  status: {
    type: Number,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  paymentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentType',
  },
  paypalOrderId: {
    type: String,
  },
  totalPrice: {
    type: Number,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
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

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
