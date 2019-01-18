'use strict';

const express = require('express');
const apiRoutes = express.Router();

const Employees = require('../../models/Employees');
const User = require('../../models/User');

function save(request, response) {
  if (request.body.access === 'Admin') {
    delete request.body.access;

    User.find({ _id: request.body.id }, (error, user) => {
      if (error) response.json(error);

      delete request.body.id;

      let employee = new Employees(request.body);

      employee.save(error => {
        if (error) response.json(error);

        response.json({ success: true, message: 'New employee added successfully' }); 
      });
    });
  } else {
    response.json({ success: false, message: 'Only Admin can access this page' });
  }
}

module.exports = {
  save: save
};
