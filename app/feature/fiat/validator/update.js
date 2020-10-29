const Joi = require('joi');
const schema = Joi.object().keys({
  order_id: Joi.string().required()
});

module.exports = schema;