const logger = require('app/lib/logger');
const claimRequestMapper = require('app/feature/response-schema/membership/claim-request.response-schema');
const ClaimRequest = require('app/model/wallet').claim_requests;
const Affiliate = require('app/lib/reward-system/affiliate');
const createClaimRequestMapper = require('./mapper/create.claim-request-schema');
const MemberAccount = require('app/model/wallet').member_accounts;
const Member = require('app/model/wallet').members;
const MemberRewardTransactionHis = require('app/model/wallet').member_reward_transaction_his;
const database = require('app/lib/database').db().wallet;
const ClaimRequestStatus = require('app/model/wallet/value-object/claim-request-status');
const Setting = require('app/model/wallet').settings;
const config = require('app/config');
const SystemType = require('app/model/wallet/value-object/system-type');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getClaimHistories: async (req, res, next) => {
    try {
      logger.info('getHistorys::getHistorys');
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const where = {
        member_id: req.user.id,
        system_type: SystemType.AFFILIATE
      };
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
      let checkAmoun = await _checkAmount(req);
      if (checkAmoun) {
        return res.badRequest(res.__("checkAmoun"), "checkAmoun");
      }

      const where = { id: req.body.member_account_id };
      const memberAccount = await MemberAccount.findOne({ where: where });
      if (!memberAccount) {
        return res.badRequest(res.__("NOT_FOUND_MEMBER_ACCOUNT"), "NOT_FOUND_MEMBER_ACCOUNT");
      }


      let claimObject = {
        ...createClaimRequestMapper(memberAccount),
      };

      claimObject.member_account_id = memberAccount.id;
      claimObject.amount = req.body.amount;
      claimObject.status = ClaimRequestStatus.Pending;
      claimObject.system_type = SystemType.AFFILIATE

      transaction = await database.transaction();
      let _resultCreateData = await ClaimRequest.create(claimObject, { transaction });

      const dataReward = {
        amount: req.body.amount,
        currency_symbol: req.body.currency_symbol,
        email: req.user.email
      };
      const dataTrackingReward = {
        member_id: req.user.id,
        currency_symbol: req.body.currency_symbol,
        amount: req.body.amount,
        tx_id: _resultCreateData.tx_id,
        note: memberAccount.wallet_address,
        system_type: SystemType.AFFILIATE
      };

      await MemberRewardTransactionHis.create(dataTrackingReward, { transaction });

      const resClaimReward = await Affiliate.claimReward(dataReward);

      if (resClaimReward.httpCode !== 200) {
        await transaction.rollback();
        return res.status(resClaimReward.httpCode).send(resClaimReward.data);
      }
      let [_, response] = await ClaimRequest.update(
        {
          affiliate_claim_reward_id: resClaimReward.data.id
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
  },

  setting: async (req, res, next) => {
    try {
      const setting = await Setting.findAll({
        where: {
          key: {
            [Op.in]: [
              config.setting.CLAIM_AFFILIATE_REWARD_ATOM,
              config.setting.CLAIM_AFFILIATE_REWARD_IRIS,
              config.setting.CLAIM_AFFILIATE_REWARD_ONG
            ]
          }
        }
      });
      if (!setting)
        return res.badRequest(res.__('MINIMUM_CLAIM_AMOUNT_NOT_FOUND'), 'MINIMUM_CLAIM_AMOUNT_NOT_FOUND');

      let atom = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ATOM)[0];
      let iris = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_IRIS)[0];
      let ong = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ONG)[0];

      return res.ok({
        minimun_claim_amount_atom: parseFloat(atom.value),
        minimun_claim_amount_iris: parseFloat(iris.value),
        minimun_claim_amount_ong: parseFloat(ong.value)
      });
    } catch (err) {
      logger.error("setting: ", err);
      next(err);
    }
  },
};

async function _checkAmount(req) {
  return "";
  // const setting = await Setting.findOne({
  //   where: {
  //     key: config.setting.MEMBERSHIP_COMMISSION_USDT_MINIMUM_CLAIM_AMOUNT
  //   }
  // });
  // if (!setting)
  //   return res.badRequest(res.__('MINIMUM_CLAIM_AMOUNT_NOT_FOUND'), 'MINIMUM_CLAIM_AMOUNT_NOT_FOUND');
  // let minimunClaimAmount = parseFloat(setting.value);
  // if (req.body.amount < minimunClaimAmount) {
  //   return res.badRequest(res.__("AMOUNT_TOO_SMALL"), "AMOUNT_TOO_SMALL");
  // }

}