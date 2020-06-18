const logger = require('app/lib/logger');
const rewardMapper = require('app/feature/response-schema/membership/reward.response-schema');
const rewardHistoryMapper = require('app/feature/response-schema/membership/reward-history.response-schema');
const Affiliate = require('app/lib/affiliate');

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
      let result = await Affiliate.getRewardHistorys({ email: req.user.email , offset: offset, limit: limit });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("getHistorys: ", err);
      next(err);
    }
  }
}
