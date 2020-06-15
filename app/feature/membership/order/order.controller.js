const logger = require('app/lib/logger');
const MembershipOrder = require('app/model/wallet').membership_orders;
const MembershipOrderStatus = require('app/model/wallet/value-object/membership-order-status');
const mapper = require('app/feature/response-schema/membership/order.response-schema');
const MembershipType = require('app/model/wallet').membership_types;
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const membershipOrderMapper = require('app/feature/response-schema/membership/order.response-schema');

module.exports = {
  getOrders: async (req, res, next) => {
    try {
      logger.info('getOrders::getOrders');
      const where = { member_id: req.user.member_id };
      const membershipOrders = await MembershipOrder.findOne({where: where});
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

      const _membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id
        }
      });

      if(_membershipType.type === MembershipTypeName.Paid){
        return res.badRequest(res.__("PURCHASE_FAIL"), "MEMBER_TYPE_EXIST_PACKAGE_PAID");
      }

      let data = {
        ...req.body,
        membership_type_id: req.user.membership_type_id,
        status: MembershipOrderStatus.Pending
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