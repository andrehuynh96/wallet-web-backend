const logger = require('app/lib/logger');
const Affiliate = require('app/lib/reward-system/affiliate');
const Member = require('app/model/wallet').members;

module.exports = {
  getRewards: async (req, res, next) => {
    try {
      logger.info('getRewards::getRewards');
      let member = await Member.findOne({ where: { id: req.user.id } });
      let result = await Affiliate.getRewards({ email: member.email });
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
      let member = await Member.findOne({ where: { id: req.user.id } });
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let result = await Affiliate.getRewardHistories({ email: member.email, offset: offset, limit: limit });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("getHistorys: ", err);
      next(err);
    }
  }
}