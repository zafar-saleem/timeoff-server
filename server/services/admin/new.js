const Employees = require('../../models/Employees');
const Activities = require('../../models/Activities');

const utils = require('../../utils');
const httpResponses = require('./');

function save(request, response) {
  const { name, role, position, username, password, email } = request.body;
  user = username;
  usernameCheck = username;
  passwordCheck = password;

  if (request.body.admin.access !== 'Admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  if (performUpdateProfileChecks() !== true) {
    return response.json(performUpdateProfileChecks());
  }
  
  utils.checkUserControl(request.body.admin.id)
    .then(user => {
      let employee = new Employees({ name, email, role, position, username, password, status: false, active: true });

      employee.save(error => {
        if (error) return response.json(error);

        activity = `Admin created ${request.body.name}`;

        utils.setActivity(request.body.name, activity);

        return response.json(httpResponses.employeeAddedSuccessfully);
      });
    }).catch(error => {
      return response.json(error);
    });
}

function performUpdateProfileChecks() {
  if (passwordCheck === '' && usernameCheck === '') {
    return httpResponses.onProfileUpdatePasswordCheckUserEmpty;
  }

  if (passwordCheck === '') {
    return httpResponses.onProfileUpdatePasswordEmpty;
  }

  if (usernameCheck === '') {
    return httpResponses.onProfileUpdateUsernameEmpty;
  }

  return true;
}

module.exports = {
  save: save
};