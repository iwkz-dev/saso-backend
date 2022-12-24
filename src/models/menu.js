'use strict';

const mongoose = require('mongoose');

function arrayLimit(val) {
  return val.length <= 5;
}

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
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
  },
  price: {
    type: Number,
    min: [0, 'Cannot be lower than 0'],
    required: [true, 'Quantity is required'],
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

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
