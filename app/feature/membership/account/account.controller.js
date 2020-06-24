const logger = require('app/lib/logger');
const rewardMapper = require('app/feature/response-schema/membership/reward.response-schema');
const MemberAccount = require('app/model/wallet').member_accounts;

module.exports = {
  get: async (req, res, next) => {
    try {

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
      let result = await Affiliate.getRewardHistorys({ email: _member.email, offset: offset, limit: limit });
      return res.status(result.httpCode).send(result.data);
    }
    catch (err) {
      logger.error("getHistorys: ", err);
      next(err);
    }
  }
}