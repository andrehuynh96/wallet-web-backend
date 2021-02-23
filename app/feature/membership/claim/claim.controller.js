const logger = require('app/lib/logger');
const claimRequestMapper = require('app/feature/response-schema/membership/claim-request.response-schema');
const ClaimRequest = require('app/model/wallet').claim_requests;
const Membership = require('app/lib/reward-system/membership');
const createClaimRequestMapper = require('./mapper/create.claim-request-schema');
const MemberAccount = require('app/model/wallet').member_accounts;
const Member = require('app/model/wallet').members;
const MemberRewardTransactionHis = require('app/model/wallet').member_reward_transaction_his;
const database = require('app/lib/database').db().wallet;
const ClaimRequestStatus = require('app/model/wallet/value-object/claim-request-status');
const Setting = require('app/model/wallet').settings;
const config = require('app/config');
const SystemType = require('app/model/wallet/value-object/system-type');
const BigNumber = require('bignumber.js');
const MemberKyc = require('app/model/wallet').member_kycs;
const KycLevel = require('app/model/wallet/value-object/kyc-level');
const Kyc = require('app/model/wallet').kycs;

module.exports = {
  getClaimHistories: async (req, res, next) => {
    try {
      logger.info('getHistorys::getHistorys');
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      const where = {
        member_id: req.user.id,
        system_type: SystemType.MEMBERSHIP
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
      const memberKyc = await MemberKyc.findOne({
        where: {
          member_id: req.user.id
        }
      })
      if (!memberKyc) {
        return res.badRequest(res.__("MEMBER_KYC_NOT_FOUND"), "MEMBER_KYC_NOT_FOUND");
      }
      const kyc = await Kyc.findOne({ where: { id: memberKyc.kyc_id } });
      if (!kyc) {
        return res.badRequest(res.__("MEMBER_KYC_NOT_FOUND"), "MEMBER_KYC_NOT_FOUND");
      }
      if (kyc.key != KycLevel.LEVEL_2) {
        return res.badRequest(res.__("MEMBER_KYC_NOT_LEVEL_2"), "MEMBER_KYC_NOT_LEVEL_2");
      }
      const settingMinClaimAmount = await Setting.findOne({
        where: {
          key: config.setting.MEMBERSHIP_COMMISSION_USDT_MINIMUM_CLAIM_AMOUNT
        }
      });
      const settingNetWorkFee = await Setting.findOne({
        where: {
          key: config.setting.MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE
        }
      });

      if (!settingMinClaimAmount)
        return res.badRequest(res.__('MINIMUM_CLAIM_AMOUNT_NOT_FOUND'), 'MINIMUM_CLAIM_AMOUNT_NOT_FOUND');
      if (!settingNetWorkFee)
        return res.badRequest(res.__('MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE_NOT_FOUND'), 'MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE_NOT_FOUND');

      let minimunClaimAmount = parseFloat(settingMinClaimAmount.value);
      let netWorkFee = parseFloat(settingNetWorkFee.value);
      if (req.body.amount < minimunClaimAmount) {
        return res.badRequest(res.__("AMOUNT_TOO_SMALL"), "AMOUNT_TOO_SMALL");
      }
      if (req.body.amount <= netWorkFee) {
        return res.badRequest(res.__("AMOUNT_LESS_THAN_NETWORK_FEE"), "AMOUNT_LESS_THAN_NETWORK_FEE");
      }
      let amount = parseFloat(new BigNumber(req.body.amount).minus(netWorkFee));
      const where = { id: req.body.member_account_id };
      const memberAccount = await MemberAccount.findOne({ where: where });
      if (!memberAccount) {
        return res.badRequest(res.__("NOT_FOUND_MEMBER_ACCOUNT"), "NOT_FOUND_MEMBER_ACCOUNT");
      }

      let claimObject = {
        ...createClaimRequestMapper(memberAccount),
      };

      claimObject.member_account_id = memberAccount.id;
      claimObject.amount = amount;
      claimObject.status = ClaimRequestStatus.Pending;
      claimObject.affiliate_latest_id = req.body.latest_id;
      claimObject.original_amount = req.body.amount;
      claimObject.network_fee = netWorkFee;

      transaction = await database.transaction();
      let _resultCreateData = await ClaimRequest.create(claimObject, { transaction });

      const dataReward = {
        amount: amount,
        currency_symbol: req.body.currency_symbol,
        email: req.user.email,
        latest_id: req.body.latest_id,
        network_fee: netWorkFee
      };
      const dataTrackingReward = {
        member_id: req.user.id,
        currency_symbol: req.body.currency_symbol,
        amount: amount,
        tx_id: _resultCreateData.tx_id,
        note: memberAccount.wallet_address,
        network_fee: netWorkFee
      };

      await MemberRewardTransactionHis.create(dataTrackingReward, { transaction });

      // call api update claimreward and get affiliate_claim_reward_id
      const resClaimReward = await Membership.claimReward(dataReward);

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
      const settingMinClaimAmount = await Setting.findOne({
        where: {
          key: config.setting.MEMBERSHIP_COMMISSION_USDT_MINIMUM_CLAIM_AMOUNT
        }
      });
      const settingNetWorkFee = await Setting.findOne({
        where: {
          key: config.setting.MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE
        }
      });

      if (!settingMinClaimAmount)
        return res.badRequest(res.__('MINIMUM_CLAIM_AMOUNT_NOT_FOUND'), 'MINIMUM_CLAIM_AMOUNT_NOT_FOUND');
      if (!settingNetWorkFee)
        return res.badRequest(res.__('MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE_NOT_FOUND'), 'MEMBERSHIP_COMMISSION_USDT_NETWORK_FEE_NOT_FOUND');

      return res.ok({
        minimun_claim_amount: parseFloat(settingMinClaimAmount.value),
        membership_commission_usdt_network_fee: parseFloat(settingNetWorkFee.value)
      });
    } catch (err) {
      logger.error("setting: ", err);
      next(err);
    }
  },
};
