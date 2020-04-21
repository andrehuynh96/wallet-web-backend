const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const mailer = require('app/lib/mailer');
const otplib = require("otplib");
const uuidV4 = require('uuid/v4');

module.exports = async (req, res, next) => {

  try {
    let member = await Member.findOne({
      where: {
        deleted_flg: false,
        email: req.body.email.toLowerCase()
      }
    });

    if (!member) {
      return res.badRequest(res.__("NOT_FOUND_USER"), "NOT_FOUND_USER", { fields: ['email'] });
    }

    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryToken);
    await OTP.update({
      expired: true
    }, {
        where: {
          member_id: member.id,
          action_type: req.body.type
        },
        returning: true
      });

    let otp = await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      member_id: member.id,
      action_type: req.body.type
    });
    if (!otp) {
      return res.serverInternalError();
    }

    sendEmail[req.body.type](member, otp);
    return res.ok(true);

  }
  catch (err) {
    logger.error('resend email fail:', err);
    next(err);
  }
}

const sendEmail = {
  [OtpType.REGISTER]: async (member, otp) => {
    try {
      let subject = `${config.emailTemplate.partnerName} - Create Account`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.website.urlActive}?token=${otp.code}`,
        hours: config.expiredVefiryToken
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.verifyEmail);
    } catch (err) {
      logger.error("resend email create account fail", err);
    }
  },
  [OtpType.FORGOT_PASSWORD]: async (member, otp) => {
    try {
      let subject = ` ${config.emailTemplate.partnerName} - Reset Password`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.linkWebsiteVerify}?token=${otp.code}`,
        hours: config.expiredVefiryToken
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.resetPassword);
    } catch (err) {
      logger.error("resend email forgot password fail", err);
    }
  },
  [OtpType.UNSUBSCRIBE]: async (member, otp) => {
    try {
      let subject = ` ${config.emailTemplate.partnerName} - Delete Account`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.website.urlUnsubscribe}?token=${otp.code}`,
        hours: config.expiredVefiryToken
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.resetPassword);
    } catch (err) {
      logger.error("resend email delete account fail", err);
    }
  }
} 