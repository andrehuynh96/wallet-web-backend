const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MemberTransactionHis = require("app/model/wallet").member_transaction_his;
const MemberPlutx = require('app/model/wallet').member_plutxs;
const { getStakingPlan, getStakingPlatform } = require("app/lib/staking-api");
const MemberStatus = require("app/model/wallet/value-object/member-status");
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const config = require("app/config");
const mailer = require('app/lib/mailer');
const db = require("app/model/wallet");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const memberTrackingHisMapper = require('../response-schema/member-tracking-his.response-schema');
const Plutx = require('app/lib/plutx');

module.exports = {
  tracking: async (req, res, next) => {
    try {
      let user = await Member.findOne({
        where: {
          id: req.user.id
        }
      })

      if (!user) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      if (user.member_sts == MemberStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }

      if (user.member_sts == MemberStatus.UNACTIVATED) {
        return res.forbidden(
          res.__("UNCONFIRMED_ACCOUNT"),
          "UNCONFIRMED_ACCOUNT"
        );
      }

      let plutxSubdomain = await Plutx.getAddress({
        fullDomain: req.body.to_address,
        cryptoName: req.body.platform.toLowerCase()
      });
      if (!plutxSubdomain || plutxSubdomain.error) { }
      else {
        plutxSubdomain = plutxSubdomain.data;
        console.log(plutxSubdomain)
        req.body.member_domain_name = plutxSubdomain.fullDomain;
        req.body.to_address = plutxSubdomain.address;
      }

      let additionalInfo = {}
      additionalInfo.sender_note = req.body.note;
      additionalInfo.receiver_note = req.body.note;
      if (req.body.plan_id && req.body.plan_id.length > 0) {
        plan = await getStakingPlan(req.body.plan_id);
        if (plan) {
          additionalInfo.plan_id = req.body.plan_id;
          additionalInfo.staking_platform_id = plan.staking_platform_id;
          additionalInfo.duration = plan.duration;
          additionalInfo.duration_type = plan.duration_type;
          additionalInfo.reward_percentage = plan.reward_percentage;
          additionalInfo.validator_fee = 0;
          let platform = await getStakingPlatform(plan.staking_platform_id);
          if (platform) additionalInfo.validator_fee = platform.erc20_validator_fee;
        }
      }
      delete req.body.plan_id;
      delete req.body.note;

      let response = await MemberTransactionHis.create({
        member_id: user.id,
        ...req.body,
        ...additionalInfo
      });
      if (req.body.send_email_flg) await sendEmail[req.body.action](user, req.body);
      logger.info("create::tracking::create", JSON.stringify(response))
      return res.ok(memberTrackingHisMapper(response));
    } catch (err) {
      logger.error("alert send coin/token fail: ", err);
      next(err);
    }
  },
  getHis: async (req, res, next) => {
    try {
      let limit = req.query.limit ? parseInt(req.query.limit) : 10;
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = [];
      if (req.query.platform) {
        where.push({ platform: req.query.platform });
      }
      if (req.query.tx_id) {
        where.push({
          tx_id: {
            [Op.iLike]: req.query.tx_id
          }
        });
      }
      const {
        count: total,
        rows: items
      } = await MemberTransactionHis.findAndCountAll({
        limit,
        offset,
        include: [MemberPlutx],
        where: { [Op.or]: where },
        order: [["created_at", "DESC"]]
      });
      return res.ok({
        items: memberTrackingHisMapper(items.map(ele => {
          if (ele.member_plutx && !ele.member_plutx.active_flg) {
            ele.domain_name = null;
            ele.member_domain_name = null;
          }
          return ele;
        })),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error("get transaction history fail: ", err);
      next(err);
    }
  },
  getTxDetail: async (req, res, next) => {
    try {
      let response = await MemberTransactionHis.findOne({
        include: [MemberPlutx],
        where: {
          // platform: req.params.platform,
          tx_id: {
            [Op.iLike]: req.params.tx_id
          }
        }
      });
      if (!response)
        return res.badRequest(res.__("MEMBER_TX_HISTORY_NOT_FOUND"), "MEMBER_TX_HISTORY_NOT_FOUND");
      if (response.member_plutx && !response.member_plutx.active_flg) {
        response.domain_name = null;
        response.member_domain_name = null;
      }
      return res.ok(memberTrackingHisMapper(response));
    }
    catch (err) {
      logger.error("get transaction detail fail: ", err);
      next(err);
    }
  },
  update: async (req, res, next) => {
    try {
      let tx_id = req.params.tx_id;
      let platform = req.params.platform;
      let member_id = req.user.id;
      let address = req.body.address;
      let note = req.body.note || "";
      let memberTransactionHis = await MemberTransactionHis.findOne({
        where: {
          tx_id: tx_id,
          // platform: platform,
        }
      })
      if (!memberTransactionHis) {
        return res.badRequest(res.__("MEMBER_TX_HISTORY_NOT_FOUND"), "MEMBER_TX_HISTORY_NOT_FOUND");
      }
      let memberFromAddress = await _getMemberFromAddress(address, member_id)
      if (!memberFromAddress) {
        return res.forbidden(res.__('ADDRESS_NOT_FOUND'), 'ADDRESS_NOT_FOUND');
      }
      let response
      if (memberTransactionHis.from_address.toLowerCase() == memberFromAddress[0].address.toLowerCase()) {
        response = await MemberTransactionHis.update({
          sender_note: note
        }, {
          where: {
            tx_id: tx_id,
          },
        });
      }
      if (memberTransactionHis.to_address.toLowerCase() == memberFromAddress[0].address.toLowerCase()) {
        response = await MemberTransactionHis.update({
          receiver_note: note
        }, {
          where: {
            tx_id: tx_id,
          },
        });
      }
      if (!response) {
        return res.forbidden(res.__('ADDRESS_NOT_FOUND'), 'ADDRESS_NOT_FOUND');
      }
      logger.info('update::member transaction history::update')
      return res.ok(true)
    }
    catch (err) {
      logger.error("update transaction detail fail: ", err);
      next(err);
    }
  }
};

const sendEmail = {
  [ActionType.SEND]: async (member, content) => {
    try {
      let subject = `${config.emailTemplate.partnerName} - Send coin/token alert`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        banner: config.website.urlImages,
        imageUrl: config.website.urlIcon + content.platform.toLowerCase() + '.png',
        platform: config.explorer[content.platform].platformName,
        tx_id: content.tx_id,
        address: content.to_address,
        amount: content.amount,
        symbol: content.symbol,
        txIdLink: config.explorer[content.platform].txIdLink + content.tx_id,
        addressLink: config.explorer[content.platform].addressLink + content.address
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.txSent);
    } catch (err) {
      logger.error("send coin/token alert email fail", err);
    }
  }
}
async function _getMemberFromAddress(address, member_id) {
  var sql = `
  SELECT *
      FROM wallet_priv_keys as k INNER JOIN wallets as w on k.wallet_id = w.id
      WHERE k.address ILIKE '${address}' AND w.member_id='${member_id}' 
    `;
  var rs = await db.sequelize.query(sql, { type: db.sequelize.QueryTypes.SELECT });
  return rs;
}