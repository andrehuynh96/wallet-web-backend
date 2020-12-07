const Joi = require('joi');

const item = Joi.object().keys({
    question_id: Joi.number().required(),
    answer_id: Joi.array().items(Joi.number()).required(),
    value: Joi.array().items(Joi.string()).required()
});

const items = Joi.object().keys({
    items: Joi.array().items(item)
});

module.exports = items;