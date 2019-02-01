'use strict';

const Employees = require('../../models/Employees');

function logoutUser(request, response) {
  Employees.update({ _id: request.body.id }, { status: false }, (error, doc) => {
    if (error) return response.json(error);
    return response.json(doc);
  })
}

module.exports = {
  logoutUser: logoutUser
};
