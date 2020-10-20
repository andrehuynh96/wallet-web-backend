const logger = require('app/lib/logger');
const config = require('app/config');
const ClaimPoint = require('app/model/wallet').claim_points;
const claimPointMapper = require('app/feature/response-schema/claim-point.response-schema');
const MembershipType = require('app/model/wallet').membership_types;
const Setting = require('app/model/wallet').settings;
module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('claim-point::all');
      const { query: { offset, limit}, user } = req;
      const where = { member_id: user.id };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: claims } = await ClaimPoint.findAndCountAll({ offset: off, limit: lim, where: where, order: [['created_at','DESC']] });
      return res.ok({
        items: claimPointMapper(claims),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get all claim point fail: ", err);
      next(err);
    }
  },
  setting: async (req, res, next) => {
    try {
      logger.info('claim-point::setting');
      let membershipType = await MembershipType.findOne({
        where: {
          id: req.user.membership_type_id,
          deleted_flg: false
        }
      })
      let setting = await Setting.findOne({
        where: {
          key: config.setting.MS_POINT_DELAY_TIME_IN_SECONDS
        }
      })
      return res.ok({
        amount: membershipType ? membershipType.claim_points : undefined,
        time: setting ? parseInt(setting.value) : undefined
      })
    } catch (err) {
      logger.error("get setting claim point fail: ", err);
      next(err);
    }
  }
}
