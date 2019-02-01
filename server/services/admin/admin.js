'use strict';

const express = require('express');
const apiRoutes = express.Router();

const Employees = require('../../models/Employees');
const User = require('../../models/User');
const Activities = require('../../models/Activities');

const utils = require('../../utils');

let user;

const httpResponses = {
  clientAdminFailed: {
    success: false,
    message: 'Tried to access admin area from the client side. Only Admin can access this page'
  },
  onServerAdminFail: {
    success: false,
    message: 'This are is for admin users only'
  },
  employeeAddedSuccessfully: {
    success: true,
    message: 'New employee added successfully'
  }
}

function save(request, response) {
  const { name, role, position, username, password } = request.body;
  user = username
  
  if (request.body.admin.access === 'Admin') {
    utils.checkUserControl(request.body.admin.id)
      .then(user => {
        let employee = new Employees({ name, role, position, username, password, status: false });

        employee.save(error => {
          if (error) response.json(error);

          setActivity();

          response.json(httpResponses.employeeAddedSuccessfully);
        });
      }).catch(error => {
        response.json(error);
      });
  } else {
    response.json(httpResponses.clientAdminFailed);
  }
}

function fetchEmployees(request, response) {
  if (request.query.access !== 'Admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  utils.checkUserControl(request.query.id)
    .then(user => {
      Employees.find({}, (error, docs) => {
        if (error) response.json(error);

        let updatedDocument = docs.map(doc => {
          let documentToObject = doc.toObject();

          delete documentToObject.password;

          return documentToObject;
        });

        response.json(updatedDocument);
      });
    })
    .catch(error => {
      response.json(httpResponses.onServerAdminFail);
    });
}

function deactivate(request, response) {
  console.log(request.body);

  if (request.body.admin.access !== 'Admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  utils.checkUserControl(request.body.admin.id)
    .then(admin => {
      Employees.update({ _id: request.body.id }, {
        active: false
      }, (error, doc) => {
        if (error) response.json(error);
        response.json({ success: true, message: 'User Deactivated' });
      });
    })
    .catch(error => {
      response.json(httpResponses.onServerAdminFail);
    });
}

function setActivity() {
  new Activities({
    username: 'Admin',
    activity: `Admin added ${user}`,
    date: new Date()
  }).save();
}

module.exports = {
  save: save,
  fetchEmployees: fetchEmployees,
  deactivate: deactivate
};
