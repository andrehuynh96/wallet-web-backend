const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const KycPermission = require('app/model/wallet/value-object/kyc-permission');
const KycStatus = require('app/model/wallet/value-object/kyc-status');
const Kyc = require('app/model/wallet').kycs;
const KycProperty = require('app/model/wallet').kyc_properties;
const KycMapper = require('app/feature/response-schema/kyc.response-schema');

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
  }
}