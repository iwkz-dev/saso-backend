'use strict';

const mongoose = require('mongoose');

const vendorScheme = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true,
  },
  slug: {
    type: String,
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

// ! HOOKS
vendorScheme.pre('save', async function preSaveHook() {
  const vendor = this;
  vendor.slug = vendor.name.toLowerCase().replace(' ', '_');
});
const Vendor = mongoose.model('Vendor', vendorScheme);
module.exports = Vendor;
