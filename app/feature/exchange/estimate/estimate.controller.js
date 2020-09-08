const logger = require('app/lib/logger');
const ExchangeFactory = require('app/service/exchange/factory');
const ExchangeProvider = require('app/service/exchange/provider');

module.exports = async (req, res, next) => {
  try {
    const Service = ExchangeFactory.create(ExchangeProvider.Changelly, {});
    let result = await Service.estimate({
      from: req.body.from_currency,
      to: req.body.to_currency,
      amount: req.body.amount,
      fix_rate: req.body.fix_rate,
    });
    if (result.error) {
      return res.badRequest(res.__("EXCHANGE_PROVIDER_ERROR"), result.error.message);
    }
    res.ok(result.result[0]);
  }
  catch (err) {
    logger.error('estimate fail:', err);
    next(err);
  }
}