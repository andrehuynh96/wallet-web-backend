const Joi = require('joi');
const schema = Joi.object().keys({
  default_flg: Joi.boolean().required()
});

module.exports = schema;