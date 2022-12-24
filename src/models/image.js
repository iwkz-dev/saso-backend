'use strict';

const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  fileName: {
    type: String,
  },
  parent_uid: {
    type: String,
  },
  eTag: {
    type: String,
  },
  type: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
