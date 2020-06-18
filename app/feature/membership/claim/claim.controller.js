const logger = require('app/lib/logger');
const claimRequestMapper = require('app/feature/response-schema/membership/claim-request.response-schema');
const ClaimRequest = require('app/model/wallet').claim_requests;
const Affiliate = require('app/lib/affiliate');
const createClaimRequestMapper = require('./mapper/create.claim-request-schema.js');

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
    try {
      logger.info('claim reward::create');
     
      const dataReward = {
        amount: req.body.amount,
        currency_symbol: req.body.currency_symbol,
        email: req.user.email
      }
      let resClaimReward = await Affiliate.claimReward(dataReward);
      if(resClaimReward.httpCode !== 200) {
        return res.status(resClaimReward.httpCode).send(resClaimReward.data);
      }
      const where = { id: req.body.member_account_id};
      const memberAccount = await MemberAccount.findOne({where: where});
      let claimObject = {
        ...createClaimRequestMapper(memberAccount),
      }

      claimObject. member_account_id = memberAccount.id,
      
      claimObject.amount = req.body.amount;
  
      claimObject.affiliate_claim_reward_id = resClaimReward.data.id;
      claimObject.status = resClaimReward.data.status;
      const result = await ClaimRequest.create(claimObject);
      return res.ok(result);
    }
    catch (err) {
      logger.error("getMemberAccount: ", err);
      next(err);
    }
  }
}
