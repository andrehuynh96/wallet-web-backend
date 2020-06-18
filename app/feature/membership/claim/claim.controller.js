const logger = require('app/lib/logger');
const claimRequestMapper = require('app/feature/response-schema/membership/claim-request.response-schema');
const claimRewardMapper = require('app/feature/response-schema/membership/claim-reward.response-schema');
const ClaimRequest = require('app/model/wallet').claim_requests;
const Affiliate = require('app/lib/affiliate');

module.exports = {
  getClaimHistories: async (req, res, next) => {
    try {
      logger.info('getHistorys::getHistorys');
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const where = { member_id: req.user.id };
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
  create: async (req, res, next) => {
    
  }
}
