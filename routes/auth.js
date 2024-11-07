const express = require('express');

const router = express.Router();
const isAuth = require('../middleware/isAuth');

const authController = require('../controllers/auth');

router.post('/signup',isAuth,authController.signup);

router.post('/login', authController.login);

module.exports = router;