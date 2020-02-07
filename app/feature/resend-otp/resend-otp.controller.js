const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet/otp").opts;
const OtpType = require("app/model/staking/value-object/otp-type");
const mailer = require('app/lib/mailer');
const otplib = require("otplib");
const uuidV4 = require('uuid/v4');

module.exports = async (req, res, next) => {

  try {
    let member = await Member.findOne({
      where: {
        deleted_flg: false,
        email: req.body.email
      }
    });

    if (!member) {
      return res.babRequest(res.__("NOT_FOUND_USER"), "NOT_FOUND_USER", { fields: ['email'] });
    }

    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let otpCode = otplib.authenticator.generate(Date.now().toString());
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
      code: otpCode,
      token: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      member_id: member.id,
      action_type: req.body.type
    });
    if (!otp) {
      return res.serverInternalError();
    }

    _sendEmail(member, otp);
    return res.ok({
      verify_token: verifyToken
    });

  }
  catch (err) {
    logger.error('resend otp fail:', err);
    next(err);
  }
}

async function _sendEmail(member, otp) {
  try {
    let subject = 'Listco Account - New OTP';
    let from = `Listco <${config.mailSendAs}>`;
    let data = {
      email: member.email,
      fullname: member.email,
      site: config.websiteUrl,
      otp: otp.code,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, "resend-otp.ejs");
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}