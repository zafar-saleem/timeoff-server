'use strict';

const passport = require('passport');
const express = require('express');

const adminService = require('../../services/admin/admin');

let router = express.Router();

router.post('/new', passport.authenticate('jwt', { session: false }), adminService.save);
router.get('/list', passport.authenticate('jwt', { session: false }), adminService.fetchEmployees);
router.post('/deactivate', passport.authenticate('jwt', { session: false }), adminService.deactivate);
router.post('/search', passport.authenticate('jwt', { session: false }), adminService.search);
router.get('/profile', passport.authenticate('jwt', { session: false }), adminService.profile);
router.put('/update', passport.authenticate('jwt', { session: false }), adminService.updateProfile);

module.exports = router;