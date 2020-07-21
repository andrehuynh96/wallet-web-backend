const Joi = require('joi');

const schema = Joi.object().keys({
  'g-recaptcha-response': Joi.string(),
  language: Joi.string().required(),
});

module.exports = schema;