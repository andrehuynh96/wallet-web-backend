const Joi = require('joi');

const schema = Joi.object().keys({
  referrer_code: Joi.string().required(),
  payment_ref_code: Joi.string().required(),
  amount: Joi.number().required(),
  account_number: Joi.string().required(),
  bank_name: Joi.string().required(),
  swift: Joi.string().required(),
  account_name: Joi.string().required(),
  currency_symbol: Joi.string().required(),
  bank_account_id: Joi.number().required(),
  membership_type_id: Joi.string().required()
});

module.exports = schema;