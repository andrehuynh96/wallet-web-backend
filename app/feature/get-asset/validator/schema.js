const Joi = require('joi');

const _filter = ['all', 'day', 'week', 'month', 'year'];

const schema = Joi.object().keys({
    type: Joi.string().valid(_filter).optional(),
    platform: Joi.string().optional(),
    wallet_id: Joi.string().guid().optional(),
});

module.exports = schema;
