'use strict';

const mongoose = require('mongoose');

const paymentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

const PaymentType = mongoose.model('PaymentType', paymentTypeSchema);
module.exports = PaymentType;
