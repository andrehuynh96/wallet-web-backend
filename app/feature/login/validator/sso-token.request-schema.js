const Joi = require('joi');

const schema = Joi.object().keys({
  token: Joi.string().max(100).required(),
});

module.exports = schema;
