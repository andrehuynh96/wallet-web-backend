const logger = require('app/lib/logger');
const paymentMethod = require('app/model/wallet/value-object/fiat-payment-method');
module.exports = async (req, res, next) => {
  try {
    let result = Object.values(paymentMethod);
    return res.ok(result);
  }
  catch (err) {
    logger.error('get list fiat currency fail:', err);
    next(err);
  }
}