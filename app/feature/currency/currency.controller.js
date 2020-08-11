const logger = require('app/lib/logger');
const config = require('app/config');
const Currency = require('app/model/wallet').currencies;
const CurrencyStatus = require('app/model/wallet/value-object/currency-status');
const mapper = require('app/feature/response-schema/currency.response-schema');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
  getAll: async (req, res, next) => {
    try {
      logger.info('currencies::list');
      let { query: { search } } = req
      let limit = parseInt(req.query.limit) || parseInt(config.appLimit);
      let offset = req.query.offset ? parseInt(req.query.offset) : 0;
      let where = {};
      if (search) {
        where = {
          [Op.or]: [{
            symbol: { [Op.iLike]: `%${search}%` }
          },
          {
            name: { [Op.iLike]: `%${search}%` }
          },
          {
            platform: { [Op.iLike]: `%${search}%` }
          }]
        }
      }
      if (req.query.default != undefined) {
        where.default_flg = req.query.default;
      }
      where.status = CurrencyStatus.ENABLED;
      const { count: total, rows: items } = await Currency.findAndCountAll({ limit, offset, where: where, order: [['name', 'ASC']] });

      return res.ok({
        items: mapper(items),
        offset: offset,
        limit: limit,
        total: total
      });
    }
    catch (err) {
      logger.error('get list currency fail:', err);
      next(err);
    }
  }
}