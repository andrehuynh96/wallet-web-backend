const Joi = require('joi');

const schema = Joi.object().keys({
  encrypted_passphrase: Joi.string().required(),
  name: Joi.string().required(),
  default_flg: Joi.boolean().optional()
});

module.exports = schema;