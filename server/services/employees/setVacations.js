const Vacations = require('../../models/Vacations');
const utils = require('../../utils');
const httpResponses = require('./');

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

module.exports = {
  setVacations: setVacations
};