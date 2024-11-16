const URL = require("../models/url");
const VisitHistory = require("../models/visit.history");

const redisClient = require("../redis.client");

exports.getURLAnalytics = async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const cachedTime = new Date(Date.now() - 3600000);
    let urlAnalytics = [];
    if (endDate > cachedTime) {
      let visitHistoryData = await VisitHistory.find({
        createdAt: {
          $gte: cachedTime,
          $lte: endDate,
        },
      });

      visitHistoryData = visitHistoryData.map((entry) => ({
        timestamp: entry.createdAt,
        _id: entry._id,
      }));

      urlAnalytics.push(...visitHistoryData);
    }

    const visitHistoryData = await URL.findOne({
      shortId,
      visitHistory: {
        $elemMatch: {
          timestamp: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
    });

    if (!visitHistoryData) {
      const error = new Error("URL not found.");
      error.statusCode = 404;
      throw error;
    }
    urlAnalytics.push(...visitHistoryData.visitHistory);

    res.status(200).json({
      totalClick: urlAnalytics.length,
      analytics: urlAnalytics,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getShortenedURL = async (req, res, next) => {
  const user = req.userId;
  const cacheKey = `url:${user}`;

  try {
    const cachedValue = await redisClient.get(cacheKey);
    if (cachedValue) {
      return res.status(200).json({ connectedURL: JSON.parse(cachedValue) });
    }

    const urlList = await URL.find({ creator: user }).select("shortId");
    if (urlList.length > 0) {
      await redisClient.setex(cacheKey, 3600, JSON.stringify(urlList));
    }

    res.status(200).json({ connectedURL: urlList });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
