const User = require('../models/User');
const Activities = require('../models/Activities');
const Employees = require('../models/Employees');

function checkUserControl(id) {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: id }, (error, doc) => {
      if (error) reject(error);
      if (doc.role === 'Admin' || doc.role === 'admin') resolve(true);
      reject({ 
        success: false,
        message: 'This is a restricted area and can only be access by Admins.'
      });
    });
  });
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    Employees.findOne({ _id: id }, (error, user) => {
      if (error) reject(error);
      resolve(user.name);
    });
  });
}

function setActivity(name, activity) {
  new Activities({
    username: name,
    activity: activity
  }).save();
}

module.exports = {
  checkUserControl: checkUserControl,
  setActivity: setActivity,
  getUser: getUser
};