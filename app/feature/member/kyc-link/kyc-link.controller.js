const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const OtpType = require("app/model/wallet/value-object/otp-type");
const uuidV4 = require('uuid/v4');

module.exports = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        id: req.user.id
      }
    });

    if (!member) {
      return res.badRequest(res.__("NOT_FOUND_USER"), "NOT_FOUND_USER");
    }

    if (member.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    if (member.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    if (!member.kyc_id) {
      return res.badRequest(res.__("NOT_FOUND_KYC_ACCOUNT"), "NOT_FOUND_KYC_ACCOUNT");
    }

    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryToken);
    await OTP.update({
      expired: true
    }, {
        where: {
          member_id: member.id,
          action_type: OtpType.KYC_AUTHENTICATION
        },
        returning: true
      });

    let otp = await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      member_id: member.id,
      action_type: OtpType.KYC_AUTHENTICATION
    });
    if (!otp) {
      return res.serverInternalError();
    }

    let kycAuthLink = `${config.kyc.authUrl}${verifyToken}`
    return res.ok(kycAuthLink);

  }
  catch (err) {
    logger.error('create link kyc fail:', err);
    next(err);
  }
} 