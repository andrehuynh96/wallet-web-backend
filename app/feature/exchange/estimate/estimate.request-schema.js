const Joi = require('joi');

const schema = Joi.object().keys({
  from_currency: Joi.string().required(),
  to_currency: Joi.string().required(),
  amount: Joi.number().required(),
  fix_rate: Joi.boolean().optional()
});

module.exports = schema;