const Joi = require('joi');

const schema = Joi.object().keys({
  membership_type_id: Joi.string().required()
});

module.exports = schema;