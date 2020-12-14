const crypto = require('crypto');
const redis = require("app/lib/redis");
const cache = redis.client();
const secret = "MS_CACHE";

module.exports = (duration) => {
  return async (req, res, next) => {
    let url = req.originalUrl || req.url;
    const key = url.replace('/web','');
    const keyHash = crypto.createHmac('sha256', secret)
      .update(key)
      .digest('hex');

    let cacheContent = await cache.getAsync(keyHash);
    if (cacheContent) {
      res.send(JSON.parse(cacheContent));
      return;
    } else {
      res.sendResponse = res.send;
      res.send = async (body) => {
        await cache.setAsync(keyHash, JSON.stringify(body), "EX", duration * 60);
        res.sendResponse(body);
      }
      next();
    }
  }
}
