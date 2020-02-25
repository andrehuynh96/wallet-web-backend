const Joi = require('joi');
const schema = Joi.object().keys({
  password_hash: Joi.string().required(),
  default_flg: Joi.boolean().required()
});

module.exports = schema;