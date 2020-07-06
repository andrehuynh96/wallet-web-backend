const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const KycPermission = require('app/model/wallet/value-object/kyc-permission');
const KycStatus = require('app/model/wallet/value-object/kyc-status');
const Kyc = require('app/model/wallet').kycs;
const KycProperty = require('app/model/wallet').kyc_properties;
const MemberKyc = require('app/model/wallet').member_kycs;
const MemberKycProperty = require('app/model/wallet').member_kyc_properties;
const KycMapper = require('app/feature/response-schema/kyc.response-schema');
const KycPropertyMapper = require('app/feature/response-schema/kyc-property.response-schema');
const Joi = require("joi");
const KycDataType = require('app/model/wallet/value-object/kyc-data-type');
const s3 = require("app/service/s3.service");
const util = require("util");
const path = require("path");
const toArray = require("stream-to-array");

module.exports = {
  get: async (req, res, next) => {
    try {
      let member = await Member.findOne({
        where: {
          id: req.user.id,
          deleted_flg: false
        }
      });
      if (!member) {
        return res.badRequest(res.__("USER_NOT_FOUND"), "USER_NOT_FOUND");
      }
      let permissionLv = member.kyc_status == KycStatus.APPROVED ? member.kyc_level : member.kyc_level - 1;
      let permissions = KycPermission[`${permissionLv}`];
      return res.ok(permissions);
    } catch (error) {
      logger.error("kyc permissions fail: ", error);
      next(err);
    }
  },

  schema: async (req, res, next) => {
    try {
      logger.info("kyc::schema");
      const { rows: kycs } = await Kyc.findAndCountAll({ include: { model: KycProperty, order: [['order_index', 'ASC']] }, order: [['prev_level', 'ASC']] });
      return res.ok(KycMapper(kycs));
    } catch (err) {
      logger.error("kyc schema fail: ", err);
      next(err);
    }
  },

  getProperties: async (req, res, next) => {
    try {
      logger.info("kyc::property::schema");
      const kyc = await Kyc.findOne({ where: { key: req.params.key } });
      if (!kyc) {
        return res.badRequest(res.__("KYC_NOT_FOUND"), "KYC_NOT_FOUND");
      }
      const { rows: kyc_properties } = await KycProperty.findAndCountAll({ where: { kyc_id: kyc.id, enabled_flg: true }, order: [['order_index', 'ASC']] });
      return res.ok(KycPropertyMapper(kyc_properties));
    } catch (err) {
      logger.error("kyc scheme properties fail: ", err);
      next(err);
    }
  },

  submit: async (req, res, next) => {
    let transaction;
    try {
      let kyc = await Kyc.findOne({
        where: {
          key: req.body.kyc_key,
        }
      });
      if (!kyc) {
        return res.badRequest(res.__("KYC_NOT_FOUND"), "KYC_NOT_FOUND");
      }

      if (kyc.have_to_pass_prev_level_flg && kyc.prev_level > 0) {
        let passedLevel = await MemberKyc.findOne({
          where: {
            kyc_id: kyc.prev_level,
            member_id: req.user.id,
            status: KycStatus.APPROVED
          }
        });
        if (!passedLevel) {
          return res.badRequest(res.__("HAVE_TO_PASS_PRE_LEVEL"), "HAVE_TO_PASS_PRE_LEVEL");
        }
      }

      let oldMemberKyc = await MemberKyc.findOne({
        where: {
          kyc_id: kyc.id,
          member_id: req.user.id,
        }
      });
      if (oldMemberKyc) {
        return res.badRequest(res.__("SUBMIT_KYC_LEVEL_ALREADY"), "SUBMIT_KYC_LEVEL_ALREADY");
      }

      const properties = await KycProperty.findAll({
        where: {
          kyc_id: kyc.id,
          enabled_flg: true
        },
        order: [['order_index', 'ASC']]
      });

      delete req.body.kyc_key;

      let vefify = _validateKYCProperties(properties, req.body)
      if (vefify.error) {
        return res.badRequest("Missing parameters", vefify.error);
      }

      transaction = await database.transaction();
      let memberKyc = await MemberKyc.create({
        member_id: req.user.id,
        kyc_id: kyc.id,
        status: kyc.auto_approve_flg ? KycStatus.APPROVED : KycStatus.IN_REVIEW,
      }, { transaction: transaction });

      let data = [];
      let memberData = {};
      for (let p of properties) {
        let value = req.body[p.field_key];
        if (p.data_type == KycDataType.UPLOAD) {
          value = await _uploadFile(p.field_key, req, res, next);
        }
        if (p.member_field) {
          memberData[p.member_field] = value;
        }

        data.push({
          member_kyc_id: memberKyc.id,
          property_id: p.id,
          field_name: p.field_name,
          field_key: p.field_key,
          value: value
        });
      }
      await MemberKycProperty.bulkCreate(member_kyc_id, { transaction: transaction });
      let [_, response] = await Member.update({
        kyc_level: kyc.key,
        kyc_status: memberKyc.status,
        ...memberData
      }, {
          where: {
            id: req.user.id
          },
          returning: true,
          plain: true,
          transaction: transaction
        });
      req.session.user = response;
      await transaction.commit();
      return res.ok(true);
    } catch (err) {
      if (transaction) {
        await transaction.rollback()
      };
      logger.error("submit kyc fail: ", err);
      next(err);
    }
  },
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

async function _uploadFile(field, req, res, next) {
  return new Promise(async (resolve, reject) => {
    let file = path.parse(req.body[field].file.name);
    if (config.CDN.exts.indexOf(file.ext.toLowerCase()) == -1) {
      reject("NOT_SUPPORT_FILE_EXTENSION");
    }
    let uploadName = `${config.CDN.folderKYC}/${file.name}-${Date.now()}${
      file.ext
      }`;
    let buff = await toArray(req.body[field].data).then(function (parts) {
      const buffers = parts.map(part =>
        util.isBuffer(part) ? part : Buffer.from(part)
      );
      return Buffer.concat(buffers);
    });
    let putObject = await s3.put(uploadName, buff, next);
    if (putObject) {
      let uploadUrl = encodeURI(
        `https://${config.aws.bucket}.${config.aws.endpoint.slice(
          config.aws.endpoint.lastIndexOf("//") + 2
        )}/${uploadName}`
      );
      resolve(uploadUrl);
    } else reject("UPLOAD_S3_FAILED");
  });
} 