const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const memberMapper = require('app/feature/response-schema/member.response-schema');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');

module.exports = async (req, res, next) => {
  try {
    let otp = await OTP.findOne({
      where: {
        code: req.query.token,
        action_type: OtpType.KYC_AUTHENTICATION
      }
    });
    if (!otp) {
      return res.badRequest(res.__('TOKEN_INVALID'), 'TOKEN_INVALID', { fields: ['token'] });
    }
    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
    }

    let member = await Member.findOne({
      where: {
        id: otp.member_id
      }
    });
    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      });
    return res.ok(memberMapper(member));
  }
  catch (err) {
    logger.error('get member fail: ', err);
    next(err);
  }
} 