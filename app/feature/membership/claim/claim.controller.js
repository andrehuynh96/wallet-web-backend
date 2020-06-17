const logger = require('app/lib/logger');
const claimRequestMapper = require('app/feature/response-schema/claim-request.response-schema');
const claimRewardMapper = require('app/feature/response-schema/claim-reward.response-schema');
const ClaimRequest = require('app/model/wallet').claim_requests;
const Affiliate = require('app/lib/affiliate');

module.exports = {
  getClaimHistorys: async (req, res, next) => {
    try {
      logger.info('getHistorys::getHistorys');
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const where = { email: req.user.email };
      const { count: total, rows: claimRequests } = await ClaimRequest.findAndCountAll({offset: offset, limit: limit, where: where});
      return res.ok({
        items: claimRequestMapper(claimRequests),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error("getHistorys: ", err);
      next(err);
    }
  },
  getClaimRewards: async (req, res, next) => {
    try {
      logger.info('getClaimRewards::getClaimRewards');
      let results = await Affiliate.getClaimReward({ email: req.user.email, currency_symbol: req.body.currency_symbol });
      return res.ok({
        items: claimRewardMapper(results.items),
        offset: results.offset,
        limit: results.limit,
        total: results.total
      });
    }
    catch (err) {
      logger.error("getClaimRewards: ", err);
      next(err);
    }
  },
  create: async (req, res, next) => {
    
  }
}
