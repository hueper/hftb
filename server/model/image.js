var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var imageSchema = new Schema({
  filename: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Image', imageSchema);
