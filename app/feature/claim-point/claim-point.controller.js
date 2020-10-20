const logger = require('app/lib/logger');
const config = require('app/config');
const ClaimPoint = require('app/model/wallet').claim_points;
const claimPointMapper = require('app/feature/response-schema/claim-point.response-schema');
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
  }
}
