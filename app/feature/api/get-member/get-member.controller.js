const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const memberMapper = require('app/feature/response-schema/member.response-schema');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');
const Member = require('app/model/wallet').members;
const KycStatus = require('app/model/wallet/value-object/kyc-status');

module.exports = {
  get: async (req, res, next) => {
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
      return res.ok(memberMapper(member));
    }
    catch (err) {
      logger.error('get member fail: ', err);
      next(err);
    }
  },
  callback: async (req, res, next) => {
    try {
      let data = req.body;
      if (data.kyc && data.kyc.status == KycStatus.APPROVED) {
        let member = await Member.findOne({
          where: {
            email: data.customer.email,
            kyc_id: data.customer.id
          }
        });
        if (member) {
          await Member.update({
            kyc_level: data.kyc.level
          }, {
            where: {
              id: member.id
            }
          })
        } 
        if (req.session.authenticated && req.session.user.id == member.id) {
          req.session.user.kyc_level = data.kyc.level;
        }
      }
      return res.ok(true);
    } catch (error) {
      logger.error("kyc callback failed :", error);
      next(error);
    }
  }
};
