const Joi = require('joi');

const schema = Joi.object().keys({
  from_currency: Joi.string().required(),
  to_currency: Joi.string().required(),
  amount: Joi.number().required().greater(0),
  address: Joi.string().required(),
  extra_id: Joi.string()
    .allow('')
    .allow(null)
    .optional(),
  refund_address: Joi.string()
    .allow('')
    .allow(null)
    .optional(),
  refund_extra_id: Joi.string()
    .allow('')
    .allow(null)
    .optional(),
  rate_id: Joi.string().optional(),
  amount_to: Joi.number().optional()
});

module.exports = schema;