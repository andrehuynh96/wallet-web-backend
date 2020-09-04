const Joi = require('joi');

const schema = Joi.object().keys({
  from_currency: Joi.string().required(),
  to_currency: Joi.string().required(),
});

module.exports = schema;