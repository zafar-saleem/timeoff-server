'use strict';

const passport = require('passport');
const express = require('express');
const dashboardService = require('../../services/dashboard/dashboard');
const totalService = require('../../services/dashboard/total');
const onlineService = require('../../services/dashboard/online');

let router = express.Router();

router.get('/count', passport.authenticate('jwt', { session: false }), totalService.employeesCount);
router.get('/online', passport.authenticate('jwt', { session: false }), onlineService.onlineCount);
router.get('/activities', passport.authenticate('jwt', { session: false }), dashboardService.fetchActivities);

module.exports = router;
