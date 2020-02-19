const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const config = require("app/config");
const mailer = require('app/lib/mailer');
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const uuidV4 = require('uuid/v4');

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        deleted_flg: false
      }
    });
    if (!member) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ["email"] });
    }

    if (member.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }

    if (member.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }

    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryToken);

    await OTP.update({
      expired: true
    }, {
        where: {
          member_id: member.id,
          action_type: OtpType.FORGOT_PASSWORD
        },
        returning: true
      })

    await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      member_id: member.id,
      action_type: OtpType.FORGOT_PASSWORD
    })

    _sendEmail(member, verifyToken);
    return res.ok(true);
  }
  catch (err) {
    logger.error("forgot password fail: ", err);
    next(err);
  }
};

async function _sendEmail(user, verifyToken) {
  try {
    let subject = 'Listco Account - Reset Account Password';
    let from = `Listco <${config.mailSendAs}>`;
    let data = {
      email: user.email,
      fullname: user.email,
      link: `${config.linkWebsiteVerify}?token=${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, "forgot-password.ejs");
  } catch (err) {
    logger.error("send email forgot password fail", err);
  }
}