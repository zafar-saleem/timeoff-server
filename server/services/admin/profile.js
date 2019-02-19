const User = require('../../models/User');

const utils = require('../../utils');
const httpResponses = require('./');

let usernameCheck, passwordCheck;

function get(request, response) {
  if (request.query.access.toLowerCase() !== 'admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  utils.checkUserControl(request.query.id)
    .then(admin => {
      User.findOne({ _id: request.query.id })
        .lean()
        .exec((error, doc) => {
          if (error) return response.json(error);
          delete doc.password;
          return response.json(doc);
      })
    })
    .catch(error => {
      return response.json(httpResponses.onServerAdminFail);
    });
}

function update(request, response) {
  const adminProfile = {
    username: request.body.username,
    email: request.body.email,
    role: request.body.role,
    password: request.body.password
  };

  usernameCheck = request.body.username;
  passwordCheck = request.body.password;

  if (request.body.access.toLowerCase() !== 'admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  if (performUpdateProfileChecks() !== true) {
    return response.json(performUpdateProfileChecks());
  }

  if (request.body.password === '') {
    // delete adminProfile.password;
  }

  utils.checkUserControl(request.body.id)
    .then(admin => {
      User.findOneAndUpdate({ _id: request.body.id }, adminProfile)
        .lean()
        .exec((error, doc) => {
          if (error) return response.json(error);
          return response.json(httpResponses.onProfileUpdateSuccess);
      });
    })
    .catch(error => {
      return response.json(httpResponses.onServerAdminFail);
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
  get: get,
  update: update
}