const logger = require('app/lib/logger');
const MembershipOrder = require('app/model/wallet').membership_orders;
const MembershipOrderStatus = require('app/model/wallet/value-object/membership-order-status');
const mapper = require('app/feature/response-schema/membership/order.response-schema');
const MembershipType = require('app/model/wallet').membership_types;
const membershipOrderMapper = require('app/feature/response-schema/membership/order.response-schema');
const db = require("app/model/wallet");
const Member = require('app/model/wallet').members;
const BankAccount = require('app/model/wallet').bank_accounts;
const ReceivingAddresses = require('app/model/wallet').receiving_addresses;
const Setting = require('app/model/wallet').settings;
const Membership = require('app/lib/reward-system/membership');
const MemberAccountType = require('app/model/wallet/value-object/member-account-type');
const config = require('app/config');
const KycStatus = require('app/model/wallet/value-object/kyc-status');
const CoinGeckoPrice = require('app/lib/coin-gecko-client');
const IpCountry = require('app/lib/ip-country');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Hashids = require('hashids/cjs');
const database = require('app/lib/database').db().wallet;

module.exports = {
  getOrders: async (req, res, next) => {
    try {
      logger.info('getOrders::getOrders');

      var sql = `
        SELECT membership_orders.id,
          membership_orders.member_id,
          membership_orders.bank_account_id,
          membership_orders.receiving_addresses_id,
          membership_orders.membership_type_id,
          membership_orders.payment_type,
          membership_orders.currency_symbol,
          membership_orders.amount,
          membership_orders.account_number,
          membership_orders.bank_name,
          membership_orders.swift,
          membership_orders.account_name,
          membership_orders.payment_ref_code,
          membership_orders.wallet_address,
          membership_orders.your_wallet_address,
          membership_orders.txid,
          membership_orders.rate_usd,
          membership_orders.status,
          membership_orders.created_at, 
          membership_orders.updated_at,
        membership_types.type as membership_type
        FROM membership_orders INNER JOIN membership_types on membership_orders.membership_type_id = membership_types.id
        WHERE membership_orders.member_id = '${req.user.id}'
        ORDER BY membership_orders.created_at DESC
      `;
      var membershipOrders = await db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT });
      return res.ok(membershipOrderMapper(membershipOrders));
    }
    catch (err) {
      logger.error("getOrders: ", err);
      next(err);
    }
  },

  makePaymentCrypto: async (req, res, next) => {
    let transaction;
    try {
      let checkCondition = await _checkConditionCreateOrder(req, MemberAccountType.Crypto);
      if (checkCondition) {
        return res.badRequest(res.__(checkCondition), checkCondition);
      }

      const receivingAddress = await ReceivingAddresses.findOne({
        where: {
          id: req.body.receiving_addresses_id
        }
      });
      if (!receivingAddress) {
        return res.serverInternalError();
      }
      const membershipType = await MembershipType.findOne({
        where: {
          id: req.body.membership_type_id
        }
      });

      let rateUsd = await CoinGeckoPrice.getPrice({ platform_name: receivingAddress.currency_symbol, currency: 'usd' });

      let salt = `${Date.now().toString()}-${req.user.id}`;
      let hashids = new Hashids(salt, 8);
      let orderId = hashids.encode(1, 2, 3, 4).toUpperCase();

      let data = {
        member_id: req.user.id,
        membership_type_id: membershipType.id,
        payment_type: MemberAccountType.Crypto,
        currency_symbol: receivingAddress.currency_symbol,
        wallet_address: receivingAddress.wallet_address,
        receiving_addresses_id: receivingAddress.id,
        amount: req.body.amount,
        your_wallet_address: req.body.your_wallet_address,
        txid: req.body.txid,
        payment_ref_code: orderId,
        referrer_code: req.user.referrer_code,
        order_no: orderId,
        rate_usd: rateUsd,
        amount_usd: (rateUsd * req.body.amount),
      }

      if (req.body.wallet_id) {
        data.wallet_id = req.body.wallet_id;
      }

      transaction = await database.transaction();
      let result = await MembershipOrder.create(data, { transaction: transaction });
      await Member.update({
        latest_membership_order_id: result.id
      }, {
          where: {
            id: req.user.id
          },
          returning: true,
          plain: true,
          transaction: transaction
        });
      await transaction.commit();

      return res.ok(mapper(result));
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback()
      };
      logger.error("makePaymentCrypto: ", err);
      next(err);
    }
  },

  makePaymentBank: async (req, res, next) => {
    let transaction;
    try {
      let checkCondition = await _checkConditionCreateOrder(req, MemberAccountType.Bank);
      if (checkCondition) {
        return res.badRequest(res.__(checkCondition), checkCondition);
      }
      const allowCountry = await IpCountry.isAllowCountryLocal(req);
      if (!allowCountry) {
        return res.badRequest(res.__("DONOT_SUPPORT_YOUR_COUNTRY"), "DONOT_SUPPORT_YOUR_COUNTRY");
      }
      const bankAccount = await BankAccount.findOne({
        where: {
          actived_flg: true
        }
      });
      if (!bankAccount) {
        return res.serverInternalError();
      }
      const membershipType = await MembershipType.findOne({
        where: {
          id: req.body.membership_type_id
        }
      });

      let currencySymbol = "JPY";
      let rateJPY = 1;
      const rateJPYConfig = await Setting.findOne({
        where: {
          key: `${config.setting.USD_RATE_BY_}${currencySymbol}`
        }
      });

      if (rateJPYConfig) {
        rateJPY = parseFloat(rateJPYConfig.value);
      }

      let salt = `${Date.now().toString()}-${req.user.id}`;
      let hashids = new Hashids(salt, 8);
      let orderId = hashids.encode(1, 2, 3, 4).toUpperCase();

      let data = {
        member_id: req.user.id,
        membership_type_id: membershipType.id,
        payment_type: MemberAccountType.Bank,
        currency_symbol: currencySymbol,
        amount: (rateJPY * membershipType.price),
        bank_account_id: bankAccount.id,
        branch_name: bankAccount.branch_name,
        account_number: bankAccount.account_number,
        bank_name: bankAccount.bank_name,
        swift: bankAccount.swift,
        account_name: bankAccount.account_name,
        account_type: bankAccount.account_type,
        payment_ref_code: orderId,
        referrer_code: req.user.referrer_code,
        order_no: orderId,
        rate_usd: rateJPY,
        amount_usd: membershipType.price
      }

      transaction = await database.transaction();
      let result = await MembershipOrder.create(data, { transaction: transaction });
      await Member.update({
        latest_membership_order_id: result.id
      }, {
          where: {
            id: req.user.id
          },
          returning: true,
          plain: true,
          transaction: transaction
        });
      await transaction.commit();
      return res.ok(mapper(result));
    }
    catch (err) {
      if (transaction) {
        await transaction.rollback()
      };
      logger.error("makePaymentBank: ", err);
      next(err);
    }
  },

  clickReferrerUrl: async (req, res, next) => {
    try {
      const referrCode = req.params.code;
      const result = await Membership.clickReferrerUrl(referrCode);
      if (result.httpCode !== 200) {
        return res.status(result.httpCode).send(result.data);
      }
      return res.ok(result.data.data);
    }
    catch (err) {
      logger.error("click referrer url fail: ", err);
      next(err);
    }
  },

  isPurchased: async (req, res, next) => {
    try {
      const paymentType = req.params.paymentType;
      const memberId = req.user.id;
      const membershipOrder = await MembershipOrder.findOne({
        where: {
          member_id: memberId,
          payment_type: paymentType,
          status: {
            [Op.in]: [MembershipOrderStatus.Pending,
            MembershipOrderStatus.InProcessing,
            MembershipOrderStatus.Completed]
          }
        }
      });

      if (!membershipOrder) {
        return res.ok({});
      }

      return res.ok(membershipOrder);
    }
    catch (error) {
      logger.error("check payment fail: ", error);
      next(error);
    }
  }
};

async function _checkConditionCreateOrder(req, paymentType) {
  const membershipType = await MembershipType.findOne({
    where: {
      id: req.body.membership_type_id
    }
  });
  if (!membershipType) {
    return "MEMBERSHIP_TYPE_NOT_FOUND";
  }

  if (config.membership.KYCLevelAllowPurchase != req.user.kyc_level || req.user.kyc_status != KycStatus.APPROVED) {
    return "KYC_LEVEL_DONOT_HAVE_PERMISSION";
  }

  const referrerCode = await Membership.isCheckReferrerCode({ referrerCode: req.user.referrer_code });
  if (referrerCode.httpCode !== 200 ||
    !referrerCode.data.data.isValid) {
    return "YOUR_REFERRER_NOT_MEMBERSHIP";
  }

  let where = {};
  if (paymentType == MemberAccountType.Crypto) {
    where.wallet_id = {
      [Op.ne]: null
    }
  }
  let order = await MembershipOrder.findOne({
    where: {
      member_id: req.user.id,
      payment_type: paymentType,
      ...where,
      status: {
        [Op.in]: [MembershipOrderStatus.Pending,
        MembershipOrderStatus.InProcessing,
        MembershipOrderStatus.Completed]
      }
    }
  });
  if (order) {
    return "YOU_HAVE_BEEN_ORDERED_ALRREADY";
  }

  return "";
}