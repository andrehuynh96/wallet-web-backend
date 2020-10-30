const Joi = require('joi');

const schema = Joi.object().keys({
  amount: Joi.number().required().greater(0),
  source_currency: Joi.string().required(),
  dest_currency: Joi.string().required(),
  dest_address: Joi.string().required(),
  payment_method: Joi.string().required(),
  redirect_url: Joi.string().optional(),
  failure_redirect_url: Joi.string().optional() 
});

module.exports = schema;