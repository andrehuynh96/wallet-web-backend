const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const MembershipType = require('app/model/wallet').membership_types;
const OtpType = require("app/model/wallet/value-object/otp-type");
const MembershipTypeName = require('app/model/wallet/value-object/membership-type-name');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const bcrypt = require('bcrypt');
const mailer = require('app/lib/mailer');
const uuidV4 = require('uuid/v4');
const Affiliate = require('app/lib/reward-system/affiliate');
const PluTXUserIdApi = require('app/lib/plutx-userid');
const MemberStatus = require("app/model/wallet/value-object/member-status");
const EmailTemplateType = require('app/model/wallet/value-object/email-template-type')
const EmailTemplate = require('app/model/wallet').email_templates;
const MemberSetting = require('app/model/wallet').member_settings;
const database = require('app/lib/database').db().wallet;

const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;

module.exports = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase().trim();
    let emailExists = await Member.findOne({
      where: {
        deleted_flg: false,
        email,
      }
    });

    if (emailExists) {
      return res.badRequest(res.__("EMAIL_EXISTS_ALREADY"), "EMAIL_EXISTS_ALREADY", { fields: ['email'] });
    }

    if (req.body.phone) {
      let phoneExists = await Member.findOne({
        where: {
          deleted_flg: false,
          phone: req.body.phone
        }
      });

      if (phoneExists) {
        return res.badRequest(res.__("PHONE_EXISTS_ALREADY"), "PHONE_EXISTS_ALREADY", { fields: ['phone'] });
      }
    }

    if (req.body.referrer_code) {
      let memberReferrer = await Member.findOne({
        where: {
          referral_code: req.body.referrer_code,
          deleted_flg: false
        }
      });
      if (!memberReferrer) {
        return res.badRequest(res.__("NOT_FOUND_AFFILIATE_CODE"), "NOT_FOUND_AFFILIATE_CODE");
      }
    }

    let deactiveAccount = await Member.findOne({
      where: {
        deleted_flg: true,
        email: email,
      }
    });

    if (deactiveAccount) {
      return _activeAccount(deactiveAccount, req, res, next);
    }
    return _createAccount(req, res, next);
  }
  catch (err) {
    logger.error('register fail:', err);
    next(err);
  }
};

async function _activeAccount(member, req, res, next) {
  member.password_hash = bcrypt.hashSync(req.body.password, 10);
  member.member_sts = MemberStatus.UNACTIVATED;

  const now = new Date();
  let verifyToken = Buffer.from(uuidV4()).toString('base64');
  now.setHours(now.getHours() + config.expiredVefiryToken);
  await OTP.update({
    expired: true
  }, {
      where: {
        member_id: member.id,
        action_type: OtpType.REGISTER
      },
      returning: true
    });

  let otp = await OTP.create({
    code: verifyToken,
    used: false,
    expired: false,
    expired_at: now,
    member_id: member.id,
    action_type: OtpType.REGISTER
  });
  if (!otp) {
    return res.serverInternalError();
  }
  await member.save();
  _sendEmail(member, otp);
  let response = memberMapper(member);
  response.referral_code = "";
  return res.ok(response);
}

async function _createAccount(req, res, next) {
  const email = req.body.email.toLowerCase().trim();

  // TODO: Check email is exists on Affiliate and PluTX UserID before register this email on these system
  let affiliateInfo = null;
  let transaction;
  try {
    let createAffiliate = await Affiliate.register({ email, referrerCode: req.body.referrer_code || "" });
    if (createAffiliate.httpCode == 200) {
      affiliateInfo = {
        referral_code: createAffiliate.data.data.code,
        referrer_code: req.body.referrer_code || null,
        affiliate_id: createAffiliate.data.data.client_affiliate_id,
      };
    } else {
      return res.status(createAffiliate.httpCode).send(createAffiliate.data);
    }

    let emailConfirmed = false;
    let idOnPlutxUserID = null;
    const now = new Date();

    if (IS_ENABLED_PLUTX_USERID) {
      const registerMemberResult = await PluTXUserIdApi.register({
        email,
        password: req.body.password,
        createdAt: now,
        emailConfirmed: false,
        isActived: false,
      });

      if (registerMemberResult.httpCode === 200) {
        emailConfirmed = registerMemberResult.data.confirmed_flg;
        idOnPlutxUserID = registerMemberResult.data.id;
      } else {
        return res.status(registerMemberResult.httpCode).send(registerMemberResult.data);
      }
    }

    transaction = await database.transaction();
    const memberStatus = !emailConfirmed ? MemberStatus.UNACTIVATED : MemberStatus.ACTIVATED;
    let password = bcrypt.hashSync(req.body.password, 10);

    let member = await Member.create({
      email,
      password_hash: password,
      member_sts: memberStatus,
      phone: req.body.phone || "",
      ...affiliateInfo,
      plutx_userid_id: idOnPlutxUserID,
      membership_type_id: null,
      current_language: req.body.language,
      country_phone_code: req.body.country_phone_code
    }, {
        transaction: transaction
      });

    // if (memberStatus !== MemberStatus.ACTIVATED) {
    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    now.setHours(now.getHours() + config.expiredVefiryToken);
    await OTP.update({
      expired: true
    }, {
        where: {
          member_id: member.id,
          action_type: OtpType.REGISTER
        },
        returning: true,
        transaction: transaction,
      });

    let otp = await OTP.create({
      code: verifyToken,
      used: false,
      expired: false,
      expired_at: now,
      member_id: member.id,
      action_type: OtpType.REGISTER
    }, {
        transaction: transaction
      });
    await MemberSetting.create({
      member_id: member.id
    }, {
        transaction: transaction
      });

    _sendEmail(member, otp);
    // }
    await transaction.commit();

    member.referral_code = "";
    let response = memberMapper(member);
    return res.ok(response);
  }
  catch (err) {
    logger.error('register fail:', err);
    if (transaction) {
      await transaction.rollback();
    }
    // Remove affiliate data
    if (affiliateInfo) {
      const result = await Affiliate.unregister(email);
      logger.info('unregister fail:', result);
    }

    next(err);
  }
}

async function _sendEmail(member, otp) {
  try {
    let templateName = EmailTemplateType.VERIFY_EMAIL
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
      link: `${config.website.urlActive}${otp.code}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);

    await mailer.sendWithDBTemplate(subject, from, member.email, data, template.template);
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}
