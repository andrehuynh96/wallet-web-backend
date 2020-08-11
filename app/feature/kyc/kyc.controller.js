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
const database = require('app/lib/database').db().wallet;
const MemberKycMapper = require('app/feature/response-schema/member-kyc.response-schema');
const MemberKycPropertyMapper = require('app/feature/response-schema/member-kyc-property.response-schema');
const config = require('app/config');
const Membership = require('app/lib/reward-system/membership');

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
        let note = '';
        if (p.data_type == KycDataType.UPLOAD && req.body[p.field_key]) {
          value = await _uploadFile(p.field_key, req, res, next);
          note = req.body[p.field_key].file.name;
        }
        if (p.member_field) {
          memberData[p.member_field] = value || "";
        }

        data.push({
          member_kyc_id: memberKyc.id,
          property_id: p.id,
          field_name: p.field_name,
          field_key: p.field_key,
          value: value || "",
          note: note || ""
        });
      }

      let member = await Member.findOne({
        where: {
          id: req.user.id
        }
      });

      if (memberKyc.status == KycStatus.APPROVED &&
        kyc.approve_membership_type_id &&
        !member.membership_type_id) {
        memberData.membership_type_id = kyc.approve_membership_type_id;
      }

      await MemberKycProperty.bulkCreate(data, { transaction: transaction });
      let [_, response] = await Member.update({
        kyc_id: kyc.id.toString(),
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

      if (memberKyc.status == KycStatus.APPROVED &&
        kyc.approve_membership_type_id &&
        !member.membership_type_id) {
        let result = await Membership.updateMembershipType(
          {
            email: member.email,
            membership_type_id: kyc.approve_membership_type_id
          });
        if (result.httpCode !== 200) {
          await transaction.rollback();
          return res.status(result.httpCode).send(result.data);
        }
      }

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

  getKycs: async (req, res, next) => {
    try {
      logger.info("member::kyc");
      const include = [{ model: Kyc, as: 'Kyc' }];
      const memberKycs = await MemberKyc.findAll({ where: { member_id: req.user.id }, include: include, order: [['kyc_id', 'ASC']] });
      console.log('memberKycs: ', memberKycs[0].Kyc.name);
      return res.ok(MemberKycMapper(memberKycs));
    } catch (err) {
      logger.error("member kyc fail: ", err);
      next(err);
    }
  },

  getKycProperties: async (req, res, next) => {
    try {
      logger.info("kyc::property::schema");
      const kyc = await Kyc.findOne({ where: { key: req.params.key } });
      if (!kyc) {
        return res.badRequest(res.__("KYC_NOT_FOUND"), "KYC_NOT_FOUND");
      }
      const memberKyc = await MemberKyc.findOne({ where: { member_id: req.user.id, kyc_id: kyc.id } });
      if (!memberKyc) {
        return res.badRequest(res.__("MEMBER_KYC_NOT_FOUND"), "MEMBER_KYC_NOT_FOUND");
      }
      const memberKycProperties = await MemberKycProperty.findAll({ where: { member_kyc_id: memberKyc.id }, order: [['updated_at', 'DESC']] });
      return res.ok(MemberKycPropertyMapper(memberKycProperties));
    } catch (err) {
      logger.error("kyc scheme properties fail: ", err);
      next(err);
    }
  },

  resubmit: async (req, res, next) => {
    let transaction;
    try {
      if (req.user.kyc_level == "LEVEL_2" &&
        req.user.kyc_status == KycStatus.APPROVED) {
        return res.badRequest(res.__("KYC_HAVE_BEEN_FINISHED"), "KYC_HAVE_BEEN_FINISHED");
      }
      let kyc = await Kyc.findOne({
        where: {
          key: req.body.kyc_key,
        }
      });
      if (!kyc) {
        return res.badRequest(res.__("KYC_NOT_FOUND"), "KYC_NOT_FOUND");
      }
      if (!kyc.allow_modify) {
        return res.badRequest(res.__("NOT_ALLOW_MODIFY_THIS_KYC"), "NOT_ALLOW_MODIFY_THIS_KYC");
      }

      let memberKyc = await MemberKyc.findOne({
        where: {
          kyc_id: kyc.id,
          member_id: req.user.id,
        }
      });
      if (!memberKyc) {
        return res.badRequest(res.__("NOT_SUBMIT_KYC_YET"), "NOT_SUBMIT_KYC_YET");
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
      let data = [];
      let memberData = {};
      for (let p of properties) {
        let value = req.body[p.field_key];
        let note = '';
        if (p.data_type == KycDataType.UPLOAD && req.body[p.field_key]) {
          value = await _uploadFile(p.field_key, req, res, next);
          note = req.body[p.field_key].file.name;
        }
        if (p.member_field) {
          memberData[p.member_field] = value || "";
        }

        data.push({
          member_kyc_id: memberKyc.id,
          property_id: p.id,
          field_name: p.field_name,
          field_key: p.field_key,
          value: value || "",
          note: note || "",
        });
      }

      let oldProperties = await MemberKycProperty.findAll({
        where: {
          member_kyc_id: memberKyc.id
        }
      });

      let propertyIds = oldProperties.map(x => x.property_id);
      let itemCreate = data.filter(x => propertyIds.indexOf(x.property_id) == -1);
      let itemUpdate = data.filter(x => propertyIds.indexOf(x.property_id) > -1);

      if (itemCreate && itemCreate.length > 0) {
        await MemberKycProperty.bulkCreate(itemCreate, { transaction: transaction });
      }
      if (itemUpdate && itemUpdate.length > 0) {
        for (let i of itemUpdate) {
          await MemberKycProperty.update({
            field_name: i.field_name,
            field_key: i.field_key,
            value: i.value,
            note: i.note,
          }, {
            where: {
              member_kyc_id: i.member_kyc_id,
              property_id: i.property_id,
            },
            returning: true,
            plain: true,
            transaction: transaction
          });
        }
      }

      let [_, response] = await Member.update({
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
      if (!p.require_flg) {
        result = result.allow("")
      }
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
        if (!p.require_flg) {
          result = result.allow("")
        }
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
      return reject("NOT_SUPPORT_FILE_EXTENSION");
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
      return resolve(uploadUrl);
    }
    else {
      reject("UPLOAD_S3_FAILED");
    }
  });
} 