'use strict';

const Employees = require('../../models/Employees');
const utils = require('../../utils');

function onlineCount(request, response) {
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

module.exports = {
  onlineCount: onlineCount
}