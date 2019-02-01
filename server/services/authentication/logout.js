'use strict';

const Employees = require('../../models/Employees');

const httpResponses = {
  onValidationError: {
    success: false,
    message: 'Please enter email and password.'
  },
  onUserSaveError: {
    success: false,
    message: 'That email address already exists.'
  },
  onUserSaveSuccess: {
    success: true,
    message: 'Successfully created new user.'
  }
}

function logoutUser(request, response) {
  Employees.update({ _id: request.body.id }, { status: false }, (error, doc) => {
    if (error) return response.json(error);
    return response.json(doc);
  })
}

module.exports = {
  logoutUser: logoutUser
};
