const Joi = require('joi');

const schema = Joi.object().keys({
  twofa_secret: Joi.string().optional().allow(""),
  twofa_code: Joi.string().required(),
  disable: Joi.boolean(),
  disable_twofa_download_key: Joi.boolean()
});

module.exports = schema;