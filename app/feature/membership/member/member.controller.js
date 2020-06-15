const logger = require('app/lib/logger');
const MembershipType = require('app/model/wallet').membership_types;
const memberTypeMapper = require('app/feature/response-schema/membership/member-type.response-schema');
const MemberAccount = require('app/model/wallet').member_accounts;
const memberAccountMapper = require('app/feature/response-schema/membership/member-account.response-schema');
const crypto = require('crypto');
const format = require('biguint-format');
const MemberAccountType = require('app/model/wallet/value-object/member-account-type');
const cryptoRandomString = require('crypto-random-string');

module.exports = {
  getMemberType: async (req, res, next) => {
    try {
      logger.info('getMemberType::getMemberType');
      const where = { id: req.user.membership_type_id };
      const membershipType = await MembershipType.findOne({where: where});
      return res.ok(memberTypeMapper(membershipType));
    }
    catch (err) {
      logger.error("getMemberType: ", err);
      next(err);
    }
  },
  getMemberAccount: async (req, res, next) => {
    try {
      logger.info('getMemberAccount::getMemberAccount');
      const where = { member_id: req.user.member_id };
      const memberAccounts = await MemberAccount.findOne({where: where});
      

      if(memberAccounts != null && memberAccounts.length > 0){
        let _memberAccounts = [];
        let banks = memberAccounts.filter( x => x.type === MemberAccountType.Bank)
        if(banks != null && banks.length > 0){
          const idxBank = random(0, banks.length);
          _memberAccounts.push(banks[idxBank]);
        }
    
        let cryptos = memberAccounts.filter( x => x.type === MemberAccountType.Bank)
        if(banks != null && banks.length > 0){
          const idxCryptos = random(0, cryptos.length);
          _memberAccounts.push(cryptos[idxCryptos]);
        }
        let jsonRes = memberAccountMapper(_memberAccounts);
        jsonRes.payment_ref_code = cryptoRandomString({length: 6, type: 'numeric'});
        return res.ok(jsonRes);
      }
     
    }
    catch (err) {
      logger.error("getMemberAccount: ", err);
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