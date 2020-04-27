const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const MemberStatus = require("app/model/wallet/value-object/member-status");
const mailer = require('app/lib/mailer');
const otplib = require("otplib");
const uuidV4 = require('uuid/v4');

module.exports = {
  resend: async (req, res, next) => {
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

      await _sendEmail[req.body.type](member, otp);
      return res.ok(true);

    }
    catch (err) {
      logger.error('resend email fail:', err);
      next(err);
    }
  },

  resendVerify: async (req, res, next) => {
    try {
      let otp = await OTP.findOne({
        where: {
          code: req.body.verify_token
        }
      })
      if (!otp) {
        return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ['verify_token'] })
      }
      if(otp.action_type !== OtpType.REGISTER){
        return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ['verify_token'] })
      }
      let member = await Member.findOne({
        where: {
          id: otp.member_id
        }
      })
      if(member.member_sts == MemberStatus.LOCKED){
        return res.badRequest(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED")
      }
      if(member.member_sts == MemberStatus.ACTIVATED){
        return res.badRequest(res.__("ACCOUNT_ACTIVATED"), "ACCOUNT_ACTIVATED")
      }
      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);
      await OTP.update({
        expired: true
      }, {
        where: {
          member_id: member.id
        },
        returning: true
      });
      let newOtp = await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        member_id: member.id,
        action_type: OtpType.REGISTER
      });
      if (!newOtp) {
        return res.serverInternalError();
      }

      await _sendEmail[OtpType.REGISTER](member, newOtp);
      return res.ok(true);
    }
    catch (err) {
      logger.error('resend verify email fail:', err);
      next(err);
    }
  }
}

const _sendEmail = {
  [OtpType.REGISTER]: async (member, otp) => {
    try {
      let subject = `${config.emailTemplate.partnerName} - Create Account`;
      let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
      let data = {
        imageUrl: config.website.urlImages,
        link: `${config.website.urlActive}${otp.code}`,
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
        link: `${config.linkWebsiteVerify}${otp.code}`,
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
        link: `${config.website.urlUnsubscribe}${otp.code}`,
        hours: config.expiredVefiryToken
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.deactiveAccount);
    } catch (err) {
      logger.error("resend email delete account fail", err);
    }
  }
} 