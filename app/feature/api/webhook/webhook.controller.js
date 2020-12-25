const logger = require('app/lib/logger');
const Webhook = require('app/lib/webhook');
const MemberTransactionHis = require("app/model/wallet").member_transaction_his;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const config = require("app/config");
const mailer = require('app/lib/mailer');
const db = require("app/model/wallet");
const BigNumber = require('bignumber.js');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const EmailTemplate = require('app/model/wallet').email_templates;
const Currency = require('app/model/wallet').currencies;

module.exports = async (req, res, next) => {
  try {
    logger.info(`webhook::api ${req.params.platform} ::data ${JSON.stringify(req.data)}`);
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
      data.amount = _formatAmount(data.amount);

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
    let templateName = EmailTemplateType.TRANSACTION_RECEIVED
    let template = await EmailTemplate.findOne({
      where: {
        name: templateName,
        language: member.current_language
      }
    })

    if (!template) {
      template = await EmailTemplate.findOne({
        where: {
          name: templateName,
          language: 'en'
        }
      })
    }

    if (!template) {
      return res.notFound(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ["id"] });
    }

    const currency = await Currency.findOne({
      where: {
        platform: content.platform,
        symbol: content.symbol
      }
    });

    if(!currency) {
      return res.notFound(res.__("PLATFORM_NOT_FOUND"), "PLATFORM_NOT_FOUND", { fields: ["symbol","platform"] });
    }

    let subject = `${config.emailTemplate.partnerName} - ${template.subject}`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      banner: config.website.urlImages,
      imageUrl: config.website.urlIcon + content.platform.toLowerCase() + '.png',
      platform: currency.name,
      tx_id: content.tx_id,
      address: content.from_address,
      amount: content.amount_actual,
      symbol: content.platform,
      txIdLink: currency.transaction_format_link ? currency.transaction_format_link + content.tx_id : '',
      addressLink: currency.address_format_link ? currency.address_format_link + content.tx_id : ''
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithDBTemplate(subject, from, member.email, data, template.template);
  } catch (err) {
    logger.error("Received coin/token alert email fail", err);
    throw err
  }
}

function _formatAmount(value, decimal = 6, currency = null, rate = null) {
  if (!value) {
    return 0;
  }
  if (currency && rate) {
    value = BigNumber(value).times(BigNumber(rate))
  }
  value = BigNumber(value);
  var formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimal,
    minimumFractionDigits: 0
  });
  return formatter.format(value.toNumber()).replace("$", "");
};
