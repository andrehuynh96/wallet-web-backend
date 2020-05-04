const logger = require('app/lib/logger');
const config = require('app/config');
const MemberPlutx = require('app/model/wallet').member_plutxs;
const mapper = require('app/feature/response-schema/member-plutx.response-schema');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('member_plutxs::all');
      const { query: { offset, limit}, user} = req;
      const where = { member_id: user.id };
      const off = parseInt(offset) || 0;
      const lim = parseInt(limit) || parseInt(config.appLimit);

      const { count: total, rows: plutxs } = await MemberPlutx.findAndCountAll({offset: off, limit: lim, where: where, order: [['updated_at', 'DESC']]});
      return res.ok({
        items: mapper(plutxs),
        offset: off,
        limit: lim,
        total: total
      });
    }
    catch (err) {
      logger.error("get member_plutxs fail: ", err);
      next(err);
    }
  }
}
