module.exports = {
  clientAdminFailed: {
    success: false,
    message: 'Tried to access admin area from the client side. Only Admin can access this page'
  },
  onServerAdminFail: {
    success: false,
    message: 'This is for admin users only'
  },
  employeeAddedSuccessfully: {
    success: true,
    message: 'New employee added successfully'
  },
  onProfileUpdateSuccess: {
    success: true,
    message: 'Your profile updates successfully.'
  },
  onProfileUpdatePasswordEmpty: {
    success: false,
    message: 'Please enter password.'
  },
  onProfileUpdateUsernameEmpty: {
    success: false,
    message: 'Please enter username.'
  },
  onProfileUpdatePasswordUserEmpty: {
    success: false,
    message: 'Please enter username and old or new password.'
  }
}
