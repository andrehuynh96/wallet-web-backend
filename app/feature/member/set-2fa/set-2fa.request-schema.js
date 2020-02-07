const Joi = require('joi');

const schema = Joi.object().keys({
  twofa_secret: Joi.string().required(),
  twofa_code: Joi.string().required(),
});

module.exports = schema;