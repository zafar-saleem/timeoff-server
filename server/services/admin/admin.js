'use strict';

const express = require('express');
const apiRoutes = express.Router();

const Employees = require('../../models/Employees');
const User = require('../../models/User');
const Activities = require('../../models/Activities');

const utils = require('../../utils');
const httpResponses = require('./');

let user, activity, usernameCheck, role, passwordCheck;

function save(request, response) {
  const { name, role, position, username, password } = request.body;
  user = username;
  usernameCheck = username;
  passwordCheck = password;

  if (request.body.admin.access === 'Admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  if (performUpdateProfileChecks() !== true) {
    return response.json(performUpdateProfileChecks());
  }
  
  utils.checkUserControl(request.body.admin.id)
    .then(user => {
      let employee = new Employees({ name, role, position, username, password, status: false, active: true });

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

function fetchEmployees(request, response) {
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

function deactivate(request, response) {
  if (request.body.admin.access !== 'Admin') {
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
  // const { username, role, password } = request.body;
  username = request.body.username;
  role = request.body.role;
  password = request.body.password;

  if (request.body.access !== 'Admin') {
    return response.json(httpResponses.clientAdminFailed);
  }

  if (performUpdateProfileChecks() !== true) {
    return response.json(performUpdateProfileChecks());
  }

  utils.checkUserControl(request.body.id)
    .then(admin => {
      User.findOneAndUpdate({ _id: request.body.id }, {username, role, password})
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
  save: save,
  fetchEmployees: fetchEmployees,
  deactivate: deactivate,
  search: search,
  profile: profile,
  updateProfile: updateProfile
};
