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
const Webhook = require('app/lib/webhook');
const Membership = require('app/lib/reward-system/membership');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const EmailTemplate = require('app/model/wallet').email_templates;
const Term = require('app/model/wallet').terms;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  get: async (req, res, next) => {
    try {
      let result = await Member.findOne({
        where: {
          id: req.user.id,
          deleted_flg: false
        }
      });

      if (!result) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }

      if (result.referral_code) {
        let checkReferrerCode = await Membership.isCheckReferrerCode({ referrerCode: result.referral_code });
        if (checkReferrerCode.httpCode !== 200) {
          result.referral_code = "";
        } else if (!checkReferrerCode.data.data.isValid) {
          result.referral_code = "";
        }
      }

      let response = memberMapper(result);
      let now = new Date();
      let term = await Term.findOne({
        where: {
          is_published: true,
          applied_date: {
            [Op.lte]: now
          }
        },
        order: [['applied_date', 'DESC']],
        raw: true
      });

      response.new_term_condition = (term && result.term_condition_id != term.id);

      return res.ok(response);
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
          id: req.user.id,
          deleted_flg: false
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
          window: config.twofaStep
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
            returning: true,
            transaction
          })

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
          },
          transaction
        })
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
            returning: true,
            transaction
          })

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
          },
          transaction
        })

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
          id: otp.member_id,
          deleted_flg: false
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
          returning: true,
          transaction
        })
      await UnsubscribeReason.update({
        confirm_flg: true
      }, {
          where: {
            member_id: member.id
          },
          returning: true,
          transaction
        });

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
          // await WalletPrivateKey.destroy(
          //   {
          //     where: {
          //       wallet_id: wallet[i].id
          //     },
          //     transaction
          //   });
          // await WalletToken.destroy({
          //   where: {
          //     wallet_id: wallet[i].id
          //   },
          //   transaction
          // })
        }
        // await Wallet.destroy({
        //   where: {
        //     member_id: member.id
        //   },
        //   transaction
        // })
      }
      // await Member.destroy({
      //   where: {
      //     id: member.id
      //   },
      //   transaction
      // });

      await Member.update({
        deleted_flg: true
      }, {
          where: {
            id: member.id
          },
          returning: true,
          transaction
        });

      let deactivate = await Membership.deactivate({
        email: member.email
      });
      if (deactivate.httpCode !== 200) {
        if (transaction) {
          await transaction.rollback();
        }
        return res.status(deactivate.httpCode).send(deactivate.data);
      }

      if (!deactivate.data.data.isSuccess) {
        throw new Error("DEACTIVATE_AFFLIATE_FAIL");
      }

      await transaction.commit();

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

      if (privateKeys.length > 0) {
        for (let key of privateKeys) {
          Webhook.removeAddresses(key.platform, key.address);
        }
      }
      req.session.authenticated = false;
      req.session.user = undefined;
      return res.ok(true);
    }
    catch (err) {
      logger.error('delete account fail:', err);
      if (transaction) await transaction.rollback();
      next(err);
    }
  },
}

async function _sendEmail(member, verifyToken) {
  try {
    let templateName = EmailTemplateType.DEACTIVE_ACCOUNT
    let template = await EmailTemplate.findOne({
      where: {
        name: templateName,
        language: member.current_language
      }
    })

    if (!template) {
      template = await EmailTemplate.findOne({
        where: {
          name: templateName,
          language: 'en'
        }
      })
    }

    if (!template)
      return res.notFound(res.__("EMAIL_TEMPLATE_NOT_FOUND"), "EMAIL_TEMPLATE_NOT_FOUND", { fields: ["id"] });

    let subject = `${config.emailTemplate.partnerName} - ${template.subject}`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.website.urlUnsubscribe}${verifyToken}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithDBTemplate(subject, from, member.email, data, template.template);
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