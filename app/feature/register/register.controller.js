const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet/otp").opts;
const OtpType = require("app/model/wallet/value-object/otp-type");
const memberMapper = require('app/feature/response-schema/member.response-schema');
const bcrypt = require('bcrypt');
const mailer = require('app/lib/mailer');
const database = require('app/lib/database').db().wallet;
const otplib = require("otplib");
const Hashids = require('hashids/cjs');
const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const uuidV4 = require('uuid/v4');

module.exports = async (req, res, next) => {
  const transaction = await database.transaction();
  try {
    let emailExists = await Member.findOne({
      where: {
        deleted_flg: false,
        email: req.body.email
      }
    });

    if (emailExists) {
      return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY", { fields: ['email'] });
    }

    let phoneExists = await Member.findOne({
      where: {
        deleted_flg: false,
        phone: req.body.phone
      }
    });

    if (phoneExists) {
      return res.badRequest(res.__("PHONE_EXISTS_ALREADY"), "PHONE_EXISTS_ALREADY", { fields: ['phone'] });
    }
    let salt = `${Date.now().toString()}`;
    let hashids = new Hashids(salt, 8, base58chars);
    let referralCode = hashids.encode(member.id);
    let password = bcrypt.hashSync(req.body.password, 10);
    let member = await User.create({
      email: req.body.email,
      password_hash: password,
      phone: req.body.phone,
      referral_code: referralCode,
      referrer_code: req.body.referrer_code || "",
    }, { transaction });
    if (!member) {
      await transaction.rollback();
      return res.serverInternalError();
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
          action_type: OtpType.REGISTER
        },
        returning: true
      });

    let otp = await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      member_id: member.id,
      action_type: OtpType.REGISTER
    }, { transaction });
    if (!otp) {
      await transaction.rollback();
      return res.serverInternalError();
    }

    await transaction.commit();
    _sendEmail(member, otp);
    let response = memberMapper(member);
    return res.ok(response);

  }
  catch (err) {
    logger.error('register fail:', err);
    await transaction.rollback();
    next(err);
  }
}

async function _sendEmail(member, otp) {
  try {
    let subject = 'Listco Account - Register Account';
    let from = `Listco <${config.mailSendAs}>`;
    let data = {
      email: member.email,
      fullname: member.email,
      site: config.websiteUrl,
      link: `${config.website.urlActive}/${otp.code}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, user.email, data, "register-member.ejs");
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}