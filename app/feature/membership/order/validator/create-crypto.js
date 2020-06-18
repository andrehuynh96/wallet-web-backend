const Joi = require('joi');

const schema = Joi.object().keys({
  referrer_code: Joi.string().required(),
  amount: Joi.number().required(),
  currency_symbol: Joi.string().required(),
  wallet_address: Joi.string().required(),
  your_wallet_address: Joi.string().required(),
  txid: Joi.string().required(),
  receiving_addresses_id: Joi.number().required(),
  membership_type_id: Joi.string().required()
});

module.exports = schema;