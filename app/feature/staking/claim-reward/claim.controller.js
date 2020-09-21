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
const BigNumber = require('bignumber.js');

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

      const searchClaim = `${config.setting.CLAIM_AFFILIATE_REWARD_}${req.body.currency_symbol}`;

      const searchClaimNwFee = `${config.setting.CLAIM_AFFILIATE_REWARD_}${req.body.currency_symbol}_NETWORK_FEE`;

      const setting = await Setting.findOne({
        where: {
          key: searchClaim
        }
      });

      let networkFee = 0;

      const settingNwFee = await Setting.findOne({
        where: {
          key: searchClaimNwFee
        }
      });

      if (settingNwFee) {
        networkFee = parseFloat(settingNwFee.value);
      }

      if (req.body.amount <= networkFee) {
        return res.badRequest(res.__("AMOUNT_LESS_THAN_NETWORK_FEE"), "AMOUNT_LESS_THAN_NETWORK_FEE");
      }

      if (!setting)
        return res.badRequest(res.__('MINIMUM_CLAIM_AMOUNT_NOT_FOUND'), 'MINIMUM_CLAIM_AMOUNT_NOT_FOUND');
      let minimumClaimAmount = parseFloat(setting.value);
      if ((req.body.amount < minimumClaimAmount) || ((req.body.amount - networkFee) <= 0)) {
        return res.badRequest(res.__("AMOUNT_TOO_SMALL"), "AMOUNT_TOO_SMALL");
      }

      let amount = parseFloat(new BigNumber(req.body.amount).minus(networkFee));

      let claimObject = {
        ...createClaimRequestMapper(memberAccount),
        original_amount: req.body.amount,
        network_fee: networkFee
      };

      claimObject.member_account_id = memberAccount.id;
      claimObject.amount = amount;
      claimObject.status = ClaimRequestStatus.Pending;
      claimObject.system_type = SystemType.AFFILIATE
      claimObject.affiliate_latest_id = req.body.latest_id;

      transaction = await database.transaction();
      let _resultCreateData = await ClaimRequest.create(claimObject, { transaction });

      const dataReward = {
        amount: req.body.amount,
        currency_symbol: req.body.currency_symbol,
        email: req.user.email,
        latest_id: req.body.latest_id,
        network_fee: networkFee
      };
      const dataTrackingReward = {
        member_id: req.user.id,
        currency_symbol: req.body.currency_symbol,
        amount: amount,
        tx_id: _resultCreateData.tx_id,
        note: memberAccount.wallet_address,
        system_type: SystemType.AFFILIATE,
        network_fee: networkFee
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
              config.setting.CLAIM_AFFILIATE_REWARD_ONG,
              config.setting.CLAIM_AFFILIATE_REWARD_XTZ,
              config.setting.CLAIM_AFFILIATE_REWARD_ONE,
              config.setting.CLAIM_AFFILIATE_REWARD_ATOM_NETWORK_FEE,
              config.setting.CLAIM_AFFILIATE_REWARD_IRIS_NETWORK_FEE,
              config.setting.CLAIM_AFFILIATE_REWARD_ONG_NETWORK_FEE,
              config.setting.CLAIM_AFFILIATE_REWARD_XTZ_NETWORK_FEE,
              config.setting.CLAIM_AFFILIATE_REWARD_ONE_NETWORK_FEE
            ]
          }
        }
      });
      if (!setting)
        return res.badRequest(res.__('MINIMUM_CLAIM_AMOUNT_NOT_FOUND'), 'MINIMUM_CLAIM_AMOUNT_NOT_FOUND');

      let atom = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ATOM)[0];
      let iris = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_IRIS)[0];
      let ong = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ONG)[0];
      let xtz = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_XTZ)[0];
      let one = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ONE)[0];

      let atomNwFee = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ATOM_NETWORK_FEE)[0];
      let irisNwFee = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_IRIS_NETWORK_FEE)[0];
      let ongNwFee = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ONG_NETWORK_FEE)[0];
      let xtzNwFee = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_XTZ_NETWORK_FEE)[0];
      let oneNwFee = setting.filter(x => x.key == config.setting.CLAIM_AFFILIATE_REWARD_ONE_NETWORK_FEE)[0];

      return res.ok({
        minimun_claim_amount_atom: parseFloat(atom.value),
        minimun_claim_amount_iris: parseFloat(iris.value),
        minimun_claim_amount_ong: parseFloat(ong.value),
        minimun_claim_amount_xtz: parseFloat(xtz.value),
        minimun_claim_amount_one: parseFloat(one.value),

        claim_atom_network_fee: parseFloat(atomNwFee.value),
        claim_iris_network_fee: parseFloat(irisNwFee.value),
        claim_ong_network_fee: parseFloat(ongNwFee.value),
        claim_xtz_network_fee: parseFloat(xtzNwFee.value),
        claim_one_network_fee: parseFloat(oneNwFee.value)

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