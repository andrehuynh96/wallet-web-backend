const Joi = require('joi');

const _filter = ['all', 'day', 'week', 'month', 'year'];
const _sort = ['asc', 'desc'];

const schema = Joi.object().keys({
    type: Joi.string().valid(_filter).optional(),
    platform: Joi.string().optional(),
    wallet_id: Joi.string().guid().optional(),
    sort: Joi.string().valid(_sort).optional(),
});

module.exports = schema;
