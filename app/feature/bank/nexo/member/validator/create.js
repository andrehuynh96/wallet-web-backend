const Joi = require('joi');

const schema = Joi.object().keys({
  email: Joi.string().email({
    minDomainAtoms: 2
  }).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required()
});

module.exports = schema;