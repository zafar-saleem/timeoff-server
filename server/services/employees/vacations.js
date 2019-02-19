const Employees = require('../../models/Employees');
const Activities = require('../../models/Activities');
const Vacations = require('../../models/Vacations');

const utils = require('../../utils');
const httpResponses = require('./');

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let user, activity;

function setVacations(request, response) {
  const { start, end, employeeID } = request.body;

  const condition = {
    start: { $gte: start },
    end: { $lte: end },
    employeeID: employeeID
  };

  Vacations.findOne(condition, (error, doc) => {
    if (error) return response.json(error);
    if (doc) return response.json(httpResponses.onVacationExist);

    new Vacations(request.body).save((error, doc) => {
      if (error) return response.json(error);

      utils.getUser(request.body.employeeID)
        .then(name => {
          activity = `${name} set vacations`;
          utils.setActivity(name, activity);

          user = null;
        }).catch(err => {
          return response.json(err);
        });

      return response.json(httpResponses.onSetVacationSuccess);
    });
  });
}

function fetchVacations(request, response) {
  Vacations.find({ employeeID: request.query.id })
    .sort('-createdAt')
    .lean()
    .exec((error, docs) => {
      if (error) return response.json(error);
      checkExpiredVacations(docs)
        .then(item => {
          formatDates(item)
            .then(dates => {
              return response.json(docs);
            });
        })
  });
}

function formatDates(vacations) {
  return new Promise((resolve, reject) => {
    let dates = vacations.map(item => {
      const startDate = new Date(item.start);

      const startDay = startDate.getDate();
      const startMonth = months[startDate.getMonth()];
      const startYear = startDate.getFullYear();

      const endDate = new Date(item.end);

      const endDay = endDate.getDate();
      const endMonth = months[endDate.getMonth()];
      const endYear = endDate.getFullYear();

      item['start'] = `${startMonth} ${startDay}, ${startYear}`;
      item['end'] = `${endMonth} ${endDay}, ${endYear}`;

      return item;
    });

    resolve(dates);
  });
}

function checkExpiredVacations(dates) {
  let index = 0;
  return new Promise((resolve, reject) => {
    const today = new Date();
    let date = dates.map(date => {
      index++;
      if (date.start < today) {
        date['expire'] = true;
        return date
      }

      return date;
    });

    if (index === dates.length) {
      resolve(date);
    }
  });
}

function deleteVacation(request, response) {
  Vacations.findOneAndDelete({ _id: request.body.id }, (error, docs) => {
    if (error) return response.json(error);

    Vacations.find({ employeeID: request.body.employeeID }, (error, doc) => {
      if (error) return response.json(error);

      utils.getUser(request.body.employeeID)
        .then(name => {
          activity = `${name} deleted vacation`;
          utils.setActivity(name, activity);
        }).catch(err => {
          return response.json(err);
        });

      return response.json(httpResponses.onVacationDelete);
    });
  });
}

module.exports = {
  setVacations: setVacations,
  fetchVacations: fetchVacations,
  deleteVacation: deleteVacation
};
