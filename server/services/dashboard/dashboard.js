'use strict';

const Employees = require('../../models/Employees');
const Activities = require('../../models/Activities');

const utils = require('../../utils');

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

function fetchOnlineEmployees(request, response) {
  const id = request.query.id;

  utils.checkUserControl(id)
    .then(user => {
      Employees.find({ status: true }, (error, docs) => {
        if (error) return response.json(error);
        return response.json(docs.length);
      });
    })
    .catch(error => {
      response.json(error);
    });
}

function fetchActivities(request, response) {
  const id = request.query.id;

  utils.checkUserControl(id)
    .then(user => {
      Activities.find({}, null)
        .sort('-createdAt')
        .exec((error, docs) => {
          if (error) response.json(error);
          response.json(docs);
        });
    })
    .catch(error => {
      return response.json(error);
    });
}

module.exports = {
  fetchEmployeesCount: fetchEmployeesCount,
  fetchOnlineEmployees: fetchOnlineEmployees,
  fetchActivities: fetchActivities
}
