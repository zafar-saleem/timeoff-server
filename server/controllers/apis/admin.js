'use strict';

const passport = require('passport');
const express = require('express');

const adminService = require('../../services/admin/admin');

let router = express.Router();

router.post('/', passport.authenticate('jwt', { session: false }), adminService.save);
router.get('/', passport.authenticate('jwt', { session: false }), adminService.fetchEmployees);

module.exports = router;