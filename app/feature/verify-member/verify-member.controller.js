const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');
const database = require('app/lib/database').db().wallet;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');

module.exports = async (req, res, next) => {
  const transaction = await database.transaction();
  try {
    let otp = await OTP.findOne({
      where: {
        code: req.body.verify_token,
        action_type: OtpType.REGISTER
      }
    });

    if (!otp) {
      return res.badRequest(res.__('TOKEN_INVALID'), 'TOKEN_INVALID', { fields: ['verify_token'] });
    }

    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__('TOKEN_EXPIRED'), 'TOKEN_EXPIRED');
    }

    let member = await Member.findOne({
      where: {
        id: otp.member_id
      }
    });
    if (!member) {
      return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
    }

    await Member.update({
      member_sts: MemberStatus.ACTIVATED
    }, {
        where: {
          id: member.id
        },
        returning: true,
        transaction
      });

    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      });

    await transaction.commit();
    const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');

    await MemberActivityLog.create({
      member_id: member.id,
      client_ip: registerIp,
      action: ActionType.VERIFY_ACCOUNT,
      user_agent: req.headers['user-agent']
    });

    req.session.authenticated = true;
    req.session.user = member;
    return res.ok(memberMapper(member));
  }
  catch (err) {
    await transaction.rollback();
    logger.error("verify member fail:", err);
    next(err);
  }
}