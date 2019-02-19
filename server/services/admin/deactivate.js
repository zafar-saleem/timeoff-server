const Employees = require('../../models/Employees');

const utils = require('../../utils');
const httpResponses = require('./');

function deactivate(request, response) {
  if (request.body.admin.access.toLowerCase() !== 'admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  utils.checkUserControl(request.body.admin.id)
    .then(admin => {
      Employees.updateOne({ _id: request.body.id }, {
        active: false
      }, (error, doc) => {
        if (error) response.json(error);

        utils.getUser(request.body.id)
          .then(user => {
            activity = `Admin deactivated ${user}`;

            utils.setActivity(user, activity);

            response.json({ success: true, message: 'User Deactivated' });
          })
          .catch(error => {
            console.log(error);
          });
      });
    })
    .catch(error => {
      response.json(httpResponses.onServerAdminFail);
    });
}

module.exports = {
  deactivate: deactivate
}