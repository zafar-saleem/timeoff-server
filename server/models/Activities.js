const mongoose = require('mongoose');

const ActivitiesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  activity: {
    type: String,
    required: true
  },
  date: {
    type: Date
  }
});

module.exports = mongoose.model('Activities', ActivitiesSchema);
