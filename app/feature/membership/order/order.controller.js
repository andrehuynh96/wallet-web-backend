const logger = require('app/lib/logger');
const MembershipOrder = require('app/model/wallet').membership_orders;
const MembershipOrderStatus = require('app/model/wallet/value-object/membership-order-status');
const mapper = require('app/feature/response-schema/membership/order.response-schema');
const MembershipType = require('app/model/wallet').membership_types;
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const membershipOrderMapper = require('app/feature/response-schema/membership/order.response-schema');
const db = require("app/model/wallet");

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
  makePayment: async (req, res, next) => {
    try {
      logger.info('makePayment::makePayment');  

      const _currentMembershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id
        }
      });

      if(_currentMembershipType.type === MembershipTypeName.Paid){
        return res.badRequest(res.__("PURCHASE_FAIL"), "MEMBER_TYPE_EXIST_PACKAGE_PAID");
      }
      const _membershipType = await MembershipType.findOne({
        where: {
          id: req.body.membership_type_id
        }
      });

      let data = {
        ...req.body,
        membership_type_id: req.body.membership_type_id,
        status: MembershipOrderStatus.Pending,
      }

      let result =  await MembershipOrder.create(data);

      return res.ok(mapper(result));
    }
    catch (err) {
      logger.error("makePayment: ", err);
      next(err);
    }
  }
};