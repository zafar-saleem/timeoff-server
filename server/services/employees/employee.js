const Employees = require('../../models/Employees');

const utils = require('../../utils');

function fetchDetails(request, response) {
  const employeeID = request.query.id;

  Employees.findOne({ _id: employeeID }, (error, doc) => {
    if (error) response.json(error);

    const employee = doc.toObject();

    delete employee.password;

    response.json(employee);
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

  if (request.body.admin.access === 'Admin') {
    utils.checkUserControl(request.body.admin.id)
      .then(user => {
        Employees.findOneAndUpdate({ _id: request.body._id }, record, { new: true }, (error, doc) => {
          if (error) response.json(error);
          response.json({ success: true, message: 'Details updated successfully' });
        });
      })
      .catch(error => {
        response.json(error);
      });
  } else {
    response.json({ success: false, message: 'Client is not admin' });
  }
}

module.exports = {
  fetchDetails: fetchDetails,
  updateDetails: updateDetails
};