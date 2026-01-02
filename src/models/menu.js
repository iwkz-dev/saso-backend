'use strict';

const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length <= 5;
}

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  barcode: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    min: [0, 'Cannot be lower than 0'],
    required: [true, 'Quantity is required'],
  },
  quantityOrder: {
    type: Number,
    min: [0, 'Cannot be lower than 0'],
    required: [true, 'Quantity is required'],
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Events',
    required: [true, 'Event is required'],
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendors',
  },
  price: {
    type: Number,
    min: [0, 'Cannot be lower than 0'],
    required: [true, 'Price is required'],
    currency: {
      type: String,
      default: 'EUR',
    },
  },
  images: {
    type: Array,
    validate: [arrayLimit, '{PATH} exceeds the limit of 5'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categories',
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

menuSchema.index({ name: 1, event: 1 }, { unique: true });

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
