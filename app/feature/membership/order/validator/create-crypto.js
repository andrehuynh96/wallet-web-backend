const Joi = require('joi');

const schema = Joi.object().keys({
  amount: Joi.number().required(),
  currency_symbol: Joi.string().required(),
  wallet_address: Joi.string().required(),
  your_wallet_address: Joi.string().required(),
  txid: Joi.string().required(),
  rate_by_usdt: Joi.number().required(),
  payment_type: Joi.string().required(),
  receiving_addresses_id: Joi.number().required()
});

module.exports = schema;