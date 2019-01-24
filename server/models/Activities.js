const mongoose = require('mongoose');

const ActivitiesSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
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
