'use strict';

const express = require('express');
const apiRoutes = express.Router();

const Employees = require('../../models/Employees');
const User = require('../../models/User');
const Activities = require('../../models/Activities');

const utils = require('../../utils');
const httpResponses = require('./');

let user, activity, usernameCheck, role, passwordCheck;

module.exports = {
};
