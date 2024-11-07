const express = require("express");
const analyticsController = require("../controllers/analytics");
const isAuth = require('../middleware/isAuth');
const router = express.Router();

router.get('/:shortId', isAuth, analyticsController.getURLAnalytics);

module.exports = router;