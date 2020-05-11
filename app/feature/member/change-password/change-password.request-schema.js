const Joi = require('joi');

const schema = Joi.object().keys({
  'g-recaptcha-response': Joi.string(),
  password: Joi.string().required(),
  new_password: Joi.string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()-_=+]{10,30}$/)
    .required(),
});

module.exports = schema;