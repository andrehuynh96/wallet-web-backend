const Joi = require('joi');

const schema = Joi.object().keys({
  items: Joi.array().required().items(
    Joi.object().keys({
      private_key_hash: Joi.string().required(),
      platform: Joi.string().required(),
      address: Joi.string().required(),
      hd_path: Joi.string().required()
    })
  ),
  password_hash: Joi.string().required()
});

module.exports = schema;