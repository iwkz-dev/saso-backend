"use strict";

const mongoose = require("mongoose");
const { ObjectId } = require("bson");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  started_at: {
    type: Date,
  },
  isActive: {
    type: Boolean,
  },
  images: {
    type: Array,
    validate: [arrayLimit, "{PATH} exceeds the limit of 5"],
  },
  updated_at: {
    type: Date,
  },
  created_at: {
    type: Date,
  },
});

function arrayLimit(val) {
  return val.length <= 5;
}
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
