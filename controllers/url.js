const shortid = require("shortid");

const URL = require("../models/url");
const User = require("../models/user");
const VisitHistory = require("../models/visit.history");
const {
  addDataToLfuCache,
  getDataFromLfuCache,
} = require("../redis.client");

exports.generateShortURL = async (req, res, next) => {
  try {
    const shortId = shortid(10);
    const redirectUrl = req.body.url;
    
    if (!redirectUrl) {
      const error = new Error("URL required");
      error.statusCode = 400;
      throw error;
    }

    const url = new URL({
      shortId: shortId,
      redirectUrl: redirectUrl,
      creator: req.userId,
      visitHistory: [],
    });
    
    const savedUrl = await url.save();
    const creator = await User.findById(req.userId);

    if (!creator) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    creator.url.push(savedUrl);
    await creator.save();

    res.status(201).json({
      message: "URL shortened successfully",
      url: savedUrl,
      creator: { _id: creator._id, name: creator.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.redirectToOriginalURL = async (req, res, next) => {
  const shortId = req.params.shortId;
  try {
    let redirectUrl = await getDataFromLfuCache(shortId, 'url_lfu_cache', 10);
    if (!redirectUrl) {
      const urlData = await URL.findOne({ shortId });
      redirectUrl = urlData.redirectUrl;
      await addDataToLfuCache(shortId, redirectUrl, 'url_lfu_cache', 10);
    }
    const visitHistory = new VisitHistory({
      shortId: shortId
    });

    await visitHistory.save();
    return res.redirect(redirectUrl);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

