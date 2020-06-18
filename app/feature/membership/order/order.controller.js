const logger = require('app/lib/logger');
const MembershipOrder = require('app/model/wallet').membership_orders;
const MembershipOrderStatus = require('app/model/wallet/value-object/membership-order-status');
const mapper = require('app/feature/response-schema/membership/order.response-schema');
const MembershipType = require('app/model/wallet').membership_types;
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const Platform = require('app/model/wallet/value-object/platform');
const membershipOrderMapper = require('app/feature/response-schema/membership/order.response-schema');
const db = require("app/model/wallet");
const CoinGecko = require('coingecko-api');
const Member = require('app/model/wallet').members;
const Affiliate = require('app/lib/affiliate');

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
        membership_orders.bracnch_name,
        membership_orders.account_name,
        membership_orders.payment_ref_code,
        membership_orders.wallet_address,
        membership_orders.your_wallet_address,
        membership_orders.txid,
        membership_orders.rate_by_usdt,
        membership_orders.status,
        membership_orders.processe_date, 
        membership_types.type
        FROM membership_orders INNER JOIN membership_types on membership_orders.membership_type_id = membership_types.id
        WHERE membership_orders.member_id = ${req.user.id}
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
    try {
      logger.info('makePaymentCrypto::makePaymentCrypto');  
      const coinGeckoClient = new CoinGecko();
      let coinPrices = await coinGeckoClient.simple.price({
        ids: [req.body.currency_symbol],
        vs_currencies: ['usd']
      });
      const price = coinPrices[Platform[req.body.currency_symbol].name].usd;
      const body = {
        rate_by_usdt: price,
        payment_type:MemberAccountType.Crypto,
        ...req.body
      }

      const resDataCheck = await _checkDataCreateOrder(body, req.user.id);

      if(resDataCheck.isCreated){
        const result = await _createOrder(body, req);
        return res.ok(result);
      }else{
        return res.badRequest(res.__(resDataCheck.errorCode), resDataCheck.errorMsg);
      }
    }
    catch (err) {
      logger.error("makePaymentCrypto: ", err);
      next(err);
    }
  },
  makePaymentBank: async (req, res, next) => {
    try {
      logger.info('makePaymentBank::makePaymentBank');  
      const body = {
        payment_type:MemberAccountType.Bank,
        ...req.body,
      }
      const resDataCheck = await _checkDataCreateOrder(body, req.user.id);

      if(resDataCheck.isCreated){
        const result = await _createOrder(body, req);
        return res.ok(result);
      }else{
        return res.badRequest(res.__(resDataCheck.errorCode), resDataCheck.errorMsg);
      }
    }
    catch (err) {
      logger.error("makePaymentBank: ", err);
      next(err);
    }
  }
};

/**
 * create order
 * @param {*} body 
 * @param {*} req 
 */
async function _createOrder(body, req){

    const _member = await Member.findOne({where: {id: req.user.id}});
  
    let order = {
      status: MembershipOrderStatus.Pending,
      ...body,
      referral_code: _member.referral_code,
      member_id: _member.id
    }
  
    let result =  await MembershipOrder.create(order);
    return mapper(result);
}

/**
 * check validater data create order
 * @param {*} data 
 * @param {*} member_id 
 */
async function _checkDataCreateOrder(data, member_id){
  let resData = {isCreated: true};
  const _member = await Member.findOne({where: {id: member_id}});
  if(config.membership.KYCLevelAllowPurchase == _member.kyc_level){
    //check referrence code 
    const resCheckReferrerCode = Affiliate.isCheckReferrerCode(data.referrer_code);

    //waitting data api anh hung
    if(!resCheckReferrerCode.data.isValid){
      resData.isCreated = false; 
      resData.errorCode = "PURCHASE_FAIL";
      resData.errorMsg = "REFERRER_CODE_INVALIDATER";
    }else{
      //check MembershipType of member is Paid
      const _currentMembershipType = await MembershipType.findOne({
        where: {
          id: _member.membership_type_id
        }
      });
    
      if(_currentMembershipType.type === MembershipTypeName.Paid){
        resData.isCreated = false; 
        resData.errorCode = "PURCHASE_FAIL";
        resData.errorMsg = "MEMBER_TYPE_EXIST_PACKAGE_PAID";
      }
    }
  }else{
    // KYC level purchase invalidater
    resData.isCreated = false; 
    resData.errorCode = "PURCHASE_FAIL";
    resData.errorMsg = "KYC_LEVEL_INVALIDATER";
  }
  return resData;
}