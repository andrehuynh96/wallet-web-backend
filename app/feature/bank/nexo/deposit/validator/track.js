const Joi = require('joi');

const schema = Joi.object().keys({
  nexo_member_id: Joi.number().required(),
  platform: Joi.string().required(),
  nexo_currency_id: Joi.string().required(),
  nexo_id: Joi.string().required(),
  wallet_id: Joi.string().guid().optional(),
  address: Joi.string().optional(),
  memo: Joi.string().optional(),
  short_name: Joi.string().optional(),
  tx_id: Joi.string().optional(),
  response: Joi.string().optional(),
  amount: Joi.number().optional(),
  total_fee: Joi.number().optional()
});

module.exports = schema;