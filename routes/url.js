const express =  require("express");

const urlController = require("../controllers/url")

const router = express.Router();

router.post("/",urlController.generateShortURL);
router.get("/:shortId",urlController.redirectToOriginalURL);

module.exports = router;