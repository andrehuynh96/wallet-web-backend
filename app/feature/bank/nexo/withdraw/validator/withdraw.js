const Joi = require('joi');

const schema = Joi.object().keys({
  nexo_id: Joi.string().required(),
  wallet_id: Joi.string().required(),
  wallet_address: Joi.string().required(),
  tag: Joi.string().optional,
  amount: Joi.number().required(),
  platform: Joi.string().required(),
  currency_id: Joi.string().required()
});

module.exports = schema;