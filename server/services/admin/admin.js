'use strict';

const express = require('express');
const apiRoutes = express.Router();

const Employees = require('../../models/Employees');
const User = require('../../models/User');
const Activities = require('../../models/Activities');

const utils = require('../../utils');
const httpResponses = require('./');

let user, activity, usernameCheck, role, passwordCheck;

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
  profile: profile,
  updateProfile: updateProfile
};
