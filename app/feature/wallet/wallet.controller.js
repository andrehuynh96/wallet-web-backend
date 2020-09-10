const logger = require('app/lib/logger');
const Wallet = require('app/model/wallet').wallets;
const WalletPrivateKey = require('app/model/wallet').wallet_priv_keys;
const WalletToken = require('app/model/wallet').wallet_tokens;
const database = require('app/lib/database').db().wallet;
const Member = require('app/model/wallet').members;
const mapper = require('app/feature/response-schema/wallet.response-schema');
const speakeasy = require('speakeasy');
const Webhook = require('app/lib/webhook');
const config = require('app/config');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type');
const EmailTemplate = require('app/model/wallet').email_templates;
const uuidV4 = require('uuid/v4');
const mailer = require('app/lib/mailer');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var wallet = {};

wallet.create = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet::create');
    let user = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });
    if (!user) {
      return res.badRequest(res.__('USER_NOT_FOUND'), 'USER_NOT_FOUND');
    }

    transaction = await database.transaction();

    if (req.body.default_flg) {
      await Wallet.update({ default_flg: false }, {
        where: {
          member_id: req.user.id,
          default_flg: true
        },
        returning: true,
        transaction
      });
    }

    let data = {
      member_id: req.user.id,
      name: req.body.name,
      default_flg: req.body.default_flg ? req.body.default_flg : false,
      backup_passphrase_flg: req.body.backup_passphrase_flg ? req.body.backup_passphrase_flg : false,
      encrypted_passphrase: req.body.encrypted_passphrase
    }
    let wallet = await Wallet.create(data, { transaction });
    await transaction.commit();
    return res.ok(mapper(wallet));
  } catch (ex) {
    logger.error(ex);
    if (transaction) await transaction.rollback();
    next(ex);
  }
}

wallet.update = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet::update');
    const { params: { id }, body } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }

    transaction = await database.transaction();

    if (body.default_flg) {
      await Wallet.update({
        default_flg: false
      }, {
          where: {
            member_id: req.user.id,
            default_flg: true
          },
          returning: true,
          transaction
        });
    }
    let [_, [result]] = await Wallet.update(body, {
      where: {
        id: id
      },
      returning: true,
      transaction
    });
    await transaction.commit();
    return res.ok(mapper(result));
  } catch (ex) {
    logger.error(ex);
    if (transaction) await transaction.rollback();
    next(ex);
  }
}

wallet.confirm = async (req, res, next) => {
  let transaction;
  try {
    logger.info('wallet::confirm delete');
    let otp = await OTP.findOne({
      where: {
        code: req.body.token,
        action_type: OtpType.DELETE_WALLET
      }
    });
    if (!otp) {
      return res.badRequest(res.__('TOKEN_INVALID'), 'TOKEN_INVALID', { fields: ['token'] });
    }
    let today = new Date();
    if (otp.expired_at < today || otp.expired || otp.used) {
      return res.badRequest(res.__("TOKEN_EXPIRED"), "TOKEN_EXPIRED");
    }

    let wallet = await Wallet.findOne({
      where: {
        id: otp.member_id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }

    transaction = await database.transaction();

    let keys = await WalletPrivateKey.findAll({
      where: {
        wallet_id: wallet.id
      }
    });

    if (wallet.default_flg) {
      let defaultWallet = await Wallet.findOne({
        where: {
          member_id: req.user.id,
          deleted_flg: false,
          default_flg: false,
          id: {
            [Op.ne]: wallet.id
          }
        }
      });
      if (defaultWallet) {
        await Wallet.update({
          default_flg: true
        }, {
            where: {
              id: defaultWallet.id
            },
            transaction
          });
      }
    }

    await WalletPrivateKey.update({
      deleted_flg: true
    }, {
        where: {
          wallet_id: wallet.id
        },
        transaction
      });
    await WalletToken.update({
      deleted_flg: true
    }, {
        where: {
          wallet_id: wallet.id
        },
        transaction
      });
    await Wallet.update({
      deleted_flg: true
    }, {
        where: {
          id: wallet.id
        },
        transaction
      });
    
    
    for (let key of keys) {
      Webhook.removeAddresses(key.platform, key.address);
    }
    await OTP.update({
      used: true
    }, {
        where: {
          id: otp.id
        },
        transaction
      });
    await transaction.commit();
    return res.ok({ deleted: true, wallet_name: wallet.name });
    
  } catch (error) {
    logger.error(error);
    if (transaction) await transaction.rollback();
    next(error);
  }
};

wallet.getPassphrase = async (req, res, next) => {
  try {
    const { params: { wallet_id }, query: { twofa_code } } = req;

    let user = await Member.findOne({
      where: {
        id: req.user.id,
        deleted_flg: false
      }
    });

    if (user.twofa_download_key_flg) {
      var verified = speakeasy.totp.verify({
        secret: user.twofa_secret,
        encoding: 'base32',
        token: twofa_code,
        window: config.twofaStep
      });
      if (!verified) {
        return res.badRequest(res.__('TWOFA_CODE_INCORRECT'), 'TWOFA_CODE_INCORRECT', { fields: ['twofa_code'] });
      }
    }

    let wallet = await Wallet.findOne({
      where: {
        id: wallet_id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }

    return res.ok({ encrypted_passphrase: wallet.encrypted_passphrase });
  } catch (ex) {
    logger.error(ex);
    next(ex);
  }
}

wallet.delete = async (req, res, next) => {
  try {
    let member = await Member.findOne({
      where: {
        deleted_flg: false,
        id: req.user.id
      }
    });

    if (!member) {
      return res.badRequest(res.__("NOT_FOUND_USER"), "NOT_FOUND_USER", { fields: ['user'] });
    }
    const { params: { id } } = req;
    let wallet = await Wallet.findOne({
      where: {
        id: id,
        member_id: req.user.id,
        deleted_flg: false
      }
    });
    if (!wallet) {
      return res.badRequest(res.__("WALLET_NOT_FOUND"), "WALLET_NOT_FOUND");
    }
    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryToken);
    await OTP.update({
      expired: true
    }, {
        where: {
          member_id: wallet.id,
          action_type: OtpType.DELETE_WALLET
        },
        returning: true
      });

    let otp = await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: today,
      member_id: wallet.id,
      action_type: OtpType.DELETE_WALLET
    });
    if (!otp) {
      return res.serverInternalError();
    }

    _sendEmail(member, wallet, otp);
    return res.ok(true);
  } catch (err) {
    logger.error()
    next(err);
  }
}
const _sendEmail =  async (member, wallet, otp) => {
    try {
      let templateName = EmailTemplateType.DELETE_WALLET
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
        link: `${config.website.urlDeleteWallet}${otp.code}`,
        hours: config.expiredVefiryToken,
        walletName: wallet.name
      }
      data = Object.assign({}, data, config.email);
      await mailer.sendWithDBTemplate(subject, from, member.email, data, template.template);
    } catch (err) {
      logger.error("send email delete wallet fail", err);
    }
  
} 
module.exports = wallet;