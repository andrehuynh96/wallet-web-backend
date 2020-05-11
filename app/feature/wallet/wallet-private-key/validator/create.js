const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      encrypted_private_key: Joi.string().required(),
      platform: Joi.string().required(),
      address: Joi.string().required(),
      hd_path: Joi.string().required()
    })
  )
});

module.exports = schema;