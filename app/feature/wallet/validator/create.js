const Joi = require('joi');

const schema = Joi.object().keys({
  passphrase_hash: Joi.string().required(),
  password_hash: Joi.string().required(),
  default_flg: Joi.boolean().optional()
});

module.exports = schema;