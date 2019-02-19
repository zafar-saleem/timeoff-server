const Employees = require('../../models/Employees');

const utils = require('../../utils');
const httpResponses = require('./');

function list(request, response) {
  if (request.query.access !== 'Admin') {
    return response.json(httpResponses.clientAdminFailed);
  }
  
  let sortBy;

  if (request.query.order === 'asc') {
    sortBy = `-${request.query.sortBy}`;
  } else {
    sortBy = request.query.sortBy;
  }

  utils.checkUserControl(request.query.id)
    .then(user => {
      Employees.find({}, null)
        .sort(sortBy)
        .exec((error, docs) => {
          if (error) return response.json(error);

          let updatedDocument = docs.map(doc => {
            let documentToObject = doc.toObject();

            delete documentToObject.password;

            return documentToObject;
          });

          return response.json(updatedDocument);
      });
    })
    .catch(error => {
      return response.json(httpResponses.onServerAdminFail);
    });
}

module.exports = {
  list: list
}