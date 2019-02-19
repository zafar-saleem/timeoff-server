const Employees = require('../../models/Employees');

function fetchDetails(request, response) {
  const employeeID = request.query.employeeID;

  Employees.findOne({ _id: employeeID }, (error, doc) => {
    if (error) response.json(error);

    const employee = doc.toObject();

    delete employee.password;

    response.json(employee);
  });
}

module.exports = {
  fetchDetails: fetchDetails
};