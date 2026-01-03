'use strict';

const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length <= 5;
}

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
  },
  started_at: {
    type: Date,
  },
  startYear: {
    type: Number,
  },
  po_closed: {
    type: Boolean,
  },
  /**
   * STATUS: 0 -> draft
   * STATUS: 1 -> approved
   * STATUS: 2 -> done
   */
  status: {
    type: Number,
  },
  iban: {
    type: String,
  },
  bic: {
    type: String,
  },
  bankName: {
    type: String,
  },
  paypal: {
    type: String,
  },
  usageNote: {
    type: String,
  },
  images: {
    type: Array,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
  },
  paymentTypes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentType',
    },
  ],
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

eventSchema.pre('save', async function preSaveCategory() {
  const event = this;
  event.slug = event.name.toLowerCase().replace(' ', '_');
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
