const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet/otp").opts;
const OtpType = require("app/model/staking/value-object/otp-type");
const bcrypt = require('bcrypt');
const mailer = require('app/lib/mailer');
const database = require('app/lib/database').db().wallet;
const otplib = require("otplib");
const Hashids = require('hashids');
const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

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
      return res.babRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY");
    }

    let phoneExists = await Member.findOne({
      where: {
        deleted_flg: false,
        phone: req.body.phone
      }
    });

    if (phoneExists) {
      return res.babRequest(res.__("PHONE_EXISTS_ALREADY"), "PHONE_EXISTS_ALREADY");
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

    let otpCode = otplib.authenticator.generate(Date.now().toString());
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryOTP);
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
      code: otpCode,
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

  }
  catch (err) {
    logger.error('register fail:', err);
    await transaction.rollback();
    next(err);
  }
}

async function _sendEmail() {

}