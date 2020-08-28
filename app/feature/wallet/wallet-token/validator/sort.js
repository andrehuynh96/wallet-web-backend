const Joi = require('joi');

const schema = Joi.object().keys({
    items: Joi.array().required().items(
        Joi.object().keys({
            symbol: Joi.string().required(),
            platform: Joi.string().required(),
            index: Joi.number().required()
        })
  )
});

module.exports = schema;