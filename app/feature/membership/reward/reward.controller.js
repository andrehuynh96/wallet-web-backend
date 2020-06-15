const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const memberMapper = require('app/feature/response-schema/member.response-schema');
const Affiliate = require('app/lib/affiliate');

module.exports = {
  getRewards: async (req, res, next) => {
    try {
      logger.info('getRewards::getRewards');
      let result = await Affiliate.getRewards({ email: req.user.email });
      return res.ok(result);
    }
    catch (err) {
      logger.error("getRewards: ", err);
      next(err);
    }
  },
  getHistorys: async (req, res, next) => {
    
  }
}
