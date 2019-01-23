'use strict';

const passport = require('passport');
const express = require('express');

const adminService = require('../../services/admin/admin');

let router = express.Router();

router.post('/new', passport.authenticate('jwt', { session: false }), adminService.save);
router.get('/list', passport.authenticate('jwt', { session: false }), adminService.fetchEmployees);
// router.get('/count', passport.authenticate('jwt', { session: false }), adminService.fetchEmployeesCount);
// router.get('/online', passport.authenticate('jwt', { session: false }), adminService.fetchOnlineEmployees);

module.exports = router;