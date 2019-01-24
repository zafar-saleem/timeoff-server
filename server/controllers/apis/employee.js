'use strict';

const passport = require('passport');
const express = require('express');

const employeeService = require('../../services/employees/employee');

let router = express.Router();

router.get('/details', passport.authenticate('jwt', { session: false }), employeeService.fetchDetails);
router.put('/details', passport.authenticate('jwt', { session: false }), employeeService.updateDetails);

module.exports = router;