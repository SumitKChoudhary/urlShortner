const {Redis} = require("ioredis");

const redisClient = new Redis();

async function addDataToLfuCache(cacheKey,cacheValue,lfuCacheKey,cacheSizeLimit) {
  
  await redisClient.zadd(lfuCacheKey, 1, cacheKey);
  await redisClient.setex(cacheKey, 3600, cacheValue); 
  await ensureCacheSize(lfuCacheKey,cacheSizeLimit);
}

async function getDataFromLfuCache(cacheKey,lfuCacheKey) {

  const cacheValue = await redisClient.get(cacheKey);
  
  if (cacheValue) {
    await redisClient.zincrby(lfuCacheKey, 1, cacheKey);
    return cacheValue;
  } else {
    return null;
  }
}

async function ensureCacheSize(lfuCacheKey,cacheSizeLimit) {
  const cacheSize = await redisClient.zcard(lfuCacheKey);

  if (cacheSize > cacheSizeLimit) {
    const leastUsed = await redisClient.zrange(lfuCacheKey, 0, 0);
    if (leastUsed.length > 0) {
      const dataToEvict = leastUsed[0];
      await redisClient.del(dataToEvict); 
      await redisClient.zrem(lfuCacheKey, dataToEvict); 
    }
  }
}

module.exports = {redisClient,addDataToLfuCache,getDataFromLfuCache};