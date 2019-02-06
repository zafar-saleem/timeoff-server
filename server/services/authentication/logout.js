'use strict';

const Employees = require('../../models/Employees');
const utils = require('../../utils/');

function logoutUser(request, response) {
  Employees.updateOne({ _id: request.body.id }, { status: false }, (error, doc) => {
    if (error) return response.json(error);

    if (request.body.access === 'Admin') {
      utils.setActivity('Admin', 'Admin logged out.');
      return response.json(doc);
    }

    utils.getUser(request.body.id)
      .then(user => {
        utils.setActivity(user, `${user} logged out.`);
        return response.json(doc);
      })
      .catch(error => {
        return response.json(error);
      });
  })
}

module.exports = {
  logoutUser: logoutUser
};
