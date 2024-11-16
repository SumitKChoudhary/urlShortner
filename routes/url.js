const express =  require("express");

const urlController = require("../controllers/url");
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.post('/',isAuth,urlController.generateShortURL);
router.get('/:shortId',urlController.redirectToOriginalURL);

module.exports = router;