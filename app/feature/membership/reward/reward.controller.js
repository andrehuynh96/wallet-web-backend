const logger = require('app/lib/logger');
const rewardMapper = require('app/feature/response-schema/membership/reward.response-schema');
const rewardHistoryMapper = require('app/feature/response-schema/membership/reward-history.response-schema');
const Membership = require('app/lib/reward-system/membership');
const Member = require('app/model/wallet').members;

module.exports = {
  getRewards: async (req, res, next) => {
    try {
      logger.info('getRewards::getRewards');
      const _member = await Member.findOne({ where: { id: req.user.id } });
      let result = await Membership.getRewards({ email: _member.email });
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
      const _member = await Member.findOne({ where: { id: req.user.id } });
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let result = await Membership.getRewardHistories({ email: _member.email, offset: offset, limit: limit });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("getHistorys: ", err);
      next(err);
    }
  }
}