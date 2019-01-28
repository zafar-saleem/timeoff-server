const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const VacationsSchema = new mongoose.Schema({
  employeeID: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  date: {
    type: Date
  }
});

module.exports = mongoose.model('Vacations', VacationsSchema);
