const logger = require('app/lib/logger');
const Affiliate = require('app/lib/reward-system/affiliate');

module.exports = {
  getRewards: async (req, res, next) => {
    try {
      logger.info('getRewards::getRewards');
      let result = await Affiliate.getRewards({ email: req.user.email });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("getRewards: ", err);
      next(err);
    }
  },
  getRewardHistorys: async (req, res, next) => {
    try {
      logger.info('getHistorys::getHistorys');
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let result = await Affiliate.getRewardHistories({ email: req.user.email, offset: offset, limit: limit });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("getHistorys: ", err);
      next(err);
    }
  },
  statistics: async (req, res, next) => {
    try {
      let result = await Affiliate.getAffiliateStatistics({ email: req.user.email });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("statistics: ", err);
      next(err);
    }
  }
}