'use strict';

const mongoose = require('mongoose');

const paymentTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Type is required'],
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);
module.exports = PaymentType;
