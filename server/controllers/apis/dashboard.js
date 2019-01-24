'use strict';

const passport = require('passport');
const express = require('express');
const dashboardService = require('../../services/dashboard/dashboard');

let router = express.Router();

router.get('/count', passport.authenticate('jwt', { session: false }), dashboardService.fetchEmployeesCount);
router.get('/online', passport.authenticate('jwt', { session: false }), dashboardService.fetchOnlineEmployees);
router.get('/activities', passport.authenticate('jwt', { session: false }), dashboardService.fetchActivities);

module.exports = router;
