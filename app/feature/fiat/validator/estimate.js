const Joi = require('joi');

const schema = Joi.object().keys({
  amount: Joi.number().required().greater(0),
  source_currency: Joi.string().required(),
  dest_currency: Joi.string().required(),
  dest_address: Joi.string().required(),
  country: Joi.string().optional()
});

module.exports = schema;