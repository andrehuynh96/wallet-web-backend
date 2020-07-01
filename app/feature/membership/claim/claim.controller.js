const logger = require('app/lib/logger');
const claimRequestMapper = require('app/feature/response-schema/membership/claim-request.response-schema');
const ClaimRequest = require('app/model/wallet').claim_requests;
const Membership = require('app/lib/reward-system/membership');

const createClaimRequestMapper = require('./mapper/create.claim-request-schema');
const MemberAccount = require('app/model/wallet').member_accounts;
const Member = require('app/model/wallet').members;
const database = require('app/lib/database').db().wallet;

const ClaimRequestStatus = require('app/model/wallet/value-object/claim-request-status');

module.exports = {
  getClaimHistories: async (req, res, next) => {
    try {
      logger.info('getHistorys::getHistorys');
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const where = { member_id: req.user.id };
      const { count: total, rows: claimRequests } = await ClaimRequest.findAndCountAll({ offset: offset, limit: limit, where: where });
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
    let transaction;
    try {
      logger.info('claim reward::create');
      const _member = await Member.findOne({ where: { id: req.user.id } });

      const where = { id: req.body.member_account_id };
      const memberAccount = await MemberAccount.findOne({ where: where });
      let claimObject = {
        ...createClaimRequestMapper(memberAccount),
      }

      claimObject.member_account_id = memberAccount.id;
      claimObject.amount = req.body.amount;
      claimObject.status = ClaimRequestStatus.Pending;

      transaction = await database.transaction();
      let _resultCreateData = await ClaimRequest.create(claimObject, { transaction });

      const dataReward = {
        amount: req.body.amount,
        currency_symbol: req.body.currency_symbol,
        email: _member.email
      }

      //call api update claimreward and get affiliate_claim_reward_id
      const resClaimReward = await Membership.claimReward(dataReward);

      if (resClaimReward.httpCode !== 200) {
        await transaction.rollback();
        return res.status(resClaimReward.httpCode).send(resClaimReward.data);
      }

      let [_, response] = await ClaimRequest.update(
        {
          affiliate_claim_reward_id: resClaimReward.data.data.id
        },
        {
          where: {
            id: _resultCreateData.id
          },
          returning: true,
          plain: true,
          transaction
        });

      if (!response) {
        await transaction.rollback();
        return res.serverInternalError();
      }
      _resultCreateData = response;
      await transaction.commit();
      return res.ok(_resultCreateData);
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      logger.error("claim reward create: ", err);
      next(err);
    }
  }
}
