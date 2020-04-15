const logger = require('app/lib/logger');
const Webhook = require('app/lib/webhook');
const MemberTransactionHis = require("app/model/wallet").member_transaction_his;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const config = require("app/config");
const mailer = require('app/lib/mailer');

module.exports = async (req, res, next) => {
  try {
    let data = whParser[req.params.platform.toUpperCase()](req.body);
    if (!data) {
      return res.ok(true);
    }

    let member = await _getMemberFromAddress(data.address);
    if (!member) {
      return res.ok(true);
    }
    await MemberTransactionHis.create({
      member_id: member.id,
      ...data.tracking,
      action: ActionType.RECEIVED
    });
    _sendEmail(member, data);
    return res.ok(true);
  } catch (error) {
    logger.error("webhook callback failed : ", error);
    next(error);
  }
};

const whParser = {
  ETH: async (data) => {

  }
}

async function _getMemberFromAddress(address) {

}

async function _sendEmail(member, content) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Received coin/token alert`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      banner: config.website.urlImages,
      imageUrl: config.website.urlIcon + content.platform.toLowerCase() + '.png',
      platform: config.explorer[content.platform].platformName,
      tx_id: content.tx_id,
      address: content.address,
      amount: content.amount,
      symbol: content.symbol,
      txIdLink: config.explorer[content.platform].txIdLink + content.tx_id,
      addressLink: config.explorer[content.platform].addressLink + content.address
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.txReceived);
  } catch (err) {
    logger.error("Received coin/token alert email fail", err);
  }
} 