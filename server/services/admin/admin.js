'use strict';

const express = require('express');
const apiRoutes = express.Router();

const Employees = require('../../models/Employees');
const User = require('../../models/User');
const Activities = require('../../models/Activities');

const utils = require('../../utils');
const httpResponses = require('./');

let user, activity, usernameCheck, role, passwordCheck;

// function deactivate(request, response) {
//   if (request.body.admin.access !== 'Admin') {
//     return response.json(httpResponses.clientAdminFailed);
//   }

//   utils.checkUserControl(request.body.admin.id)
//     .then(admin => {
//       Employees.updateOne({ _id: request.body.id }, {
//         active: false
//       }, (error, doc) => {
//         if (error) response.json(error);

//         utils.getUser(request.body.id)
//           .then(user => {
//             activity = `Admin deactivated ${user}`;

//             utils.setActivity(user, activity);

//             response.json({ success: true, message: 'User Deactivated' });
//           })
//           .catch(error => {
//             console.log(error);
//           });
//       });
//     })
//     .catch(error => {
//       response.json(httpResponses.onServerAdminFail);
//     });
// }

function search(request, response) {
  if (request.body.access !== 'Admin') {
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

function profile(request, response) {
  if (request.query.access !== 'Admin') {
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

function updateProfile(request, response) {
  const adminProfile = {
    username: request.body.username,
    email: request.body.email,
    role: request.body.role,
    password: request.body.password
  };

  usernameCheck = request.body.username;
  passwordCheck = request.body.password;

  if (request.body.access !== 'Admin') {
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
  // deactivate: deactivate,
  search: search,
  profile: profile,
  updateProfile: updateProfile
};
