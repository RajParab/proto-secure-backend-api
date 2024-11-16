const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');

const eventSchema = mongoose.Schema(
  {
    eventHash: {
      type: String,
      lowercase: true,
      unique:true,
      required: true
    },
    user: {
      type: String,
      lowercase: true,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    eventNetwork: {
      type: Number,
      required: true,
    },
    eventType: {
        type: String,
        required: true,
    },
    eventDate: {
      type: Date,
      required: true,
  },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
eventSchema.plugin(toJSON);
eventSchema.plugin(paginate);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;