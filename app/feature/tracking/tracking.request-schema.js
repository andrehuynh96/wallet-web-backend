const Joi = require('joi');

const schema = Joi.object().keys({
	type: Joi.string().required(),
	tx_id: Joi.string().required(),
	platform: Joi.string().required(),
	symbol: Joi.string().required(),
	amount: Joi.number().required()
});

module.exports = schema;