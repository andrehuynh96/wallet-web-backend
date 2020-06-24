const Joi = require('joi');

const schema = Joi.object().keys({
  currency_symbol: Joi.string().required(),
  bank_name: Joi.string().required(),
  branch_name: Joi.string().required(),
  account_holder: Joi.string().required(),
  account_number: Joi.string().required(),
  account_address: Joi.string().optional().allow(""),
  swift: Joi.string().required().optional().allow(""),
  default_flg: Joi.boolean().required(),
});

module.exports = schema; 