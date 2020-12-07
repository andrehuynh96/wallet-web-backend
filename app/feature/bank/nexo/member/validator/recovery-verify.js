const Joi = require('joi');

const schema = Joi.object().keys({
    email:  Joi.string().email({
        minDomainAtoms: 2
      }).required(),
    code: Joi.string().required()
})

module.exports = schema