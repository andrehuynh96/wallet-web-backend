const Joi = require('joi');

const schema = Joi.object().keys({
  amount: Joi.number().required(),
  currency_symbol: Joi.string().required(),
  member_account_id: Joi.number().required(),
  latest_id: Joi.number().required()
});

module.exports = schema;