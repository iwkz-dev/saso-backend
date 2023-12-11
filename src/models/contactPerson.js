'use strict';

const mongoose = require('mongoose');

const contactPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone Number is required'],
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Events',
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

const contactPerson = mongoose.model('contactPerson', contactPersonSchema);
module.exports = contactPerson;
