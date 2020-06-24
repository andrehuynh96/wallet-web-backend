const logger = require('app/lib/logger');
const MembershipType = require('app/model/wallet').membership_types;
const memberTypeMapper = require('app/feature/response-schema/membership/member-type.response-schema');
const BankAccount = require('app/model/wallet').bank_accounts;
const ReceivingAddresses = require('app/model/wallet').receiving_addresses;
const bankAccountMapper = require('app/feature/response-schema/membership/bank-account.response-schema');
const receivingAddressMapper = require('app/feature/response-schema/membership/receiving-address.response-schema');
const MemberAccountType = require('app/model/wallet/value-object/member-account-type');
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const cryptoRandomString = require('crypto-random-string');
const ipCountry = require('app/lib/ip-country');

module.exports = {
  getMemberTypes: async (req, res, next) => {
    try {
      logger.info('getMemberType::getMemberType');
      const where = { type: MembershipTypeName.Paid, deleted_flg: false };
      const membershipTypes = await MembershipType.findAll({ where: where });
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
          deleted_flg: false
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

  getPaymentAccount: async (req, res, next) => {
    try {
      logger.info('getPaymentAccount::getPaymentAccount');
      const bankAccounts = await BankAccount.findAll({
        where: {
          actived_flg: true
        }
      });
      //const _isAllowCountryLocal = await ipCountry.isAllowCountryLocal(req);
      //if country local not exist in country white list, return error
      //if (!_isAllowCountryLocal) {
        //return res.badRequest(res.__("COUNTRY_LOCAL_NOT_ALLOW_ACCESS_BANK_ACCOUNT"), "COUNTRY_LOCAL_NOT_ALLOW_ACCESS_BANK_ACCOUNT");
      //}

      let _PaymentAccounts = [];

      if (bankAccounts != null && bankAccounts.length > 0) {
        const idxBank = random(bankAccounts.length - 1);
        let bankAccount = {
          ...bankAccountMapper(bankAccounts[idxBank])
        };
        bankAccount.payment_type = MemberAccountType.Bank;
        bankAccount.payment_ref_code = cryptoRandomString({ length: 6, type: 'numeric' });
        _PaymentAccounts.push(bankAccount);
      }

      const receivingAddresses = await ReceivingAddresses.findAll({
        where: {
          actived_flg: true
        }
      });
      if (receivingAddresses != null && receivingAddresses.length > 0) {
        const idxCryptos = random(receivingAddresses.length - 1);
        let cryptoAccount = {
          ...receivingAddressMapper(receivingAddresses[idxCryptos])
        };
        cryptoAccount.payment_type = MemberAccountType.Crypto;
        _PaymentAccounts.push(cryptoAccount);
      }
      return res.ok(_PaymentAccounts);

    }
    catch (err) {
      logger.error("getPaymentAccount: ", err);
      next(err);
    }
  },
};

function random(max) {
  return Math.floor(Math.random() * Math.floor(max));
}