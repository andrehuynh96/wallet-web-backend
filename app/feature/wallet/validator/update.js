const Joi = require('joi');
const schema = Joi.object().keys({
  default_flg: Joi.boolean().optional(),
  name: Joi.string().optional()
});

module.exports = schema;