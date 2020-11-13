const Joi = require('joi');

const schema = Joi.object().keys({
  nexo_id: Joi.string().required(),
  nexo_transaction_id: Joi.string().required(),
  code: Joi.string().required()
});

module.exports = schema;