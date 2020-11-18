const Joi = require('joi');

const schema = Joi.object().keys({
  nexo_member_id: Joi.number().required(),
  platform: Joi.string().required(),
  nexo_currency_id: Joi.string().required(),
  nexo_id: Joi.string().required(),
  wallet_id: Joi.string().guid().allow(null, '').optional(),
  address: Joi.string().allow(null, '').optional(),
  memo: Joi.string().allow(null, '').optional(),
  short_name: Joi.string().allow(null, '').optional(),
  tx_id: Joi.string().allow(null, '').optional(),
  response: Joi.string().allow(null, '').optional(),
  amount: Joi.number().allow(null, '').optional(),
  total_fee: Joi.number().optional()
});

module.exports = schema;