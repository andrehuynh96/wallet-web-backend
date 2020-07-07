const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const MemberStatus = require('app/model/wallet/value-object/member-status');
const memberMapper = require('app/feature/response-schema/member.response-schema');
const OTP = require('app/model/wallet').otps;
const OtpType = require('app/model/wallet/value-object/otp-type');
const database = require('app/lib/database').db().wallet;
const config = require("app/config");
const PluTXUserIdApi = require('app/lib/plutx-userid');
const IS_ENABLED_PLUTX_USERID = config.plutxUserID.isEnabled;
const Kyc = require('app/model/wallet').kycs;
const KycProperty = require('app/model/wallet').kyc_properties;
const MemberKyc = require('app/model/wallet').member_kycs;
const MemberKycProperty = require('app/model/wallet').member_kyc_properties;
const Joi = require("joi");
const KycDataType = require('app/model/wallet/value-object/kyc-data-type');
const KycStatus = require('app/model/wallet/value-object/kyc-status');

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

    if (IS_ENABLED_PLUTX_USERID && member.plutx_userid_id) {
      const registerMemberResult = await PluTXUserIdApi.activeNewUser(member.plutx_userid_id);

      if (registerMemberResult.httpCode !== 200) {
        return res.status(registerMemberResult.httpCode).send(registerMemberResult.data);
      }
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

    member = await _createKyc(member);
    return res.ok(memberMapper(member));
  }
  catch (err) {
    logger.error("verify member fail:", err);
    next(err);
  }
}


async function _createKyc(member) {
  let transaction;
  try {
    let kyc = await Kyc.findOne({
      where: {
        first_level_flg: true
      }
    });
    if (!kyc) {
      return member;
    }

    let oldMemberKyc = await MemberKyc.findOne({
      where: {
        kyc_id: kyc.id,
        member_id: member.id,
      }
    });
    if (oldMemberKyc) {
      return member;
    }

    const properties = await KycProperty.findAll({
      where: {
        kyc_id: kyc.id,
        enabled_flg: true
      },
      order: [['order_index', 'ASC']]
    });

    let dataMember = {};
    for (let p of properties) {
      if (member[p.member_field]) {
        dataMember[p.field_key] = member[p.member_field];
      }
    }

    let vefify = _validateKYCProperties(properties, dataMember);
    if (vefify.error) {
      return member;
    }
    transaction = await database.transaction();
    let memberKyc = await MemberKyc.create({
      member_id: member.id,
      kyc_id: kyc.id,
      status: kyc.auto_approve_flg ? KycStatus.APPROVED : KycStatus.IN_REVIEW,
    }, { transaction: transaction });

    let data = [];
    for (let p of properties) {
      let value = p.member_field ? member[p.member_field] : member[p.field_key];
      data.push({
        member_kyc_id: memberKyc.id,
        property_id: p.id,
        field_name: p.field_name,
        field_key: p.field_key,
        value: value
      });
    }
    await MemberKycProperty.bulkCreate(data, { transaction: transaction });
    let [_, response] = await Member.update({
      kyc_id: kyc.id.toString(),
      kyc_level: kyc.key,
      kyc_status: memberKyc.status
    }, {
        where: {
          id: member.id
        },
        returning: true,
        plain: true,
        transaction: transaction
      });
    await transaction.commit();
    return response;
  } catch (err) {
    if (transaction) {
      await transaction.rollback()
    };
    logger.error("create kyc account fail", err);
  }
}



function _validateKYCProperties(properties, data) {
  let obj = {};
  for (let p of properties) {
    obj[p.field_key] = _buildJoiFieldValidate(p);
  }

  let schema = Joi.object().keys(obj);
  return Joi.validate(data, schema);
}

function _buildJoiFieldValidate(p) {
  let result;
  switch (p.data_type) {
    case KycDataType.TEXT:
    case KycDataType.PASSWORD: {
      result = Joi.string();
      break;
    }
    case KycDataType.EMAIL: {
      result = Joi.string().email({
        minDomainAtoms: 2
      });
      break;
    }
    case KycDataType.UPLOAD: {
      result = Joi.any();
      break;
    }
    case KycDataType.DATETIME: {
      result = Joi.date();
      break;
    }
    default:
      {
        result = Joi.string();
        break;
      }
  }

  if (p.require_flg) {
    result = result.required()
  }
  else {
    result = result.optional()
  }

  return result;
} 