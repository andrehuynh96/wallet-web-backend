const Joi = require('joi');

const schema = Joi.object().keys({
  account_number: Joi.string().required(),
  bank_name: Joi.string().required(),
  branch_name: Joi.string().required(),
  account_name: Joi.string().required(),
  currency_symbol: Joi.string().required(),
  bank_account_id: Joi.string().required(),
});

module.exports = schema;