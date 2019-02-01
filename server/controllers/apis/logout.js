'use strict';

const express = require('express');
const logoutService = require('../../services/authentication/logout');

let router = express.Router();

router.post('/', logoutService.logoutUser);

module.exports = router;