const mongoose = require('mongoose');

const ActivitiesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: false
  },
  activity: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Activities', ActivitiesSchema);
