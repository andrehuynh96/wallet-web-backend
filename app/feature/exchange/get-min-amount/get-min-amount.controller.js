const logger = require('app/lib/logger');
const ExchangeFactory = require('app/service/exchange/factory');
const ExchangeProvider = require('app/service/exchange/provider');

module.exports = async (req, res, next) => {
  try {
    const Service = ExchangeFactory.create(ExchangeProvider.Changelly, {});
    let result = await Service.getMinAmount({
      from: req.body.from_currency,
      to: req.body.to_currency
    });
    if (result.error) {
      return res.badRequest(result.error.message, "EXCHANGE_PROVIDER_ERROR");
    }
    return res.ok(result.result);
  }
  catch (err) {
    logger.error('get min amount fail:', err);
    next(err);
  }
}