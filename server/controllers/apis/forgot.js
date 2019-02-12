'use strict';

const express = require('express');
const forgotService = require('../../services/authentication/forgot');

let router = express.Router();

router.post('/', forgotService.forgotPassword);

module.exports = router;