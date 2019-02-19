'use strict';

const passport = require('passport');
const express = require('express');

const adminService = require('../../services/admin/admin');
const newService = require('../../services/admin/new');
const listService = require('../../services/admin/list');
const deactivateService = require('../../services/admin/deactivate');
const searchService = require('../../services/admin/search');

let router = express.Router();

router.get('/list', passport.authenticate('jwt', { session: false }), listService.list);
router.get('/profile', passport.authenticate('jwt', { session: false }), adminService.profile);

router.post('/new', passport.authenticate('jwt', { session: false }), newService.save);
router.post('/deactivate', passport.authenticate('jwt', { session: false }), deactivateService.deactivate);
router.post('/search', passport.authenticate('jwt', { session: false }), searchService.search);

router.put('/update', passport.authenticate('jwt', { session: false }), adminService.updateProfile);

module.exports = router;