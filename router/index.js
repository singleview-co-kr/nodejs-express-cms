const express = require('express');
const router = express.Router();

const main = require('./main/main');
const register = require('./register/register');
const login = require('./login/login');
const modify = require('./modify/modify');
const logout = require('./logout/logout');

router.use('/', main);
router.use('/register', register);
router.use('/login', login);
router.use('/modify', modify);
router.use('/logout', logout);

module.exports = router