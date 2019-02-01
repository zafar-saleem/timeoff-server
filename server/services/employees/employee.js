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
  },
  onVacationExist: {
    success: false,
    message: 'You already setup vacation on this date'
  }
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let user, activity;

function fetchDetails(request, response) {
  console.log(request.query);
  const employeeID = request.query.employeeID;

  Employees.findOne({ _id: employeeID }, (error, doc) => {
    if (error) response.json(error);

    const employee = doc.toObject();

    delete employee.password; 

    console.log(employee);

    response.json(employee);
  });
}

function updateDetails(request, response) {
  utils.checkUserControl(request.body.admin.id)
    .then(admin => {
      let query = {
        _id: request.body._id
      };

      if (request.body.password === '') {
        return response.json({ success: false, message: 'Please enter new or old password' });
      }

      let record = {
        name: request.body.name,
        position: request.body.position,
        username: request.body.username,
        password: request.body.password
      };

      if (request.body.admin.access === 'Admin') {
        record['role'] = request.body.role;
      }

      Employees.findOneAndUpdate(query, record, { new: true }, (error, doc) => {
        if (error) response.json(error);

        user = record.username;
        activity = `${admin} updated their details.`,
        setActivity();
        user = null;

        response.json(httpResponses.onUpdateSuccess);
      });
    })
    .catch(error => {
      response.json(error);
    });
}

function setVacations(request, response) {
  Vacations.findOne({
    start: request.body.start
  }, (error, doc) => {
    if (error) return response.json(error);
    if (doc) return response.json(httpResponses.onVacationExist);

    new Vacations(request.body).save((error, doc) => {
      if (error) return response.json(error);

      getUser(request.body.employeeID)
        .then(name => {
          activity = `${name} set vacations`,
          user = name;
          setActivity();

          user = null;
        }).catch(err => {
          return response.json(err);
        });

      return response.json(httpResponses.onSetVacationSuccess);
    });
  });
}

function fetchVacations(request, response) {
  Vacations.find({ employeeID: request.query.id }).lean().exec((error, docs) => {
    if (error) return response.json(error);
    formatDates(docs).then(item => {
      return response.json(docs);
    });
  });
}

function formatDates(vacations) {
  return new Promise((resolve, reject) => {
    let dates = vacations.map(item => {
      item['startDate'] = null;
      item['endDate'] = null;

      const startDate = new Date(item.start);

      const startDay = startDate.getDate();
      const startMonth = months[startDate.getMonth()];
      const startYear = startDate.getFullYear();

      const endDate = new Date(item.end);

      const endDay = endDate.getDate();
      const endMonth = months[endDate.getMonth()];
      const endYear = endDate.getFullYear();

      item['start'] = startMonth + ' ' + startDay + ', ' + startYear;
      item['end'] = endMonth + ' ' + endDay + ', ' + endYear;

      return item;
    });

    resolve(dates);
  });
}

function deleteVacation(request, response) {
  Vacations.findOneAndDelete({ _id: request.body.id }, (error, docs) => {
    if (error) return response.json(error);

    Vacations.find({ employeeID: request.body.employeeID }, (error, docs) => {
      if (error) return response.json(error);

      getUser(request.body.employeeID)
        .then(name => {
          activity = `${name} deleted vacation`,
          user = name;
          setActivity();

          user = null;
        }).catch(err => {
          return response.json(err);
        });

      return response.json(docs);
    });
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
  setVacations: setVacations,
  fetchVacations: fetchVacations,
  deleteVacation: deleteVacation
};
