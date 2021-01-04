const Joi = require("joi");

const schema = Joi.object().keys({
  'g-recaptcha-response': Joi.string(),
  email: Joi.string().email({
    minDomainAtoms: 2
  }).required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()-_=+]{6,30}$/)
    .required(),
  phone: Joi.string().optional().allow(""),
  referrer_code: Joi.string().optional().allow(""),
  language: Joi.string(),
  country: Joi.string().regex(/^[a-zA-Z]{2,30}$/).required(),
});

module.exports = schema;