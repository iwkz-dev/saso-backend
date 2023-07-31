'use strict';

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
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
categorySchema.pre('save', async function () {
  const category = this;
  category.slug = category.name.toLowerCase().replace(' ', '_');
});
const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
