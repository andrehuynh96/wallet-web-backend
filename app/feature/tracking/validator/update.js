const Joi = require('joi');

const schema = Joi.object().keys({
    note: Joi.string().required(),
})

module.exports = schema;