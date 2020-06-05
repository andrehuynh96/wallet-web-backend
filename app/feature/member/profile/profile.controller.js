const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const WalletToken = require('app/model/wallet').wallet_tokens;
const memberMapper = require('app/feature/response-schema/member.response-schema');
const mailer = require('app/lib/mailer');
const OTP = require("app/model/wallet").otps;
const Setting = require("app/model/wallet").settings;
const UnsubscribeReason = require("app/model/wallet").member_unsubscribe_reasons;
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
  unsubscribe: async (req, res, next) => {
    let transaction
    try {
      let reasons = req.body.reasons
      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      })
      if (!member) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      let verifyToken = Buffer.from(uuidV4()).toString('base64');
      let today = new Date();
      today.setHours(today.getHours() + config.expiredVefiryToken);

      transaction = await database.transaction();
      reasons.map(ele => {
        ele.member_id = member.id,
          ele.token = verifyToken,
          ele.confirm_flg = false,
          ele.email = member.email,
          ele.fullname = member.fullname
      })
      if (member.twofa_enable_flg) {
        if (!req.body.twofa_code) {
          return res.badRequest(res.__("NOT_TWOFA_CODE"), "NOT_TWOFA_CODE", { fields: ["twofa_code"] });
        }
        var verified = speakeasy.totp.verify({
          secret: member.twofa_secret,
          encoding: 'base32',
          token: req.body.twofa_code,
          window: 10
        });
        if (!verified) {
          return res.badRequest(res.__("TWOFA_CODE_INCORRECT"), "TWOFA_CODE_INCORRECT", { fields: ["twofa_code"] });
        }
        await OTP.update({
          expired: true
        }, {
            where: {
              member_id: member.id,
              action_type: OtpType.UNSUBSCRIBE
            },
            returning: true
          }, { transaction })

        await OTP.create({
          code: verifyToken,
          used: false,
          expired: false,
          expired_at: today,
          member_id: member.id,
          action_type: OtpType.UNSUBSCRIBE
        }, { transaction })
        await UnsubscribeReason.destroy({
          where: {
            member_id: member.id,
            confirm_flg: false
          }
        }, { transaction })
        let results = await UnsubscribeReason.bulkCreate(reasons, { transaction })
        logger.info('create::member unsubscribe reasons::create 2fa ', JSON.stringify(results))
        await transaction.commit();
        _sendEmail(member, verifyToken);
        return res.ok(true);
      }
      else {
        await OTP.update({
          expired: true
        }, {
            where: {
              member_id: member.id,
              action_type: OtpType.UNSUBSCRIBE
            },
            returning: true
          }, { transaction })

        await OTP.create({
          code: verifyToken,
          used: false,
          expired: false,
          expired_at: today,
          member_id: member.id,
          action_type: OtpType.UNSUBSCRIBE
        }, { transaction })

        await UnsubscribeReason.destroy({
          where: {
            member_id: member.id,
            confirm_flg: false
          }
        }, { transaction })

        let results = await UnsubscribeReason.bulkCreate(reasons, { transaction })
        logger.info('create::member unsubscribe reasons::create not 2fa', JSON.stringify(results))
        await transaction.commit();
        _sendEmail(member, verifyToken);
        return res.ok(true);
      }
    }
    catch (err) {
      logger.error('unsubscribe account fail:', err);
      if (transaction) await transaction.rollback();
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
            action_type: OtpType.UNSUBSCRIBE
          },
          returning: true
        }, { transaction })
      await UnsubscribeReason.update({
        confirm_flg: true
      }, {
          where: {
            member_id: member.id
          },
          returning: true
        }, { transaction }
      )

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

      let enableSendEmail = await Setting.findOne({
        where: {
          key: "SEND_EMAIL_UNSUBCRIBE"
        }
      })
      if (enableSendEmail && enableSendEmail.value == 1) {
        let adminEmailAddress = await Setting.findOne({
          where: {
            key: "ADMIN_EMAIL_ADDRESS"
          }
        })
        if (adminEmailAddress && adminEmailAddress.value) {
          //TODO: Will handle case many reason in future
          let resons = await UnsubscribeReason.findOne({
            where: {
              member_id: member.id
            },
            order: [['created_at', 'DESC']]
          })
          await _sendAdminEmail(member.email, adminEmailAddress.value, resons)
        }
      }
      await transaction.rollback();
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
      link: `${config.website.urlUnsubscribe}${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.deactiveAccount);
  } catch (err) {
    logger.error("send email unsubscribe account fail", err);
  }
}
async function _sendAdminEmail(member, adminAddress, resons) {
  try {
    let subject = ` ${config.emailTemplate.partnerName} - Delete account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      email: member,
      question: resons.question,
      answer: resons.answer
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, adminAddress, data, config.emailTemplate.deactiveAccountToAdmin);
  } catch (err) {
    logger.error("send email unsubscribe account fail", err);
  }
}