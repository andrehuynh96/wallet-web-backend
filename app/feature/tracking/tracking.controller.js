const logger = require("app/lib/logger");
const Member = require("app/model/wallet").members;
const MemberTransactionHis = require("app/model/wallet").member_transaction_his;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const config = require("app/config");
const mailer = require('app/lib/mailer');

module.exports = async (req, res, next) => {
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

    let response = await MemberTransactionHis.create({
      member_id: user.id,
      ...req.body
    });

    if (req.body.send_email_flg) await sendEmail[req.body.action](user, req.body);

    return res.ok(response);
  } catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};

const sendEmail = {
  [ActionType.SEND]: async (member, content) => {
    try {
      let subject = `${config.emailTemplate.partnerName} - Send coin/token alert`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${content.toString()}`,
        hours: config.expiredVefiryToken
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.verifyEmail);
    } catch (err) {
      logger.error("send coin/token alert email create account fail", err);
    }
  }
}
