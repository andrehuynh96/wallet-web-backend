const Joi = require('joi');

const schema = Joi.object().keys({
  amount: Joi.number().unsafe().required(),
  platform: Joi.string().required(),
  tx_id: Joi.string().required(),
});

module.exports = schema;