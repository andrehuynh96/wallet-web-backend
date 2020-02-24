const Joi = require('joi');

const schema = Joi.object().keys({
  twofa_code: Joi.string().required(),
  disable_twofa_download_key: Joi.boolean().required()
});

module.exports = schema;