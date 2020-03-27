const logger = require("app/lib/logger");
const config = require("app/config");
const Member = require("app/model/wallet").members;
const OTP = require("app/model/wallet").otps;
const OtpType = require("app/model/wallet/value-object/otp-type");
const memberMapper = require('app/feature/response-schema/member.response-schema');
const bcrypt = require('bcrypt');
const mailer = require('app/lib/mailer');
const database = require('app/lib/database').db().wallet;
const otplib = require("otplib");
const Hashids = require('hashids/cjs');
const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const uuidV4 = require('uuid/v4');
const Axios = require('axios');

module.exports = async (req, res, next) => {
  try {
    let emailExists = await Member.findOne({
      where: {
        deleted_flg: false,
        email: req.body.email.toLowerCase()
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

    let salt = `${Date.now().toString()}`;
    let hashids = new Hashids(salt, 8, base58chars);
    let referralCode = hashids.encode(1, 2, 3, 4);
    let password = bcrypt.hashSync(req.body.password, 10);
    let member = await Member.create({
      email: req.body.email.toLowerCase(),
      password_hash: password,
      phone: req.body.phone || "",
      referral_code: referralCode,
      referrer_code: req.body.referrer_code || "",
    });
    if (!member) {
      return res.serverInternalError();
    }

    let verifyToken = Buffer.from(uuidV4()).toString('base64');
    let otpCode = otplib.authenticator.generate(Date.now().toString());
    let today = new Date();
    today.setHours(today.getHours() + config.expiredVefiryToken);
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
      expired_at: today,
      member_id: member.id,
      action_type: OtpType.REGISTER
    });
    if (!otp) {
      return res.serverInternalError();
    }
    _sendEmail(member, otp);
    _createKyc(member.id, req.body.email.toLowerCase());
    let response = memberMapper(member);
    return res.ok(response);

  }
  catch (err) {
    logger.error('register fail:', err);
    next(err);
  }
}

async function _sendEmail(member, otp) {
  try {
    let subject = `${config.emailTemplate.partnerName} - Create Account`;
    let from = `${config.emailTemplate.partnerName} <${config.mailSendAs}>`;
    let data = {
      imageUrl: config.website.urlImages,
      link: `${config.website.urlActive}?token=${otp.code}`,
      hours: config.expiredVefiryToken
    }
    data = Object.assign({}, data, config.email);
    await mailer.sendWithTemplate(subject, from, member.email, data, config.emailTemplate.verifyEmail);
  } catch (err) {
    logger.error("send email create account fail", err);
  }
}

async function _createKyc(member_id, email) {
  try {
    /** create kyc */
    let params = {body: {email: email, type: 'Staking'}}
    let kyc = await _makeRequest('/api/kycs/me/customers', params, 'post');
    _updateStatus(kyc.id, 'APPROVE');
    await Member.update({
      kyc_id: kyc.id
    }, {
        where: {
          id: member_id,
        },
        returning: true
      });
  } catch (err) {
    logger.error("create kyc account fail", err);
  }
}

async function _updateStatus(kyc_id, action) {
  try {
    let params = {body: {level: 1, expiry: 60000, comment: "update level 1"}}
    await _makeRequest(`/api/kycs/me/customers/${kyc_id}/${action}`, params, 'put');
  } catch(err) {
    logger.error("update kyc account fail", err);
  }
} 

async function _makeRequest(path, params, method) {
  try {
    let data = params ? params.body || {} : params;
    let header = {"x-user": config.kyc.name};
    let url = path ? config.kyc.baseUrl + path : config.kyc.baseUrl;
    let config = {
      method: method,
      url: url,
      data: data,
      headers: header,
    };

    let res = await Axios(config).catch(e => {
      return { data: e.response.data };
    });
    if (res.data.error) {
      return { error: res.data.error, data: null };
    } else {
      return { error: null, data: res.data };
    }
  } catch (err) {
    return { error: err, data: null };
  }
}
