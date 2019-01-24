'use strict';

const passport = require('passport');
const express = require('express');

const adminService = require('../../services/admin/admin');

let router = express.Router();

router.post('/new', passport.authenticate('jwt', { session: false }), adminService.save);
router.get('/list', passport.authenticate('jwt', { session: false }), adminService.fetchEmployees);

module.exports = router;