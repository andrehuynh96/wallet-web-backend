const logger = require('app/lib/logger');
const Webhook = require('app/lib/webhook');
const MemberTransactionHis = require("app/model/wallet").member_transaction_his;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const config = require("app/config");
const mailer = require('app/lib/mailer');
const db = require("app/model/wallet");
const BigNumber = require('bignumber.js');

module.exports = async (req, res, next) => {
  try {
    if (!req.body || !req.body.transactions || req.body.transactions.length == 0) {
      return res.ok(true);
    }

    for (let t of req.body.transactions) {
      let data = whParser[req.params.platform.toUpperCase()](t);
      if (!data) {
        continue;
      }
      let member = await _getMemberFromAddress(req.params.platform.toUpperCase(), data.to_address);
      if (!member || member.length == 0) {
        continue;
      }
      member = member[0];

      let tx = await MemberTransactionHis.findOne({
        where: {
          tx_id: data.tx_id
        }
      });

      if (!tx) {
        await MemberTransactionHis.create({
          member_id: member.id,
          ...data
        });
      }
      _sendEmail(member, data);
    }

    return res.ok(true);
  } catch (error) {
    logger.error("webhook callback failed : ", error);
    next(error);
  }
};

const whParser = {
  ETH: (data) => {
    var value = new BigNumber(data.value);
    value = value.dividedBy(10 ** 18);
    return {
      tx_id: data.tx_id,
      platform: "ETH",
      amount: data.value,
      from_address: data.from_addr,
      to_address: data.to_addr,
      action: ActionType.RECEIVED,
      send_email_flg: true,
      amount_actual: value.toFixed(5),
      symbol: "ETH"
    }
  },
  ATOM: (data) => {
    return {

      tx_id: data.tx_id,
      platform: "ATOM",
      amount: data.value,
      from_address: data.from_addr,
      to_address: data.to_addr,
      action: ActionType.RECEIVED,
      send_email_flg: true,
      amount_actual: data.value,
      symbol: "ATOM"
    }
  },
  IRIS: (data) => {
    return {
      tx_id: data.tx_id,
      platform: "IRIS",
      amount: data.value,
      from_address: data.from_addr,
      to_address: data.to_addr,
      action: ActionType.RECEIVED,
      send_email_flg: true,
      amount_actual: data.value,
      symbol: "IRIS"
    }
  }
}

async function _getMemberFromAddress(platform, address) {
  var sql = `
  SELECT m.*
  FROM (SELECT w.*
      FROM wallet_priv_keys as k INNER JOIN wallets as w on k.wallet_id = w.id
      WHERE k.address ILIKE '${address}' AND k.platform='${platform}') as t
  INNER JOIN members as m ON t.member_id = m.id
    `;
  var rs = await db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT });
  return rs;
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
      address: content.from_address,
      amount: content.amount_actual,
      symbol: content.platform,
      txIdLink: config.explorer[content.platform].txIdLink + content.tx_id,
      addressLink: config.explorer[content.platform].addressLink + content.from_address
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.txReceived);
  } catch (err) {
    logger.error("Received coin/token alert email fail", err);
  }
} 