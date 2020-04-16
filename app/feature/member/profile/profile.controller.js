const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const WalletToken = require('app/model/wallet').wallet_tokens;
const memberMapper = require('app/feature/response-schema/member.response-schema');
const mailer = require('app/lib/mailer');
const OTP = require("app/model/wallet").otps;
const database = require('app/lib/database').db().wallet;
const config = require("app/config");
const OtpType = require("app/model/wallet/value-object/otp-type");
const uuidV4 = require('uuid/v4');
const speakeasy = require("speakeasy");
const Kyc = require('app/lib/kyc');
const Webhook = require('app/lib/webhook');

module.exports = {
  get: async (req, res, next) => {
    try {
      let result = await Member.findOne({
        where: {
          id: req.user.id
        }
      })

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }
      let kyc = result.kyc_id && result.kyc_id != '0' ? await Kyc.getKycInfo({ kycId: result.kyc_id }) : null;
      result.kyc = kyc && kyc.data ? kyc.data.customer.kyc : null;
      return res.ok(memberMapper(result));
    }
    catch (err) {
      logger.error('getMe fail:', err);
      next(err);
    }
  },
  unsubcribe: async (req, res, next) => {
    try {
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      })
      if (!member) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }
      if (member.twofa_enable_flg) {
        let verifyToken = Buffer.from(uuidV4()).toString('base64');
        let today = new Date();
        today.setHours(today.getHours() + config.expiredVefiryToken);
        if (!req.body.twofa_code) {
          return res.badRequest(res.__("NOT_TWOFA_CODE"), "NOT_TWOFA_CODE")
        }
        var verified = speakeasy.totp.verify({
          secret: member.twofa_secret,
          encoding: 'base32',
          token: req.body.twofa_code,
        });
        if (!verified) {
          return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT", { fields: ["twofa_code"] });
        }
        await OTP.update({
          expired: true
        }, {
            where: {
              member_id: member.id,
              action_type: OtpType.UNSUBCRIBE
            },
            returning: true
          })

        await OTP.create({
          code: verifyToken,
          used: false,
          expired: false,
          expired_at: today,
          member_id: member.id,
          action_type: OtpType.UNSUBCRIBE
        })
        _sendEmail(member, verifyToken);
        return res.ok(true);
      }
      else {
        let verifyToken = Buffer.from(uuidV4()).toString('base64');
        let today = new Date();
        today.setHours(today.getHours() + config.expiredVefiryToken);
        await OTP.update({
          expired: true
        }, {
            where: {
              member_id: member.id,
              action_type: OtpType.UNSUBCRIBE
            },
            returning: true
          })

        await OTP.create({
          code: verifyToken,
          used: false,
          expired: false,
          expired_at: today,
          member_id: member.id,
          action_type: OtpType.UNSUBCRIBE
        })
        _sendEmail(member, verifyToken);
        return res.ok(true);
      }
    }
    catch (err) {
      logger.error('unsubcribe account fail:', err);
      next(err);
    }
  },
  delete: async (req, res, next) => {
    let transaction;
    try {
      logger.info('profile::delete');
      let today = new Date();
      let otp = await OTP.findOne({
        where: {
          code: req.body.verify_token,
        }
      })
      if (!otp) {
        return res.badRequest(res.__("TOKEN_INVALID"), "TOKEN_INVALID")
      }
      if (otp.expired_at < today || otp.expired || otp.used) {
        return res.badRequest(res.__('TOKEN_EXPIRED'), 'TOKEN_EXPIRED');
      }
      let member = await Member.findOne({
        where: {
          id: otp.member_id
        }
      })
      if (!member) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      transaction = await database.transaction();

      await OTP.update({
        expired: true
      }, {
          where: {
            member_id: member.id,
            action_type: OtpType.UNSUBCRIBE
          },
          returning: true
        })

      let privateKeys = [];
      let wallet = await Wallet.findAll({ where: { member_id: member.id } }, { transaction })
      if (wallet) {
        for (let i = 0; i < wallet.length; i++) {
          let keys = await WalletPrivateKey.findAll({
            where: {
              wallet_id: wallet[i].id
            }
          });
          privateKeys.push(...keys);
          await WalletPrivateKey.destroy({ where: { wallet_id: wallet[i].id } }, { transaction });
          await WalletToken.destroy({ where: { wallet_id: wallet[i].id } }, { transaction })
        }
        await Wallet.destroy({ where: { member_id: member.id } }, { transaction })
      }
      await Member.destroy({ where: { id: member.id } }, { transaction })
      await transaction.commit();
      if (privateKeys.length > 0) {
        for (let key of privateKeys) {
          Webhook.removeAddresses(key.platform, key.address);
        }
      }
      return res.ok(true);
    }
    catch (err) {
      logger.error('delete account fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  }
}

async function _sendEmail(member, verifyToken) {
  try {
    let subject = ` ${config.emailTemplate.partnerName} - Delete account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.website.urlUnsubcribe}?token=${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.deactiveAccount);
  } catch (err) {
    logger.error("send email unsubcribe account fail", err);
  }
}