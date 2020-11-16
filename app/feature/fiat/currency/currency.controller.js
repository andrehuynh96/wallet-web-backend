const logger = require('app/lib/logger');
const FiatCurrency = require('app/model/wallet').fiat_currencies;
const FiatCurrencyStatus = require('app/model/wallet/value-object/fiat-currency-status');
const mapper = require('./currency.response-schema');
module.exports = async (req, res, next) => {
  try {
    let result = await FiatCurrency.findAll({
      where: {
        status: FiatCurrencyStatus.ENABLED
      },
      order: [['order_index', 'ASC'], ['id', 'ASC']],
      raw: true
    });
    return res.ok(mapper(result));
  }
  catch (err) {
    logger.error('get list fiat currency fail:', err);
    next(err);
  }
}