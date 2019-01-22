'use strict';

const express = require('express');
const apiRoutes = express.Router();

const Employees = require('../../models/Employees');
const User = require('../../models/User');
const utils = require('../../utils');

const httpResponses = {
  clientAdminFailed: {
    success: false,
    message: 'Tried to access admin area from the client side. Only Admin can access this page'
  },
  employeeAddedSuccessfully: {
    success: true,
    message: 'New employee added successfully'
  }
}

function save(request, response) {
  const { name, role, position, username, password } = request.body;
  
  if (request.body.admin.access === 'Admin') {
    utils.checkUserControl(request.body.admin.id)
      .then(user => {
        if (error) response.json(error);

        let employee = new Employees({ name, role, position, username, password });

        employee.save(error => {
          if (error) response.json(error);

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
  Employees.find({}, (error, docs) => {
    if (error) response.json(error);

    let updatedDocument = docs.map(doc => {
      let documentToObject = doc.toObject();

      delete documentToObject.password;

      return documentToObject;
    });

    response.json(updatedDocument);
  });
}

function fetchEmployeesCount(request, response) {
  const id = request.query.id;

  utils.checkUserControl(id)
    .then(user => {
      Employees.find({}, (error, docs) => {
        if (error) response.json(error);

        response.json({ total: docs.length });
      });
    })
    .catch(error => {
      response.json(error);
    });
}

module.exports = {
  save: save,
  fetchEmployees: fetchEmployees,
  fetchEmployeesCount: fetchEmployeesCount
};
