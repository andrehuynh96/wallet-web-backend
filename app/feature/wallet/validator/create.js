const Joi = require('joi');

const schema = Joi.object().keys({
  passphrase_hash: Joi.string().required(),
  password_hash: Joi.string().required()
});

module.exports = schema;