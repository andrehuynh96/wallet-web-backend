const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const speakeasy = require('speakeasy');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const Kyc = require('app/lib/kyc');

module.exports = async (req, res, next) => {
  try {
    let otp = await OTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: OtpType.TWOFA
      }
    });
    if (!otp) {
      return res.badRequest(res.__('TOKEN_INVALID'), 'TOKEN_INVALID', { fields: ['verify_token'] });
    }

    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__('TOKEN_EXPIRED'), 'TOKEN_EXPIRED', { fields: ['verify_token'] });
    }

    let user = await Member.findOne({
      where: {
        id: otp.member_id
      }
    });
    if (!user) {
      return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
    }

    if (user.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__('UNCONFIRMED_ACCOUNT'), 'UNCONFIRMED_ACCOUNT');
    }

    if (user.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__('ACCOUNT_LOCKED'), 'ACCOUNT_LOCKED');
    }

    var verified = speakeasy.totp.verify({
      secret: user.twofa_secret,
      encoding: 'base32',
      token: req.body.twofa_code,
    });

    if (!verified) {
      return res.badRequest(res.__('TWOFA_CODE_INCORRECT'), 'TWOFA_CODE_INCORRECT', { fields: ['twofa_code'] });
    }

    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      });

    const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');

    await MemberActivityLog.create({
      member_id: user.id,
      client_ip: registerIp,
      action: ActionType.LOGIN,
      user_agent: req.headers['user-agent']
    });
    let kyc = await Kyc.getKycInfo({ kycId: user.kyc_id });
    user.kyc = kyc.data ? kyc.data.customer.kyc : null;
    req.session.authenticated = true;
    req.session.user = user;
    return res.ok(memberMapper(user));
  }
  catch (err) {
    logger.error('login fail: ', err);
    next(err);
  }
};
