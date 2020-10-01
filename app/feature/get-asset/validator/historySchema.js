const Joi = require('joi');

const _sort = ['asc', 'desc'];

const schema = Joi.object().keys({
    platform: Joi.string().optional(),
    wallet_id: Joi.string().guid().optional(),
    sort: Joi.string().valid(_sort).optional(),
    offset: Joi.number().optional(),
    limit: Joi.number().optional(),
});

module.exports = schema;
