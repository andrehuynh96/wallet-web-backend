const logger = require('app/lib/logger');
const MembershipType = require('app/model/wallet').membership_types;
const memberTypeMapper = require('app/feature/response-schema/membership/member-type.response-schema');
const BankAccount = require('app/model/wallet').bank_accounts;
const ReceivingAddresses = require('app/model/wallet').receiving_addresses;
const bankAccountMapper = require('app/feature/response-schema/membership/bank-account.response-schema');
const receivingAddressMapper = require('app/feature/response-schema/membership/receiving-address.response-schema');
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const cryptoRandomString = require('crypto-random-string');
const ipCountry = require('app/lib/ip-country');
const CoinGeckoPrice = require('app/lib/coin-gecko-client');
const Setting = require('app/model/wallet').settings;
const config = require('app/config');

module.exports = {
  getMemberTypes: async (req, res, next) => {
    try {
      logger.info('getMemberType::getMemberType');
      const where = { type: MembershipTypeName.Paid, deleted_flg: false, is_enabled: true };
      const membershipTypes = await MembershipType.findAll({
        where: where,
        order: [['display_order', 'DESC']],
      });
      return res.ok(memberTypeMapper(membershipTypes));
    }
    catch (err) {
      logger.error("getMemberType: ", err);
      next(err);
    }
  },

  getMemberTypeDetail: async (req, res, next) => {
    try {
      const result = await MembershipType.findOne({
        where: {
          id: req.params.id,
          deleted_flg: false,
          is_enabled: true
        }
      });
      if (!result) {
        return res.badRequest(res.__("NOT_FOUND_MEMBERSHIP_TYPE"), "NOT_FOUND_MEMBERSHIP_TYPE");
      }

      return res.ok(memberTypeMapper(result));
    }
    catch (err) {
      logger.error("getMemberTypeDetail: ", err);
      next(err);
    }
  },

  getInforIP: async (req, res, next) => {
    logger.error("getInforIP: getInforIP");
    try {
      const _country = await ipCountry.getCountryLocal(req);
      return res.ok(_country);
    } catch (err) {
      logger.error("getInforIP: ", err);
      next(err);
    }
  },

  getPrice: async (req, res, next) => {
    try {
      logger.info('getPrice::getPrice');
      console.log('req.params.currency_symbol', req.params.currency_symbol);
      const { price } = await CoinGeckoPrice.getPrice({ platform_name: req.params.currency_symbol, currency: 'usd' });
      let crypto = {
        rate_usd: price
      };
      return res.ok(crypto);
    } catch (err) {
      logger.error("getPrice: ", err);
      next(err);
    }
  },

  getPaymentCryptoAccount: async (req, res, next) => {
    try {
      const result = await ReceivingAddresses.findAll({
        where: {
          actived_flg: true
        }
      });

      let response = [];
      const currencies = [...new Set(result.map(i => i.currency_symbol))];
      for (let i of currencies) {
        let csi = result.filter(x => x.currency_symbol == i);
        let ix = random(csi.length);
        response.push(csi[ix]);
      }

      return res.ok(response);
    }
    catch (err) {
      logger.error("getPaymentCryptoAccount: ", err);
      next(err);
    }
  },

  allowBankMethod: async (req, res, next) => {
    try {
      const isAllowCountryLocal = await ipCountry.isAllowCountryLocal(req);
      return res.ok(isAllowCountryLocal);
    }
    catch (err) {
      logger.error("allowBankMethod: ", err);
      next(err);
    }
  },

  getFiatPrice: async (req, res, next) => {
    try {
      let rateUsd = 1;
      const rateUsdConfig = await Setting.findOne({
        where: {
          key: `${config.setting.USD_RATE_BY_}${req.params.currency_symbol.toUpperCase()}`
        }
      });

      if (rateUsdConfig) {
        rateUsd = parseFloat(rateUsdConfig.value);
      }
      else {
        return res.badRequest(res.__("NOT_SUPPORT_CURRENCY"), "NOT_SUPPORT_CURRENCY");
      }
      return res.ok({
        value: rateUsd,
        date: rateUsdConfig.updatedAt
      });
    } catch (err) {
      logger.error("getFiatPrice: ", err);
      next(err);
    }
  },
};

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
