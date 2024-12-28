/// check if user is login then create a jwt token and send it to the user


const jwt = require('jsonwebtoken');
const User = require('../models/user.Model');
const errorHandler = require('../utils/error.handler');

