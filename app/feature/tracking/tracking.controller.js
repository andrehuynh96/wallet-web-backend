const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const config = require("app/config");

module.exports = async (req, res, next) => {
  try {
    let user = await Member.findOne({
      where: {
        email: req.user.email.toLowerCase(),
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ["email"] });
    }

    if (user.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }

    if (user.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }
    
    const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
    await MemberActivityLog.create({
      member_id: user.id,
      client_ip: registerIp,
      action: ActionType.SEND_COIN_TOKEN,
      user_agent: req.headers['user-agent'],
      data: req.body
    });

    // sendEmail[req.body.type](member, otp);
    
    return res.ok(true);
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};

// const sendEmail = {
//   [ActionType.SEND_COIN_TOKEN]: async (member, otp) => {
//     try {
//       let subject = `${config.emailTemplate.partnerName} - Create Account`;
//       let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
//       let data = {
//         imageUrl: config.website.urlImages,
//         link: `${config.website.urlActive}?token=${otp.code}`,
//         hours: config.expiredVefiryToken
//       }
//       data = Object.assign({}, data, config.email);
//       await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.verifyEmail);
//     } catch (err) {
//       logger.error("resend email create account fail", err);
//     }
//   },
//   [OtpType.FORGOT_PASSWORD]: async (member, otp) => {
//     try {
//       let subject = ` ${config.emailTemplate.partnerName} - Reset Password`;
//       let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
//       let data = {
//         imageUrl: config.website.urlImages,
//         link: `${config.linkWebsiteVerify}?token=${otp.code}`,
//         hours: config.expiredVefiryToken
//       }
//       data = Object.assign({}, data, config.email);
//       await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.resetPassword);
//     } catch (err) {
//       logger.error("resend email forgot password fail", err);
//     }
//   },
//   [OtpType.UNSUBCRIBE]: async (member, otp) => {
//     try {
//       let subject = ` ${config.emailTemplate.partnerName} - Reset Password`;
//       let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
//       let data = {
//         imageUrl: config.website.urlImages,
//         link: `${config.website.urlUnsubcribe}?token=${otp.code}`,
//         hours: config.expiredVefiryToken
//       }
//       data = Object.assign({}, data, config.email);
//       await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.resetPassword);
//     } catch (err) {
//       logger.error("resend email forgot password fail", err);
//     }
//   }
// } 