const Joi = require('joi');

const schema = Joi.object().keys({
  payment_ref_code: Joi.string().required(),
  amount: Joi.number().required(),
  account_number: Joi.string().required(),
  bank_name: Joi.string().required(),
  bracnch_name: Joi.string().required(),
  account_holder: Joi.string().required(),
  currency_symbol: Joi.string().required(),
  payment_type: Joi.string().required()
});

module.exports = schema;