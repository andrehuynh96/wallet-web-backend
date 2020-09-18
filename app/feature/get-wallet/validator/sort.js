const Joi = require('joi');

const schema = Joi.object().keys({
    items: Joi.array().required().items(
        Joi.object().keys({
            wallet_id: Joi.string().required(),
            index: Joi.number().required()
        })
  )
});

module.exports = schema;
