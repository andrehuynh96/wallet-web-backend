const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      id: Joi.string().required(),
      encrypted_private_key: Joi.string().required(),
      platform: Joi.string().required()
    })
  )
});

module.exports = schema;