const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');
const database = require('app/lib/database').db().wallet;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const Kyc = require('app/lib/kyc');
const config = require("app/config");

module.exports = async (req, res, next) => {
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
        returning: true
      });

    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
      });

    // const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');

    // await MemberActivityLog.create({
    //   member_id: member.id,
    //   client_ip: registerIp,
    //   action: ActionType.VERIFY_ACCOUNT,
    //   user_agent: req.headers['user-agent']
    // });

    // req.session.authenticated = true;
    // req.session.user = member;
    let id = await _createKyc(member.id, member.email);
    if (id) {
      member.kyc_id = id;
    }
    return res.ok(memberMapper(member));
  }
  catch (err) {
    logger.error("verify member fail:", err);
    next(err);
  }
}


async function _createKyc(memberId, email) {
  try {
    /** create kyc */
    let params = { body: { email: email, type: config.kyc.type } };
    let kyc = await Kyc.createAccount(params);
    let id = null;
    if (kyc.data && kyc.data.id) {
      id = kyc.data.id;
      let submit = await _submitKyc(kyc.data.id, email);
      if (submit.data && submit.data.id) {
        _updateStatus(kyc.data.id, 'APPROVE');
      }
      await Member.update({
        kyc_id: kyc.data.id
      }, {
          where: {
            id: memberId,
          },
          returning: true
        });
    }
    return id;
  } catch (err) {
    logger.error("create kyc account fail", err);
  }
}
async function _submitKyc(kycId, email) {
  try {
    let params = { body: [{ level: 1, content: { kyc1: { email: email } } }], kycId: kycId };
    return await Kyc.submit(params);;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
async function _updateStatus(kycId, action) {
  try {
    let params = { body: { level: 1, expiry: 60000, comment: "update level 1" }, kycId: kycId, action: action };
    await Kyc.updateStatus(params);
  } catch (err) {
    logger.error("update kyc account fail", err);
  }
} 