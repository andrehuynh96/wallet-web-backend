const logger = require('app/lib/logger');
const Webhook = require('app/lib/webhook');
const MemberTransactionHis = require("app/model/wallet").member_transaction_his;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');

module.exports = async (req, res, next) => {
  try {
    let data = await Webhook.addAddresses();
    return res.ok(true);
  } catch (error) {
    logger.error("webhook callback failed : ", error);
    next(error);
  }
};

const fWH = {
  ETH: async (data) => {

  }
}