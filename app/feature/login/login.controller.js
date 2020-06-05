const Sequelize = require('sequelize');
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
const Kyc = require('app/lib/kyc');
const Affiliate = require('app/lib/affiliate');

module.exports = async (req, res, next) => {
  try {
    let user = await Member.findOne({
      where: {
        email: req.body.email.toLowerCase(),
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
    }

    if (user.member_sts == MemberStatus.LOCKED) {
      return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
    }

    if (user.member_sts == MemberStatus.UNACTIVATED) {
      return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
    }

    const match = await bcrypt.compare(req.body.password, user.password_hash);
    if (!match) {
      if (user.attempt_login_number + 1 <= config.lockUser.maximumTriesLogin) {
        await Member.update({
          attempt_login_number: user.attempt_login_number + 1, // increase attempt_login_number in case wrong password
          latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
        }, {
            where: {
              id: user.id
            }
          })
        if (user.attempt_login_number + 1 == config.lockUser.maximumTriesLogin)
          return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
        else return res.unauthorized(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
      }
      else {
        let nextAcceptableLogin = new Date(user.latest_login_at ? user.latest_login_at : null);
        nextAcceptableLogin.setMinutes(nextAcceptableLogin.getMinutes() + parseInt(config.lockUser.lockTime));
        let rightNow = new Date();
        if (nextAcceptableLogin < rightNow) { // don't forbid if lock time has passed
          await Member.update({
            attempt_login_number: 1,
            latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
          }, {
              where: {
                id: user.id
              }
            });
          return res.unauthorized(res.__("LOGIN_FAIL"), "LOGIN_FAIL");
        }
        else return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
      }
    }
    else {
      let nextAcceptableLogin = new Date(user.latest_login_at ? user.latest_login_at : null);
      nextAcceptableLogin.setMinutes(nextAcceptableLogin.getMinutes() + parseInt(config.lockUser.lockTime));
      let rightNow = new Date();
      if (nextAcceptableLogin >= rightNow && user.attempt_login_number >= config.lockUser.maximumTriesLogin) // don't forbid if lock time has passed
        return res.forbidden(res.__("ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS"), "ACCOUNT_TEMPORARILY_LOCKED_DUE_TO_MANY_WRONG_ATTEMPTS");
      await Member.update({
        attempt_login_number: 0,
        latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
      }, {
          where: {
            id: user.id
          }
        })
    }
    /** update domain name */
    if (user.domain_name == null) {
      let length = config.plutx.format.length - user.domain_id.toString().length;
      let domainName = config.plutx.format.substr(1, length) + user.domain_id.toString() + `.${config.plutx.domain}`;
      let [_, [updatedUser]] = await Member.update({
        domain_name: domainName
      }, {
          where: {
            id: user.id
          },
          returning: true
        });
      user = updatedUser;
    }
    /** */
    /**create kyc account if not exist */
    if (!user.kyc_id || user.kyc_id == '0') {
      let id = await _createKyc(user.id, req.body.email.toLowerCase());
      if (id) {
        user.kyc_id = id;
      }
    }
    user = await _tryCreateAffiliate(user);

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
      let kyc = user.kyc_id && user.kyc_id != '0' ? await Kyc.getKycInfo({ kycId: user.kyc_id }) : null;
      user.kyc = kyc && kyc.data ? kyc.data.customer.kyc : null;
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
    let content = {};
    content[`${config.kyc.schema}`] = { email: email };
    let params = { body: [{ level: 1, content: content }], kycId: kycId };
    return await Kyc.submit(params);;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}
async function _updateStatus(kycId, action) {
  try {
    let params = { body: { level: 1, comment: "update level 1" }, kycId: kycId, action: action };
    await Kyc.updateStatus(params);
  } catch (err) {
    logger.error("update kyc account fail", err);
  }
}

async function _tryCreateAffiliate(member) {
  try {
    if (member.referral_code) {
      return member;
    }
    let result = await Affiliate.register({ email: member.email });
    if (result.httpCode == 200) {
      const [_, m] = await Member.update({
        referral_code: result.data.data.code,
        affiliate_id: result.data.data.client_affiliate_id
      }, {
          where: {
            id: member.id
          },
          returning: true,
          plain: true
        })
      return m;
    }
    return member;
  } catch (err) {
    logger.error("_create Affiliate fail", err);
  }
}