'use strict';

const passport = require('passport');
const express = require('express');

const employeeService = require('../../services/employees/employee');

let router = express.Router();

router.get('/details', passport.authenticate('jwt', { session: false }), employeeService.fetchDetails);
router.put('/details', passport.authenticate('jwt', { session: false }), employeeService.updateDetails);
router.post('/vacation', passport.authenticate('jwt', { session: false }), employeeService.setVacations);
router.get('/vacation', passport.authenticate('jwt', { session: false }), employeeService.fetchVacations);

module.exports = router;