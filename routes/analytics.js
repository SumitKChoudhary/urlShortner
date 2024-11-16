const express = require("express");
const analyticsController = require("../controllers/analytics");
const isAuth = require('../middleware/isAuth');
const router = express.Router();

router.get('/shortenedURL',isAuth,analyticsController.getShortenedURL);

router.get('/:shortId', isAuth, analyticsController.getURLAnalytics);



module.exports = router;