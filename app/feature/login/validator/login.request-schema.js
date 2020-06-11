const Joi = require('joi');

const schema = Joi.object().keys({
  'g-recaptcha-response': Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required()
});

module.exports = schema;