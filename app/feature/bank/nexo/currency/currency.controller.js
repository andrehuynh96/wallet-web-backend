const logger = require('app/lib/logger');
const NexoCurrency = require('app/model/wallet').nexo_currencies;
const Status = require("app/model/wallet/value-object/nexo-currency-status");
const mapper = require("./currency.response-schema");

module.exports = {
  get: async (req, res, next) => {
    try {
      let currencies = await NexoCurrency.findAll({
        where: {
          status: Status.ENABLED
        },
        order: [['order_index', 'DESC']],
        raw: true
      });
      return res.ok(mapper(currencies));

    } catch (err) {
      logger[err.canLogAxiosError ? 'error' : 'info']('get currency fail:', err);
      next(err);
    }
  }
};
