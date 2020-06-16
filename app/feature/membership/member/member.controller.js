const logger = require('app/lib/logger');
const MembershipType = require('app/model/wallet').membership_types;
const memberTypeMapper = require('app/feature/response-schema/membership/member-type.response-schema');
const BankAccount = require('app/model/wallet').bank_accounts;
const ReceivingAddresses = require('app/model/wallet').receiving_addresses;
const bankAccountMapper = require('app/feature/response-schema/membership/bank-account.response-schema');
const receivingAddressMapper = require('app/feature/response-schema/membership/receiving-address.response-schema');
const crypto = require('crypto');
const format = require('biguint-format');
const MemberAccountType = require('app/model/wallet/value-object/member-account-type');
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const cryptoRandomString = require('crypto-random-string');

module.exports = {
  getMemberTypes: async (req, res, next) => {
    try {
      logger.info('getMemberType::getMemberType');
      const where = { type: MembershipTypeName.Paid, deleted_flg: false };
      const membershipTypes = await MembershipType.findAll({where: where});
      return res.ok(memberTypeMapper(membershipTypes));
    }
    catch (err) {
      logger.error("getMemberType: ", err);
      next(err);
    }
  },
  getPaymentAccount: async (req, res, next) => {
    try {
      logger.info('getPaymentAccount::getPaymentAccount');
      const bankAccounts = await BankAccount.findOne({
         where: {
            actived_flg: true
          }
        });

      let _PaymentAccounts = [];
      
      if(bankAccounts != null && bankAccounts.length > 0){
        const idxBank = random(0, bankAccounts.length);
        let bankAccount = {
          ...bankAccountMapper(bankAccounts[idxBank])
        };
        bankAccount.payment_type = MemberAccountType.Bank;
        _PaymentAccounts.push(bankAccount);
      }

      const receivingAddresses = await ReceivingAddresses.findAll({
        where: {
          actived_flg: true
        }
      });
      if(receivingAddresses != null && receivingAddressess.length > 0){
        const idxCryptos = random(0, receivingAddressess.length);
        let cryptoAccount = {
          ...receivingAddressMapper(receivingAddresses[idxCryptos])
        };
        cryptoAccount.payment_type = MemberAccountType.Crypto;
        _PaymentAccounts.push(cryptoAccount);
      }

      let jsonRes = {
        ..._PaymentAccounts
      };
      jsonRes.payment_ref_code = cryptoRandomString({length: 6, type: 'numeric'});

      return res.ok(jsonRes);
     
    }
    catch (err) {
      logger.error("getPaymentAccount: ", err);
      next(err);
    }
  },
};
function randomC (qty) {
  var x= crypto.randomBytes(qty);
  return format(x, 'dec');
}
function random (low, high) {
  return randomC(4)/Math.pow(2,4*8-1) * (high - low) + low;
}