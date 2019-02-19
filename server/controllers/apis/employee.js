'use strict';

const passport = require('passport');
const express = require('express');

const employeeService = require('../../services/employees/employee');
const detailsService = require('../../services/employees/details');
const setVacationsService = require('../../services/employees/setVacations');

let router = express.Router();

router.get('/details', passport.authenticate('jwt', { session: false }), detailsService.fetchDetails);
router.put('/details', passport.authenticate('jwt', { session: false }), detailsService.updateDetails);
router.get('/vacation', passport.authenticate('jwt', { session: false }), employeeService.fetchVacations);
router.post('/vacation', passport.authenticate('jwt', { session: false }), setVacationsService.setVacations);
router.delete('/vacation', passport.authenticate('jwt', { session: false }), employeeService.deleteVacation);

module.exports = router;