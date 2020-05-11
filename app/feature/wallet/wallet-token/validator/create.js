const Joi = require('joi');

const schema = Joi.object().keys({
      symbol: Joi.string().allow('').optional(),
      platform: Joi.string().required(),
      sc_token_address: Joi.string().required(),
      decimals: Joi.number().optional(),
      name: Joi.string().allow('').optional(),
      icon: Joi.string().allow('').optional()
});

module.exports = schema;