const Joi = require('joi');

const _filter = ['all', 'day', 'week', 'month', 'year'];

const schema = Joi.object().keys({
    filter: Joi.string().valid(_filter).required(),
    platform: Joi.string().required(),
    limit: Joi.number().optional(),
    offset: Joi.number().optional(),
});

module.exports = schema;
