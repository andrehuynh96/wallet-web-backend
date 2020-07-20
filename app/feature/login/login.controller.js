const Sequelize = require('sequelize');
const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberActivityLog = require('app/model/wallet').member_activity_logs;
const OTP = require('app/model/wallet').otps;
const MembershipType = require('app/model/wallet').membership_types;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const ActionType = require('app/model/wallet/value-object/member-activity-action-type');
const OtpType = require('app/model/wallet/value-object/otp-type');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const bcrypt = require('bcrypt');
const config = require("app/config");
const uuidV4 = require('uuid/v4');
const Affiliate = require('app/lib/reward-system/affiliate');
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const PluTXUserIdApi = require('app/lib/plutx-userid');
const Membership = require('app/lib/reward-system/membership');

const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;

const controller = {
  login: async (req, res, next) => {
    try {
      const email = req.body.email.toLowerCase();
      const password = req.body.password;
      let user = null;
      let refreshToken = null;

      if (IS_ENABLED_PLUTX_USERID) {
        const loginResult = await PluTXUserIdApi.login(email, password);

        if (loginResult.httpCode !== 200) {
          return res.status(loginResult.httpCode).send(loginResult.data);
        }

        const { refresh_token, profile: userProfile } = loginResult.data;
        refreshToken = refresh_token;
        user = await Member.findOne({
          where: {
            email: email,
            deleted_flg: false,
          }
        });

        // If user creates account in Plutx and
        // this is the first time he login in to Moonstake WebWallet, he doesn't have account
        if (!user) {
          const freeMembershipType = await MembershipType.findOne({
            where: {
              type: MembershipTypeName.Free,
            }
          });

          user = await Member.create({
            email,
            password_hash: '',
            member_sts: MemberStatus.ACTIVATED,
            phone: '',
            plutx_userid_id: userProfile.id,
            referral_code: '',
            referrer_code: null,
            affiliate_id: null,
            membership_type_id: freeMembershipType ? freeMembershipType.id : null,
          });
        }
      } else {
        user = await Member.findOne({
          where: {
            email,
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

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
          if (user.attempt_login_number + 1 <= config.lockUser.maximumTriesLogin) {
            await Member.update({
              attempt_login_number: user.attempt_login_number + 1, // increase attempt_login_number in case wrong password
              latest_login_at: Sequelize.fn('NOW') // TODO: review this in case 2fa is enabled
            }, {
                where: {
                  id: user.id
                }
              });

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
            });
        }
      }

      return controller.verify2FA({ req, res, next, user, refreshToken, isIgnored2FA: false });
    }
    catch (err) {
      logger.error("login fail: ", err);
      next(err);
    }
  },
  acceptSsoToken: async (req, res, next) => {
    try {
      const { body } = req;
      const { token } = body;
      const otp = await OTP.findOne({
        where: {
          code: token,
          action_type: OtpType.SSO_TOKEN,
        }
      });

      if (!otp) {
        return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID", { fields: ["token"] });
      }

      const today = new Date();
      if (otp.expired_at < today || otp.expired || otp.used) {
        return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
      }

      const user = await Member.findOne({
        where: {
          id: otp.member_id
        }
      });

      if (!user) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      if (user.member_sts == MemberStatus.UNACTIVATED) {
        return res.forbidden(res.__("UNCONFIRMED_ACCOUNT"), "UNCONFIRMED_ACCOUNT");
      }

      if (user.member_sts == MemberStatus.LOCKED) {
        return res.forbidden(res.__("ACCOUNT_LOCKED"), "ACCOUNT_LOCKED");
      }

      const refreshToken = null;

      return controller.verify2FA({ req, res, next, user, refreshToken, isIgnored2FA: true });
    } catch (err) {
      logger.error("login fail: ", err);
      next(err);
    }
  },
  verify2FA: async ({ req, res, next, user, refreshToken, isIgnored2FA }) => {
    try {
      const email = user.email.toLowerCase();

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

      user = await _tryCreateAffiliate(user);

      if (!isIgnored2FA && user.twofa_enable_flg) {
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
          });

        await OTP.create({
          code: verifyToken,
          used: false,
          expired: false,
          expired_at: today,
          member_id: user.id,
          action_type: OtpType.TWOFA
        });

        return res.ok({
          twofa: true,
          verify_token: verifyToken
        });
      }

      const registerIp = (req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.headers['x-client'] || req.ip).replace(/^.*:/, '');
      await MemberActivityLog.create({
        member_id: user.id,
        client_ip: registerIp,
        action: ActionType.LOGIN,
        user_agent: req.headers['user-agent']
      });

      if (user.referral_code) {
        let checkReferrerCode = await Membership.isCheckReferrerCode({ referrerCode: user.referral_code });
        if (checkReferrerCode.httpCode !== 200) {
          user.referral_code = "";
        } else if (!checkReferrerCode.data.data.isValid) {
          user.referral_code = "";
        }
      }
      req.session.authenticated = true;
      req.session.user = user;
      req.session.refreshToken = refreshToken;

      return res.ok({
        twofa: false,
        user: memberMapper(user)
      });
    } catch (err) {
      logger.error("login fail: ", err);
      next(err);
    }
  },

};

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

module.exports = controller;
