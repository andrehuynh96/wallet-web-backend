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
const database = require('app/lib/database').db().wallet;
const otplib = require("otplib");
const Hashids = require('hashids/cjs');
const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const uuidV4 = require('uuid/v4');
const Kyc = require('app/lib/kyc');
const Affiliate = require('app/lib/reward-system/affiliate');
const PluTXUserIdApi = require('app/lib/plutx-userid');
const MemberStatus = require("app/model/wallet/value-object/member-status");
const Membership = require('app/lib/reward-system/membership');

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

    // TODO: Check email is exists on Affiliate and PluTX UserID before register this email on these system
    let affiliateInfo = {};
    let createAffiliate = await Affiliate.register({ email, referrerCode: req.body.referrer_code || "" });
    if (createAffiliate.httpCode == 200) {
      affiliateInfo.referral_code = createAffiliate.data.data.code;
      affiliateInfo.referrer_code = req.body.referrer_code || "";
      affiliateInfo.affiliate_id = createAffiliate.data.data.client_affiliate_id;
    }
    else {
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
    });

    if (!member) {
      return res.serverInternalError();
    }

    if (memberStatus !== MemberStatus.ACTIVATED) {
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
      _sendEmail(member, otp);
    }

    if (member.referral_code) {
      let checkReferrerCode = await Membership.isCheckReferrerCode({ referrerCode: member.referral_code });
      if (checkReferrerCode.httpCode !== 200) {
        member.referral_code = "";
      } else if (!checkReferrerCode.data.data.isValid) {
        member.referral_code = "";
      }
    }
    let response = memberMapper(member);
    return res.ok(response);
  }
  catch (err) {
    logger.error('register fail:', err);

    next(err);
  }
};

async function _sendEmail(member, otp) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Create Account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.website.urlActive}${otp.code}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);

    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.verifyEmail);
  } catch (err) {
    logger.error("send email create account fail", err);
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
    let content = {};
    content[`${config.kyc.schema}`] = { email: email };
    let params = { body: [{ level: 1, content: content }], kycId: kycId };
    return await Kyc.submit(params);
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
