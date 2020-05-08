const Joi = require("joi");

const schema = Joi.object().keys({
  referrer_code: Joi.string().required()
});

module.exports = schema;