const Employees = require('../../models/Employees');
const Activities = require('../../models/Activities');
const Vacations = require('../../models/Vacations');

const utils = require('../../utils');

const httpResponses = {
  onUpdateSuccess: {
    success: true,
    message: 'Details updated successfully'
  },
  onClientAdminFail: {
    success: false,
    message: 'Client is not admin'
  },
  onServerAdminFail: {
    success: false,
    message: 'This area is for admin only'
  },
  onSetVacationSuccess: {
    success: true,
    message: 'Your vacations set successfully.'
  }
};

let user, activity;

function fetchDetails(request, response) {
  const employeeID = request.query.employeeID;

  if (request.query.access !== 'Admin') {
    return response.json(httpResponses.onClientAdminFail);
  }

  utils.checkUserControl(request.query.id)
    .then(user => {
      Employees.findOne({ _id: employeeID }, (error, doc) => {
        if (error) response.json(error);

        const employee = doc.toObject();

        delete employee.password; 

        response.json(employee);
      });
    })
    .catch(error => {
      response.json(httpResponses.onServerAdminFail);
    });
}

function updateDetails(request, response) {
  let record = {
    name: request.body.name,
    role: request.body.role,
    position: request.body.position,
    username: request.body.username,
    password: request.body.password,
    status: false
  };

  user = record.username;

  if (request.body.admin.access === 'Admin') {
    utils.checkUserControl(request.body.admin.id)
      .then(admin => {
        let query = {
          _id: request.body._id
        };

        Employees.findOneAndUpdate(query, record, { new: true }, (error, doc) => {
          if (error) response.json(error);

          activity = `${admin} updated their details.`,
          setActivity();
          user = null;

          response.json(httpResponses.onUpdateSuccess);
        });
      })
      .catch(error => {
        response.json(error);
      });
  } else {
    response.json(httpResponses.onClientAdminFail);
  }
}

function setVacations(request, response) {
  new Vacations(request.body).save((error, doc) => {
    if (error) response.json(error);

    getUser(request.body.employeeID)
      .then(name => {
        activity = `${name} set vacations`,
        user = name;
        setActivity();

        user = null;
      }).catch(err => {
        response.json(err);
      });

    response.json(httpResponses.onSetVacationSuccess);
  });
}

function getUser(id) {
  return new Promise((resolve, reject) => {
    Employees.findOne({ _id: id }, (error, user) => {
      if (error) reject(error);
      resolve(user.name);
    });
  });
}

function setActivity() {
  new Activities({
    username: user,
    activity: activity,
    date: new Date()
  }).save();
}

module.exports = {
  fetchDetails: fetchDetails,
  updateDetails: updateDetails,
  setVacations: setVacations
};
