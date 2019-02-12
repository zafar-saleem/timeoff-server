'use strict';

const registerController = require('../../controllers/apis/register');
const loginController = require('../../controllers/apis/login');
const forgotController = require('../../controllers/apis/forgot');
const logoutController = require('../../controllers/apis/logout');
const dashboardController = require('../../controllers/apis/dashboard');

const adminController = require('../../controllers/apis/admin');

const employeeController = require('../../controllers/apis/employee');

const express = require('express');

let router = express.Router();

router.use('/register', registerController);
router.use('/login', loginController);
router.use('/forgot', forgotController);
router.use('/logout', logoutController);
router.use('/dashboard', dashboardController);

router.use('/admin', adminController);

router.use('/employee', employeeController);

module.exports = router;