const logger = require('app/lib/logger');
const ExchangeCurrency = require('app/model/wallet').exchange_currencies;
const ExchangeCurrencyStatus = require('app/model/wallet/value-object/exchange-currency-status');
const mapper = require('app/feature/response-schema/exchange/exchange-currency.response-schema');

module.exports = async (req, res, next) => {
  try {
    let where = {};
    if (req.query.fix_rate) {
      where.fix_rate_flg = req.query.fix_rate;
    }
    let result = await ExchangeCurrency.findAll({
      where: {
        status: ExchangeCurrencyStatus.ENABLED,
        ...where
      },
      order: [['order_index', 'ASC'], ['id', 'ASC']],
      raw: true
    });
    res.ok(mapper(result));
  }
  catch (err) {
    logger.error('get list exchange currency fail:', err);
    next(err);
  }
}