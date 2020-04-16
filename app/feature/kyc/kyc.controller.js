const logger = require('app/lib/logger');
const Member = require('app/model/wallet').members;
const KycPermission = require('app/model/wallet/value-object/kyc-permission');
const KycStatus = require('app/model/wallet/value-object/kyc-status');
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
  }
}