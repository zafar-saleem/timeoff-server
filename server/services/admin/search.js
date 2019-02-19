const Employees = require('../../models/Employees');

const utils = require('../../utils');
const httpResponses = require('./');

function search(request, response) {
  if (request.body.access.toLowerCase() !== 'admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  utils.checkUserControl(request.body.id)
    .then(admin => {
      let search = request.body.search;
      let regex = new RegExp(search,'i');

      Employees.find({ $or: [ { username: regex }] }, (error, docs) => {
        if (error) return response.json(error);
        return response.json(docs)
      });
    })
    .catch(error => {
      return response.json(httpResponses.onServerAdminFail);
    });
}

module.exports = {
  search: search
};