const logger = require('app/lib/logger');
const config = require('app/config');
const StakingPlatform = require('app/model/staking').staking_platforms;
const StakingPlatformStatus = require('app/model/staking/value-object/staking-platform-status');
const mapper = require('app/feature/response-schema/staking-platform.response-schema');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      let limit = parseInt(req.query.limit) || parseInt(config.appLimit);
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = { deleted_flg: false,  status: StakingPlatformStatus.ENABLED};

      const { count: total, rows: items } = await StakingPlatform.findAndCountAll({ limit, offset, where: where, order: [['order_index', 'ASC']] });

      return res.ok({
        items: mapper(items),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('getAll staking platform fail:', err);
      next(err);
    }
  }
}