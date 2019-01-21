const User = require('../models/User');

function checkUserControl(id) {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: id }, (error, doc) => {
      if (error) reject(error);
      if (doc.role === 'Admin') resolve(true);
      reject({ 
        success: false,
        message: 'This is a restricted area and can only be access by Admins.'
      });
    });
  });
}

module.exports = {
  checkUserControl: checkUserControl
};