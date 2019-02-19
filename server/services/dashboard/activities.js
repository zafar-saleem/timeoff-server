'use strict';

const Employees = require('../../models/Employees');
const Activities = require('../../models/Activities');

const utils = require('../../utils');

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
  fetchActivities: fetchActivities
};