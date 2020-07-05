const Joi = require('joi');

const schema = Joi.object().keys({
  amount: Joi.number().required(),
  your_wallet_address: Joi.string().required(),
  txid: Joi.string().required(),
  receiving_addresses_id: Joi.number().required(),
  membership_type_id: Joi.string().required()
});

module.exports = schema;