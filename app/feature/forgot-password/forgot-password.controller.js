const logger = require('app/lib/logger');
const Member = require("app/model/wallet").members;
const MemberStatus = require("app/model/wallet/value-object/member-status");
const config = require("app/config");
const mailer = require('app/lib/mailer');
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const uuidV4 = require('uuid/v4');
const PluTXUserIdApi = require('app/lib/plutx-userid');

const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        deleted_flg: false,
      }
    });
    if (!member) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ["email"] });
    }

    if (member.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    if (member.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    const expiredHours = config.expiredVefiryToken;
    if (IS_ENABLED_PLUTX_USERID && member.plutx_userid_id) {
      const subject = `${config.emailTemplate.partnerName} - Reset Password`;
      const from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      const rawTemplate = mailer.getRawTemplate(config.emailTemplate.resetPassword);
      const data = {
        subject,
        from,
        email: member.email,
        imageUrl: config.website.urlImages,
        link: config.linkWebsiteVerify,
        hours: config.expiredVefiryToken,
        rawTemplate: rawTemplate.toString(),
      };
      const forgotPasswordResult = await PluTXUserIdApi.forgotPassword(member.plutx_userid_id, data);

      if (forgotPasswordResult.httpCode !== 200) {
        return res.status(forgotPasswordResult.httpCode).send(forgotPasswordResult.data);
      }

      return res.ok(true);
    }

    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let today = new Date();
    today.setHours(today.getHours() + expiredHours);

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

async function _sendEmail(member, verifyToken) {
  try {
    let subject = ` ${config.emailTemplate.partnerName} - Reset Password`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.linkWebsiteVerify}${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.resetPassword);
  } catch (err) {
    logger.error("send email forgot password fail", err);
  }
}
