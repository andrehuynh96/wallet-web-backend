const Joi = require('joi');
const schema = Joi.object().keys({
  default_flg: Joi.boolean().optional(),
  name: Joi.string().optional(),
  encrypted_passphrase: Joi.string().optional()
});

module.exports = schema;