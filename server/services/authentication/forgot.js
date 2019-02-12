const Employees = require('../../models/Employees');

function forgotPassword(request, response) {
  const { password, username } = request.body;

  if (!password && !username) {
    return response.json({ success: false, message: 'Please enter username and password.' });
  }

  if (!password) {
    return response.json({ success: false, message: 'Please enter new password.' });
  }

  if (!username) {
    return response.json({ success: false, message: 'Please enter your valid username.' });
  }

  Employees.findOne({ username: username })
    .lean()
    .exec((error, doc) => {
      if (error) return response.json({success: false, message: error});
      Employees.updateOne({ username: username }, { password: password }, (err, emp) => {
        if (err) return response.json(err);
        return response.json({ success: true, message: 'Password updated successfully.' });
      });
    });
}

module.exports = {
  forgotPassword: forgotPassword
}