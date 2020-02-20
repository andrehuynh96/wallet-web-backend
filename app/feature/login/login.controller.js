const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const OTP = require('app/model/wallet').otps;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const OtpType = require('app/model/wallet/value-object/otp-type');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const bcrypt = require('bcrypt');
const config = require("app/config");
const uuidV4 = require('uuid/v4');
module.exports = async (req, res, next) => {
  try {
    let user = await Member.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND", { fields: ["email"] });
    }
    const match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!match) {
      return res.unauthorized(res.__("LOGIN_FAIL", "LOGIN_FAIL"));
    }

    if (user.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT", "UNCONFIRMED_ACCOUNT"));
    }

    if (user.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED", "ACCOUNT_LOCKED"));
    }
    if (user.twofa_enable_flg) {
      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);

      await OTP.update({
        expired: true
      }, {
          where: {
            member_id: user.id,
            action_type: OtpType.TWOFA
          },
          returning: true
        })

      await OTP.create({
        code: verifyToken,
        used: false,
        expired: false,
        expired_at: today,
        member_id: user.id,
        action_type: OtpType.TWOFA
      })

      return res.ok({
        twofa: true,
        verify_token: verifyToken
      });
    }
    else {
      const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
      await MemberActivityLog.create({
        member_id: user.id,
        client_ip: registerIp,
        action: ActionType.LOGIN,
        user_agent: req.headers['user-agent']
      });

      req.session.authenticated = true;
      req.session.user = user;
      return res.ok({
        twofa: false,
        user: memberMapper(user)
      });
    }
  }
  catch (err) {
    logger.error("login fail: ", err);
    next(err);
  }
};
