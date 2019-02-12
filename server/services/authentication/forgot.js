const Employees = require('../../models/Employees');
const httpResponses = require('./');

function forgotPassword(request, response) {
  const { password, username } = request.body;

  if (!password && !username) {
    return response.json(httpResponses.onUserPassEmpty);
  }

  if (!password) {
    return response.json(httpResponses.onPassEmpty);
  }

  if (!username) {
    return response.json(httpResponses.onUsernameEmpty);
  }

  Employees.findOne({ username: username })
    .lean()
    .exec((error, doc) => {
      if (error) return response.json({success: false, message: error});
      Employees.updateOne({ username: username }, { password: password }, (err, emp) => {
        if (err) return response.json(err);
        return response.json(httpResponses.onPasswordUpdateSuccess);
      });
    });
}

module.exports = {
  forgotPassword: forgotPassword
}