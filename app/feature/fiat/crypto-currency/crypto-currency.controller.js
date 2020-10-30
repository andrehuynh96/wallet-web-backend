const logger = require('app/lib/logger');
const FiatCryptoCurrency = require('app/model/wallet').fiat_cryptocurrencies;
const FiatCurrencyStatus = require('app/model/wallet/value-object/fiat-currency-status');
const mapper = require('./crypto-currency.response-schema');
module.exports = async (req, res, next) => {
  try {
    let result = await FiatCryptoCurrency.findAll({
      where: {
        status: FiatCurrencyStatus.ENABLED
      },
      order: [['order_index', 'ASC'], ['id', 'ASC']],
      raw: true
    });
    return res.ok(mapper(result));
  }
  catch (err) {
    logger.error('get list fiat crypto currency fail:', err);
    next(err);
  }
}