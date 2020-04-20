const Joi = require('joi');

const schema = Joi.object().keys({
    twofa_code: Joioi.number().require(),
    reasons: Joi.array().required().items(
        Joi.object().keys({
            question: Joi.string().required(),
            answer: Joi.string().required()
        })
  )
});

module.exports = schema;