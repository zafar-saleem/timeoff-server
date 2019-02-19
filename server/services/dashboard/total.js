'use strict';

const Employees = require('../../models/Employees');
const utils = require('../../utils');

function employeesCount(request, response) {
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
  employeesCount: employeesCount
};