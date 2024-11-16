const cron = require("node-cron");
const VisitHistory = require("../models/visit.history");
const URL = require("../models/url");

const task = async () => {
  console.log(VisitHistory);

  const visitHistory = await getURLVisitHistory(
    new Date(Date.now() - 3 * 60 * 60 * 1000)
  );
  console.log(visitHistory);
  const urlHistoryMap = {};
  visitHistory.forEach((record) => {
    const { shortId, createdAt } = record;
    if (!urlHistoryMap[shortId]) {
      urlHistoryMap[shortId] = [];
    }
    urlHistoryMap[shortId].push({ timestamp: createdAt });
  });

  const shortIds = Object.keys(urlHistoryMap);
  shortIds.forEach(async (shortId) => {
    const result = await addVisitHistoryToUrl(shortId, urlHistoryMap[shortId]);
    console.log(result, "result");
  });
};

async function getURLVisitHistory(historyFrom) {
  const records = await VisitHistory.find({
    createdAt: { $gte: historyFrom },
  });

  return records;
}

async function addVisitHistoryToUrl(shortId, visitHistory) {
  try {
    const result = await URL.updateOne(
      { shortId: shortId },
      { $push: { visitHistory: { $each: visitHistory } } }
    );

    return result;
  } catch (error) {
    console.error("Error updating visitHistory:", error);
    throw error;
  }
}

cron.schedule("* * * * *", task);
