const mongoose = require('mongoose');
const SlicderItem = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide slider title'],
    },
    desc: {
      type: String,
      required: [true, 'Please provide slider description'],
    },
    img: {
      type: String,
      required: [true, 'Please provide img url'],
    },
    bg: {
      type: String,
      required: [true, 'Please provide background color'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { getters: true } }
);

module.exports = mongoose.model('SlicderItem', SlicderItem);
